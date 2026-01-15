
-- Replaces handle_new_user to use consistent avatar style and safe default subscriptions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  welcome_drop_id UUID := '00000000-0000-0000-0000-000000000001';
  system_user_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Create Profile with Pasarell-style Avatar (Notionists)
  INSERT INTO public.profiles (id, email, handle, name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8)), 
    COALESCE(new.raw_user_meta_data->>'name', 'New Writer'),
    'https://api.dicebear.com/7.x/notionists/svg?seed=' || new.id
  );

  -- Ensure Welcome Drop Exists (Idempotent)
  INSERT INTO public.drops (id, author_id, title, content, layout)
  VALUES (
    welcome_drop_id,
    system_user_id,
    'Welcome to Drop a Line',
    'Welcome to the network. This is your first transmission. Connect with others in the Following tab to receive their drops. Every time you publish, it will be relayed to your followers around the world.',
    'classic'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Deliver Welcome Drop
  INSERT INTO public.user_drop_statuses (user_id, drop_id, status)
  VALUES (new.id, welcome_drop_id, 'received')
  ON CONFLICT (user_id, drop_id) DO NOTHING;

  -- Auto-Follow System Account (Default: NO Auto-Print)
  INSERT INTO public.subscriptions (subscriber_id, creator_id, auto_print)
  VALUES (new.id, system_user_id, false)
  ON CONFLICT (subscriber_id, creator_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
