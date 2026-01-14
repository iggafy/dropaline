-- Fix Welcome Drop Duplication
-- Applies the new singleton logic for the welcome drop

-- 1. Redefine handle_new_user with fixed logic
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  welcome_drop_id UUID := '00000000-0000-0000-0000-000000000001'; -- Static ID for the Welcome Drop
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

  -- Ensure Welcome Drop Exists (Singleton)
  INSERT INTO public.drops (id, author_id, title, content, layout)
  VALUES (
    welcome_drop_id,
    '00000000-0000-0000-0000-000000000000', -- System account
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
