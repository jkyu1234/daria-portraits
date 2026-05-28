import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cadpnylxtkacvvxqjtjb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-6SVUe4aqBSZ_tdjCZA5gA_tIlybzW4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
