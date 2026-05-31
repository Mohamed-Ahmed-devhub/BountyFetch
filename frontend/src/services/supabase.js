import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ FIX: validation أوضح يساعد في debugging
if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL غير موجود في frontend/.env')
}
if (!SUPABASE_ANON_KEY) {
  console.error('❌ VITE_SUPABASE_ANON_KEY غير موجود أو مقطوع في frontend/.env')
}

// ✅ FIX: fallback بقيم فارغة بدل undefined — يمنع crash عند التشغيل
export const supabase = createClient(
  SUPABASE_URL      || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: true,
    },
  }
)
