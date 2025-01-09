import { createClient } from '@supabase/supabase-js'

const supabaseUrl =https://kdwwykxcvolfelfyvxaz.supabase.co
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkd3d5a3hjdm9sZmVsZnl2eGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MzYxNzAsImV4cCI6MjA1MjAxMjE3MH0.u0ZguDQAWhH5Gve15E6n1f_r3z8PUCeG-WN5kmT3r8g

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

