import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/ping
//
// Endpoint de keep-alive que mantém o projeto Supabase ativo, evitando o
// pause automático do plano gratuito (Hobby) após 7 dias de inatividade.
//
// Faz uma query leve (contagem via HEAD) que obriga o PostgreSQL a responder,
// registrando "atividade" no projeto e reiniciando o timer de pausa.
//
// Segurança: se a variável PING_KEY estiver definida, o endpoint exige o
// header x-ping-key com o mesmo valor. Isso impede que terceiros usem seu
// endpoint gratuitamente.
//
// Rotas de monitoramento sugeridas (gratuito):
//   - GitHub Actions cron        → .github/workflows/supabase-keepalive.yml
//   - UptimeRobot                → monitor HTTP apontando para este endpoint
//   - cron-job.org               → job HTTP com header x-ping-key
//
// Frequência mínima recomendada: a cada 5 minutos
export async function GET(req: NextRequest) {
  // ── Autenticação opcional via header ───────────────────────
  const expectedKey = process.env.PING_KEY
  if (expectedKey) {
    const providedKey = req.headers.get('x-ping-key')
    if (providedKey !== expectedKey) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  try {
    const sb = createServerClient()

    // Query ultra-leve: conta linhas sem transferir dados (HEAD no PostgREST)
    // Qualquer conexão com o DB conta como atividade e evita o pause.
    const { count, error } = await sb
      .from('anuncios')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('[PING] Supabase query error:', error.message)
      return NextResponse.json(
        { ok: false, error: error.message, ts: new Date().toISOString() },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        count: count ?? 0,
        ts: new Date().toISOString(),
        message: 'Supabase mantido ativo ✅',
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error('[PING] Erro inesperado:', err)
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Erro interno', ts: new Date().toISOString() },
      { status: 500 },
    )
  }
}
