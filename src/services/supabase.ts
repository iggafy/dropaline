
import { createClient } from '@supabase/supabase-js';

// NOTE: These should ideally be in a .env file. 
// For this environment, ensure you replace these with your actual Supabase Project credentials.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
