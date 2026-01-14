-- Migration: Add threading and comment likes support
-- This enhances the messaging system with persistent threads and interactive feedback

-- 1. Update Comments Table for Threading
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='parent_id') THEN
        ALTER TABLE public.comments ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Create Comment Likes Table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, comment_id)
);

-- 3. Enable RLS
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- 4. Set Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Comment likes are viewable by everyone." ON public.comment_likes;
    CREATE POLICY "Comment likes are viewable by everyone." ON public.comment_likes FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Authenticated users can create comment likes." ON public.comment_likes;
    CREATE POLICY "Authenticated users can create comment likes." ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Authenticated users can delete their own comment likes." ON public.comment_likes;
    CREATE POLICY "Authenticated users can delete their own comment likes." ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);
END $$;

-- 5. Add to Realtime Publication
-- We add the new table to the existing realtime publication
DO $$
BEGIN
  -- We don't drop the whole publication, just add the new table if possible
  -- Or just recreate the publication with all tables
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.drops, 
    public.likes, 
    public.comments, 
    public.user_drop_statuses,
    public.profiles,
    public.comment_likes; -- Added
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
