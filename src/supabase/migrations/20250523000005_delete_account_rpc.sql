-- Migration: Delete Account Wipe
-- This provides a secure, server-side way to completely remove a user
-- as well as their profile, drops, and all associated metadata.

-- Function must be SECURITY DEFINER to have permission to delete from auth.users
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS VOID AS $$
BEGIN
    -- 1. Metadata for logs/persistence could go here if needed
    
    -- 2. Delete from public.profiles
    -- Due to ON DELETE CASCADE settings in our init migrations,
    -- this will automatically wipe:
    -- - drops
    -- - comments
    -- - likes
    -- - subscriptions
    -- - user_drop_statuses
    DELETE FROM public.profiles WHERE id = auth.uid();

    -- 3. Delete the auth user record itself
    -- Note: This requires the function to be SECURITY DEFINER
    -- and the service_role to have permission.
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
