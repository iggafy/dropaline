-- Migration: Fix Subscription Persistence
-- This adds the missing UPDATE policy for the subscriptions table,
-- allowing users to persist their 'auto_print' preferences.

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can update their own subscriptions." ON public.subscriptions;
    CREATE POLICY "Users can update their own subscriptions." ON public.subscriptions 
    FOR UPDATE USING (auth.uid() = subscriber_id);
END $$;
