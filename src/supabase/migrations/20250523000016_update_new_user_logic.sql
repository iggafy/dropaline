
-- Replaces handle_new_user to use consistent avatar style and safe default subscriptions
-- Replaces handle_new_user to use consistent avatar style and safe default subscriptions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  welcome_drop_id UUID := '00000000-0000-0000-0000-000000000001';
  system_user_id UUID := '00000000-0000-0000-0000-000000000000';
  new_handle TEXT;
BEGIN
  -- 0. Ensure System Account Exists (Critical Dependency)
  INSERT INTO public.profiles (id, handle, name, bio, avatar_url)
  VALUES (
    system_user_id, 
    'dropaline', 
    'Drop a Line Network', 
    'Official relay for the Drop a Line network.', 
    'https://api.dicebear.com/7.x/shapes/svg?seed=dropaline'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 1. Create Profile with Pasarell-style Avatar (Notionists)
  -- Try to use the provided handle. If it fails due to global uniqueness, the transaction will still fail (500),
  -- which is correct behavior for a signup form (User needs to pick a new handle).
  -- However, we use ON CONFLICT (id) to be idempotent.
  
  new_handle := COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8));

  INSERT INTO public.profiles (id, email, handle, name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new_handle, 
    COALESCE(new.raw_user_meta_data->>'name', 'New Writer'),
    'https://api.dicebear.com/7.x/notionists/svg?seed=' || new.id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url; 
    -- We generally don't overwrite handle on conflict to avoid changing it unexpectedly, 
    -- but for a fresh signup ID this is fine.

  -- 2. Ensure Welcome Drop Exists (Idempotent - Update content if exists)
  INSERT INTO public.drops (id, author_id, title, content, layout)
  VALUES (
    welcome_drop_id,
    system_user_id,
    'Writers’ words. Readers’ paper',
    'In a world of infinite scrolling and digital noise, Drop a Line is built for the tactile pleasure of reading. It’s a publish-to-printer platform that doesn’t just live on a screen — it lives on your desk, in your hands, on your shelf, and in the memories of people you share stories with.
    
    Whether it’s a morning poem, a weekly letter, or a passing thought, Drop a Line exists with intention and purpose. Some ideas must be grasped. They deserve paper. This is a place to write slowly and read deliberately.

You are welcome to drop a line.',
    'classic'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content;

  -- 3. Deliver Welcome Drop
  INSERT INTO public.user_drop_statuses (user_id, drop_id, status)
  VALUES (new.id, welcome_drop_id, 'received')
  ON CONFLICT (user_id, drop_id) DO NOTHING;

  -- 4. Auto-Follow System Account (Default: NO Auto-Print)
  INSERT INTO public.subscriptions (subscriber_id, creator_id, auto_print)
  VALUES (new.id, system_user_id, false)
  ON CONFLICT (subscriber_id, creator_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

