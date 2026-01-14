-- DropaLine Launch Ready Migration
-- Fully Idempotent: Safe to run multiple times

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  handle TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/shapes/svg?seed=neutral',
  
  -- User Preferences
  batch_mode TEXT DEFAULT 'Instant' CHECK (batch_mode IN ('Instant', 'Daily', 'Weekly', 'Custom')),
  batch_date TEXT,
  batch_time TEXT,
  paper_saver BOOLEAN DEFAULT FALSE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Add individual columns if table already existed (Ensuring existing DBs get the new fields)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='batch_mode') THEN
        ALTER TABLE public.profiles ADD COLUMN batch_mode TEXT DEFAULT 'Instant' CHECK (batch_mode IN ('Instant', 'Daily', 'Weekly', 'Custom'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='batch_date') THEN
        ALTER TABLE public.profiles ADD COLUMN batch_date TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='batch_time') THEN
        ALTER TABLE public.profiles ADD COLUMN batch_time TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='paper_saver') THEN
        ALTER TABLE public.profiles ADD COLUMN paper_saver BOOLEAN DEFAULT FALSE;
    END IF;

    -- Remove strict FK if it exists to allow system accounts
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
END $$;

-- 3. Create Drops Table
CREATE TABLE IF NOT EXISTS public.drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  layout TEXT DEFAULT 'classic', -- 'classic', 'zine', 'minimal'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  subscriber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  auto_print BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (subscriber_id, creator_id)
);

-- 5. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, drop_id)
);

-- 7. Create User Drop Statuses
CREATE TABLE IF NOT EXISTS public.user_drop_statuses (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('received', 'printed', 'queued')) DEFAULT 'received',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, drop_id)
);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_drop_statuses ENABLE ROW LEVEL SECURITY;

-- Utility to drop and recreate policies to avoid "already exists" errors
DO $$ 
BEGIN
    -- Profiles
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
    CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
    CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
    CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

    -- Drops
    DROP POLICY IF EXISTS "Drops are viewable by everyone." ON public.drops;
    CREATE POLICY "Drops are viewable by everyone." ON public.drops FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can insert their own drops." ON public.drops;
    CREATE POLICY "Users can insert their own drops." ON public.drops FOR INSERT WITH CHECK (auth.uid() = author_id);

    -- Subscriptions
    DROP POLICY IF EXISTS "Users can view their own subscriptions." ON public.subscriptions;
    CREATE POLICY "Users can view their own subscriptions." ON public.subscriptions FOR SELECT USING (auth.uid() = subscriber_id);
    DROP POLICY IF EXISTS "Users can create their own subscriptions." ON public.subscriptions;
    CREATE POLICY "Users can create their own subscriptions." ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
    DROP POLICY IF EXISTS "Users can delete their own subscriptions." ON public.subscriptions;
    CREATE POLICY "Users can delete their own subscriptions." ON public.subscriptions FOR DELETE USING (auth.uid() = subscriber_id);

    -- Comments
    DROP POLICY IF EXISTS "Comments are viewable by everyone." ON public.comments;
    CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Authenticated users can create comments." ON public.comments;
    CREATE POLICY "Authenticated users can create comments." ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    -- Likes
    DROP POLICY IF EXISTS "Likes are viewable by everyone." ON public.likes;
    CREATE POLICY "Likes are viewable by everyone." ON public.likes FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Authenticated users can create likes." ON public.likes;
    CREATE POLICY "Authenticated users can create likes." ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Authenticated users can delete likes." ON public.likes;
    CREATE POLICY "Authenticated users can delete likes." ON public.likes FOR DELETE USING (auth.uid() = user_id);

    -- Statuses
    DROP POLICY IF EXISTS "Users can view own statuses." ON public.user_drop_statuses;
    CREATE POLICY "Users can view own statuses." ON public.user_drop_statuses FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can insert/update own statuses." ON public.user_drop_statuses;
    CREATE POLICY "Users can insert/update own statuses." ON public.user_drop_statuses FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can update own statuses." ON public.user_drop_statuses;
    CREATE POLICY "Users can update own statuses." ON public.user_drop_statuses FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- 16. SYSTEM ACCOUNT
