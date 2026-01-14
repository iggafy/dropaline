-- Private Line Exceptions Migration
-- Add private_line_exceptions to profiles

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='private_line_exceptions') THEN
        ALTER TABLE public.profiles ADD COLUMN private_line_exceptions TEXT[] DEFAULT '{}';
    END IF;
END $$;
