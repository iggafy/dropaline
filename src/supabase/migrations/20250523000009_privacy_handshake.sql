-- Privacy and Handshake Migration
-- Add status to private_drops and allow_private_drops to profiles

-- 1. Add status to private_drops
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='private_drops' AND column_name='status') THEN
        ALTER TABLE public.private_drops ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied'));
    END IF;
END $$;

-- 2. Add allow_private_drops to profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='allow_private_drops') THEN
        ALTER TABLE public.profiles ADD COLUMN allow_private_drops BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- 3. Update existing private drops to 'accepted'
-- We assume older drops were implicitly accepted
UPDATE public.private_drops SET status = 'accepted' WHERE status IS NULL OR status = 'pending';

-- 4. RLS for Private Drops Update
-- Receivers need to be able to Accept or Deny
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Receivers can update private drop status." ON public.private_drops;
    CREATE POLICY "Receivers can update private drop status." ON public.private_drops 
    FOR UPDATE USING (auth.uid() = receiver_id);
END $$;
