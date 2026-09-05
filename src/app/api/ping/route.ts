import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/ping
//
// Endpoint de keep-alive que mantém o projeto Supabase ativo, evitando o
// pause automático do plano gratuito (Hobby) após 7 dias de inatividade.
//
// Estratégia: faz uma query real e leve (contagem via HEAD) que obriga o
// PostgreSQL a responder, registrando "atividade" e reiniciando o timer de
// pausa. Também valida que as credenciais estão configuradas.
//
// Segurança: se a variável PING_KEY estiver definida na Vercel, o endpoint
// exige o header x-ping-key com o mesmo valor. Isso impede uso indevido.
//
// Rotas de monitoramento (múltipla redundância):
//   - GitHub Actions cron (este workflow) → a cada 5 min
//   - UptimeRobot / cron-job.org          → monitores HTTP externos
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

  // Diagnóstico de configuração (mais comum para 500)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('[PING] Credenciais Supabase ausentes na Vercel:',
      { url: url ? 'definida' : 'AUSENTE', key: key ? 'definida' : 'AUSENTE' })
    return NextResponse.json(
      {
        ok: false,
        error: 'Credenciais Supabase não configuradas na Vercel',
        configurado: false,
        ts: new Date().toISOString(),
      },
      { status: 500 },
    )
  }

  try {
    const sb = createServerClient()

    // Query leve: conta linhas sem transferir dados (HEAD no PostgREST).
    // NÃO usa tabelas que possam não existir — usa 'anuncios' (base do projeto).
    const { count, error } = await sb
      .from('anuncios')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('[PING] Supabase query error:', JSON.stringify(error))
      // Se a tabela não existir, tenta query genérica de healthcheck via rpc
      if ((error as any)?.code === '42P01' || /relation|does not exist/i.test(error.message || '')) {
        const { error: rpcErr } = await sb.rpc('healthcheck')
        if (!rpcErr) {
          return NextResponse.json(
            { ok: true, via: 'rpc-healthcheck', ts: new Date().toISOString(), message: 'Supabase ativo ✅' },
            { status: 200 },
          )
        }
      }
      return NextResponse.json(
        {
          ok: false,
          error: error.message || 'erro desconhecido no Supabase',
          code: (error as any)?.code ?? null,
          details: (error as any)?.details ?? null,
          ts: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        count: count ?? 0,
        via: 'select',
        ts: new Date().toISOString(),
        message: 'Supabase mantido ativo ✅',
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error('[PING] Erro inesperado:', err?.message || err)
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'erro interno', ts: new Date().toISOString() },
      { status: 500 },
    )
  }
}
