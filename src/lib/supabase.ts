import { createClient } from '@supabase/supabase-js'

// ─── Browser client (lazy — só cria quando chamado) ──────────
let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase: configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local')
  _supabase = createClient(url, key)
  return _supabase
}

// Mantém compatibilidade com imports antigos (não instancia no topo do módulo)
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    return (getSupabaseClient() as any)[prop]
  },
})

// ─── Server-side client (com service role) ───────────────────
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.warn('[Supabase] Variáveis não configuradas — retornando mock vazio')
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({ data: [], error: null }),
            maybeSingle: () => ({ data: null, error: null }),
            single: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
          }),
          maybeSingle: () => ({ data: null, error: null }),
          single: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
          order: () => ({ data: [], error: null }),
        }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase não configurado' } }) }) }),
        rpc: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
      storage: { from: () => ({ upload: () => Promise.resolve({ error: null }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    } as any
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}
