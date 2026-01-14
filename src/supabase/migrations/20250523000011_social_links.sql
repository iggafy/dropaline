-- Social Links Migration
-- Add social_links column to profiles

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='social_links') THEN
        ALTER TABLE public.profiles ADD COLUMN social_links JSONB DEFAULT '[]';
    END IF;
END $$;

-- Update Search View to include social links
DROP VIEW IF EXISTS public.creator_search CASCADE;
CREATE OR REPLACE VIEW public.creator_search AS
SELECT 
  p.id, p.handle, p.name, p.bio, p.avatar_url, p.social_links,
  COALESCE(cs.subscriber_count, 0) as follower_count
FROM public.profiles p
LEFT JOIN public.creator_stats cs ON cs.creator_id = p.id;

-- Re-grant permissions
GRANT SELECT ON public.creator_search TO authenticated;