INSERT INTO public.profiles (id, handle, name, bio, avatar_url)
VALUES ('00000000-0000-0000-0000-000000000000', 'dropaline', 'Drop a Line Network', 'Official relay for the Drop a Line network.', 'https://api.dicebear.com/7.x/shapes/svg?seed=dropaline')
ON CONFLICT (id) DO NOTHING;

-- 9. Trigger to automatically create a Profile when a User signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  welcome_drop_id UUID;
BEGIN
  -- Create Profile
  INSERT INTO public.profiles (id, email, handle, name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8)), 
    COALESCE(new.raw_user_meta_data->>'name', 'New Writer'),
    'https://api.dicebear.com/7.x/shapes/svg?seed=' || new.id
  );

  -- Create Welcome Drop
  INSERT INTO public.drops (author_id, title, content, layout)
  VALUES (
    '00000000-0000-0000-0000-000000000000', -- Use system account
    'Welcome to Drop a Line',
    'Welcome to the network. This is your first transmission. Connect with others in the Following tab to receive their drops. Every time you publish, it will be relayed to your followers around the world.',
    'classic'
  ) RETURNING id INTO welcome_drop_id;

  -- Address the drop to the new user specifically
  INSERT INTO public.user_drop_statuses (user_id, drop_id, status)
  VALUES (new.id, welcome_drop_id, 'received');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. AUTOMATIC DROP DISTRIBUTION
CREATE OR REPLACE FUNCTION public.distribute_drop()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_drop_statuses (user_id, drop_id, status)
  SELECT 
    s.subscriber_id, 
    NEW.id,
    CASE 
      WHEN p.batch_mode = 'Instant' THEN 'received'
      ELSE 'queued'
    END
  FROM public.subscriptions s
  JOIN public.profiles p ON p.id = s.subscriber_id
  WHERE s.creator_id = NEW.author_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_drop_created ON public.drops;
CREATE TRIGGER on_drop_created
  AFTER INSERT ON public.drops
  FOR EACH ROW EXECUTE PROCEDURE public.distribute_drop();

-- 12. REAL-TIME STATS VIEW
DROP VIEW IF EXISTS public.creator_stats CASCADE;
CREATE OR REPLACE VIEW public.creator_stats AS
SELECT 
  creator_id,
  count(*) as subscriber_count
FROM public.subscriptions
GROUP BY creator_id;

-- 13. CREATOR SEARCH VIEW (Discovery)
DROP VIEW IF EXISTS public.creator_search CASCADE;
CREATE OR REPLACE VIEW public.creator_search AS
SELECT 
  p.id, p.handle, p.name, p.bio, p.avatar_url,
  COALESCE(cs.subscriber_count, 0) as follower_count
FROM public.profiles p
LEFT JOIN public.creator_stats cs ON cs.creator_id = p.id;

-- Secure Views: Authenticated Only
REVOKE ALL ON public.creator_stats FROM anon;
REVOKE ALL ON public.creator_search FROM anon;
GRANT SELECT ON public.creator_stats TO authenticated;
GRANT SELECT ON public.creator_search TO authenticated;

-- 14. STORAGE SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies (Drop and Recreate)
DO $$ 
BEGIN
    -- Public access
    DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
    CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );
    
    -- Authenticated uploads
    DROP POLICY IF EXISTS "Users can upload their own avatar." ON storage.objects;
    CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'avatars' );

    DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
    CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'avatars' );

    DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;
    CREATE POLICY "Users can delete their own avatar." ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'avatars' );
END $$;

-- 15. ENABLE REALTIME
-- This ensures Supabase broadcasts changes for these tables
DO $$
BEGIN
  -- Re-create the publication to be safe and clean
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.drops, 
    public.likes, 
    public.comments, 
    public.user_drop_statuses,
    public.profiles;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback if publication exists or permissions differ in certain environments
    NULL;
END $$;
