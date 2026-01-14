-- Private Drops Polish Migration
-- Auto-print settings for private contacts and read tracking

-- 1. Add read_at to private_drops for notification tracking
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='private_drops' AND column_name='read_at') THEN
        ALTER TABLE public.private_drops ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 2. Create Private Contacts table for specific 1-on-1 settings
CREATE TABLE IF NOT EXISTS public.private_contacts (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  auto_print BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, contact_id)
);

-- 3. Enable RLS
ALTER TABLE public.private_contacts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage their own private contacts." ON public.private_contacts;
    CREATE POLICY "Users can manage their own private contacts." ON public.private_contacts 
    FOR ALL USING (auth.uid() = user_id);
END $$;

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_contacts;
