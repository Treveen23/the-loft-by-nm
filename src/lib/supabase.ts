import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hdtroujfzhbftorqfqwa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkdHJvdWpmemhiZnRvcnFmcXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODUxNDAsImV4cCI6MjA5ODQ2MTE0MH0.WAncNP-AFIz_dxQ3NNnz2fn_InSuCJx2m1eA98mAv3A';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};
