import { createClient } from '@supabase/supabase-js'

// These come from your .env file — see .env.example.
// If they're missing, supabaseConfigured is false and the site
// automatically falls back to sample products instead of crashing.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
