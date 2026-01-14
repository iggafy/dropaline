-- Migration: Public Print Stats
-- This allows the count of printed transmissions to be calculated globally
-- while keeping 'queued' and 'received' statuses private to the recipient.

DO $$ 
BEGIN
    -- Add a policy that allows anyone to view statuses that are specifically 'printed'
    DROP POLICY IF EXISTS "Public printed statuses are viewable." ON public.user_drop_statuses;
    CREATE POLICY "Public printed statuses are viewable." ON public.user_drop_statuses FOR SELECT USING (status = 'printed');
    
    -- Ensure the user can still see all of their own statuses (received, queued, printed)
    DROP POLICY IF EXISTS "Users can view own statuses." ON public.user_drop_statuses;
    CREATE POLICY "Users can view own statuses." ON public.user_drop_statuses FOR SELECT USING (auth.uid() = user_id);
END $$;
