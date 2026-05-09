import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth-vitrine'

async function verificarAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return isAdmin(auth)
}

// GET: listar todos os anúncios (com filtro por status)
export async function GET(req: NextRequest) {
  try {
    if (!(await verificarAdmin(req))) {
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // pendente | aprovado | rejeitado | all

    const sb = createServerClient()
    let query = sb
      .from('anuncios')
      .select(`
        *,
        clientes (nome, email, telefone)
      `)
      .order('criado_em', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ anuncios: data || [] })
  } catch (err) {
    console.error('[VITRINE ADMIN GET]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PATCH: aprovar ou rejeitar um anúncio
export async function PATCH(req: NextRequest) {
  try {
    if (!(await verificarAdmin(req))) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

    let id, status, motivo_rejeicao
    try { ({ id, status, motivo_rejeicao } = await req.json()) }
    catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

    if (!id || !['aprovado', 'rejeitado'].includes(status)) {
      return NextResponse.json({ error: 'id e status (aprovado|rejeitado) obrigatórios' }, { status: 400 })
    }

    const sb = createServerClient()
    const update: Record<string, any> = {
      status,
      motivo_rejeicao: status === 'rejeitado' ? (motivo_rejeicao || 'Não atende os critérios da vitrine') : null,
    }
    if (status === 'aprovado') update.aprovado_em = new Date().toISOString()

    const { data, error } = await sb
      .from('anuncios')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      anuncio: data,
      mensagem: status === 'aprovado' ? '✅ Anúncio aprovado e publicado na vitrine!' : '❌ Anúncio rejeitado.',
    })
  } catch (err) {
    console.error('[VITRINE ADMIN PATCH]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
