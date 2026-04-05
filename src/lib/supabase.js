import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// createClient throws if URL/key are empty — that would crash the whole app on load.
if (!url || !anonKey) {
  console.warn(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
  )
}

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null
