-- Feature Expansion Migration
-- Drafts, Private Drops (E2EE), and Dark Mode support

-- 1. Create Drafts Table
CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT,
  layout TEXT DEFAULT 'classic',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create Private Drops Table (E2EE)
CREATE TABLE IF NOT EXISTS public.private_drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  encrypted_title TEXT NOT NULL,
  encrypted_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Update Profiles Table for E2EE and Theme
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='public_key') THEN
        ALTER TABLE public.profiles ADD COLUMN public_key TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='theme_preference') THEN
        ALTER TABLE public.profiles ADD COLUMN theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'system'));
    END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_drops ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
DO $$ 
BEGIN
    -- Drafts Policies
    DROP POLICY IF EXISTS "Users can view their own drafts." ON public.drafts;
    CREATE POLICY "Users can view their own drafts." ON public.drafts FOR SELECT USING (auth.uid() = author_id);
    
    DROP POLICY IF EXISTS "Users can insert their own drafts." ON public.drafts;
    CREATE POLICY "Users can insert their own drafts." ON public.drafts FOR INSERT WITH CHECK (auth.uid() = author_id);
    
    DROP POLICY IF EXISTS "Users can update their own drafts." ON public.drafts;
    CREATE POLICY "Users can update their own drafts." ON public.drafts FOR UPDATE USING (auth.uid() = author_id);
    
    DROP POLICY IF EXISTS "Users can delete their own drafts." ON public.drafts;
    CREATE POLICY "Users can delete their own drafts." ON public.drafts FOR DELETE USING (auth.uid() = author_id);

    -- Private Drops Policies
    DROP POLICY IF EXISTS "Users can view private drops they sent or received." ON public.private_drops;
    CREATE POLICY "Users can view private drops they sent or received." ON public.private_drops FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    
    DROP POLICY IF EXISTS "Users can send private drops." ON public.private_drops;
    CREATE POLICY "Users can send private drops." ON public.private_drops FOR INSERT WITH CHECK (auth.uid() = sender_id);
END $$;

-- 6. Storage for Rich Media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for Media
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Media is publicly accessible." ON storage.objects;
    CREATE POLICY "Media is publicly accessible." ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
    
    DROP POLICY IF EXISTS "Authenticated uploads to media." ON storage.objects;
    CREATE POLICY "Authenticated uploads to media." ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'media' );
END $$;

-- 7. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.drafts, public.private_drops;
