// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hyinhchilsgdjnwkuaup.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aW5oY2hpbHNnZGpud2t1YXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjM5NzAsImV4cCI6MjA1NzMzOTk3MH0.qH2PTCB7R8nNFYKHJOfe878GfGlMu1T2ftLCn_rYVfk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
