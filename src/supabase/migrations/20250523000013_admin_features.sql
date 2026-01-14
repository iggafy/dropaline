-- Admin Features: Post as Network & Auto-Follow
-- 1. Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Update handle_new_user to include auto-follow
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  welcome_drop_id UUID := '00000000-0000-0000-0000-000000000001'; -- Static ID for the Welcome Drop
  system_account_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Create Profile (Idempotent)
  INSERT INTO public.profiles (id, email, handle, name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8)), 
    COALESCE(new.raw_user_meta_data->>'name', 'New Writer'),
    'https://api.dicebear.com/7.x/shapes/svg?seed=' || new.id
  )
  ON CONFLICT (id) DO NOTHING;

  -- Every new user follows the system account by default with auto-print enabled
  INSERT INTO public.subscriptions (subscriber_id, creator_id, auto_print)
  VALUES (new.id, system_account_id, true)
  ON CONFLICT (subscriber_id, creator_id) DO UPDATE SET auto_print = true;

  -- Ensure Welcome Drop Exists (Singleton)
  INSERT INTO public.drops (id, author_id, title, content, layout)
  VALUES (
    welcome_drop_id,
    system_account_id,
    'Welcome to Drop a Line',
    'Welcome to the network. This is your first transmission. Connect with others in the Following tab to receive their drops. Every time you publish, it will be relayed to your followers around the world.',
    'classic'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Address the drop to the new user specifically (Idempotent)
  INSERT INTO public.user_drop_statuses (user_id, drop_id, status)
  VALUES (new.id, welcome_drop_id, 'received')
  ON CONFLICT (user_id, drop_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update RLS for drops to allow admins to post as the system account
DROP POLICY IF EXISTS "Users can insert their own drops." ON public.drops;
DROP POLICY IF EXISTS "Users can insert their own drops or system drops if admin." ON public.drops;
CREATE POLICY "Users can insert their own drops or system drops if admin." 
ON public.drops FOR INSERT 
WITH CHECK (
  auth.uid() = author_id 
  OR 
  (author_id = '00000000-0000-0000-0000-000000000000' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
);

-- 4. Backfill subscriptions for existing users (Enabling auto-print for @dropaline)
INSERT INTO public.subscriptions (subscriber_id, creator_id, auto_print)
SELECT id, '00000000-0000-0000-0000-000000000000', true
FROM public.profiles
WHERE id != '00000000-0000-0000-0000-000000000000'
ON CONFLICT (subscriber_id, creator_id) DO UPDATE SET auto_print = true;
