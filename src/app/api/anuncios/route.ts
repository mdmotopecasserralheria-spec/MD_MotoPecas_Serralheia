import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { extrairToken, isAdmin as verificarAdmin } from '@/lib/auth-vitrine'

async function getCliente(req: NextRequest) {
  return extrairToken(req.headers.get('Authorization'))
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get('scope') || 'vitrine'
    const sb = createServerClient()

    if (scope === 'vitrine') {
      const { data, error } = await sb.rpc('anuncios_vitrine')
      return NextResponse.json({ anuncios: error ? [] : (data || []) })
    }

    if (scope === 'meus') {
      const cliente = await getCliente(req)
      if (!cliente) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      const { data, error } = await sb.rpc('meus_anuncios', { p_cliente_id: cliente.id })
      return NextResponse.json({ anuncios: error ? [] : (data || []) })
    }

    if (scope === 'admin') {
      if (!(await verificarAdmin(req.headers.get('Authorization')))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      const status = searchParams.get('status') || 'all'
      const { data, error } = await sb.rpc('admin_anuncios', { p_status: status })
      return NextResponse.json({ anuncios: error ? [] : (data || []) })
    }

    return NextResponse.json({ error: 'scope inválido' }, { status: 400 })
  } catch (err) {
    console.error('[ANUNCIOS GET]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST: RPC retorna o JSONB como objeto DIRETO (não array)
export async function POST(req: NextRequest) {
  try {
    const cliente = await getCliente(req)
    if (!cliente) return NextResponse.json({ error: 'Faça login para criar anúncios' }, { status: 401 })

    let body: Record<string, any>
    try { body = await req.json() }
    catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

    const { titulo, descricao, preco, categoria, imagem_url, empresa } = body
    if (!titulo || !categoria || !empresa) {
      return NextResponse.json({ error: 'Título, categoria e empresa são obrigatórios' }, { status: 400 })
    }

    const sb = createServerClient()
    const { data: anuncio, error } = await sb.rpc('inserir_anuncio', {
      p_cliente_id: cliente.id, p_titulo: titulo,
      p_descricao: descricao || null, p_preco: preco || null,
      p_categoria: categoria, p_imagem_url: imagem_url || null,
      p_empresa: empresa,
    })

    if (error) return NextResponse.json({ error: 'Erro ao criar anúncio: ' + error.message }, { status: 500 })

    if (!anuncio?.id) return NextResponse.json({ error: 'Resposta inesperada da RPC' }, { status: 500 })

    return NextResponse.json({ anuncio, mensagem: 'Anúncio enviado para aprovação! ⏳' }, { status: 201 })
  } catch (err) {
    console.error('[ANUNCIOS POST]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await verificarAdmin(req.headers.get('Authorization')))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    let body: Record<string, any>
    try { body = await req.json() }
    catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

    const { id, status, motivo_rejeicao } = body
    if (!id || !['aprovado', 'rejeitado'].includes(status)) {
      return NextResponse.json({ error: 'id e status obrigatórios' }, { status: 400 })
    }

    const sb = createServerClient()
    const { data: anuncio, error } = await sb.rpc('atualizar_anuncio', {
      p_id: id, p_status: status, p_motivo_rejeicao: motivo_rejeicao || null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ anuncio })
  } catch (err) {
    console.error('[ANUNCIOS PATCH]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    const sb = createServerClient()

    if (await verificarAdmin(req.headers.get('Authorization'))) {
      const { error } = await sb.rpc('excluir_anuncio', { p_id: id })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    const cliente = await getCliente(req)
    if (!cliente) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { data: anuncio } = await sb.from('anuncios').select('cliente_id').eq('id', id).single()
    if (anuncio?.cliente_id !== cliente.id) return NextResponse.json({ error: 'Você só pode excluir seus próprios anúncios' }, { status: 403 })

    const { error } = await sb.rpc('excluir_anuncio', { p_id: id })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[ANUNCIOS DELETE]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
