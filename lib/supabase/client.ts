import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const FALLBACK_URL = 'https://cdphppmtohuoydyxtne.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcGhwcHJudG9odW95ZHl4dG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzA3NDUsImV4cCI6MjEwNDUwNjc0NX0.LAw32jdkYvSJmdMBYz0OYTVL3_sSLA5vfIQ3DdJcF0k';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project')
);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
