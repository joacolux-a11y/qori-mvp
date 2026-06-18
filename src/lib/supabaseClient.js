// Cliente de Supabase. Si no hay credenciales en .env.local, queda en null
// y la app usa automáticamente el backend local (ver lib/backend.js).
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(url && key)

export const supabase = supabaseEnabled ? createClient(url, key) : null

if (!supabaseEnabled) {
  // eslint-disable-next-line no-console
  console.info('[Qori] Sin credenciales Supabase → usando backend local (localStorage).')
}
