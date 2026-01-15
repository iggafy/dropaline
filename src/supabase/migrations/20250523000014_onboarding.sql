
-- Add onboarding fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_intent TEXT,
ADD COLUMN IF NOT EXISTS reading_preferences TEXT[],
ADD COLUMN IF NOT EXISTS writing_preferences TEXT[];

-- Update UserProfile definition to include new fields if necessary 
-- (implicit in Supabase usually, but documenting intent)
