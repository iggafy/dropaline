-- Add print_color_mode to profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='print_color_mode') THEN
        ALTER TABLE public.profiles ADD COLUMN print_color_mode TEXT DEFAULT 'color' CHECK (print_color_mode IN ('color', 'bw'));
    END IF;
END $$;
