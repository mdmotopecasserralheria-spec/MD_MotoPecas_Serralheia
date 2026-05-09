import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { extrairToken } from '@/lib/auth-vitrine'

// GET: listar meus anúncios
export async function GET(req: NextRequest) {
  try {
    const anunciante = await extrairToken(req.headers.get('Authorization'))
    if (!anunciante) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const sb = createServerClient()
    const { data, error } = await sb
      .from('anuncios')
      .select('*')
      .eq('cliente_id', anunciante.id)
      .order('criado_em', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ anuncios: data })
  } catch (err) {
    console.error('[VITRINE ANUNCIOS GET]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST: criar novo anúncio (vai para pendente)
export async function POST(req: NextRequest) {
  try {
    const anunciante = await extrairToken(req.headers.get('Authorization'))
    if (!anunciante) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    let titulo, descricao, preco, categoria, imagem_url
    try { ({ titulo, descricao, preco, categoria, imagem_url } = await req.json()) }
    catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

    if (!titulo || !categoria) {
      return NextResponse.json({ error: 'Título e categoria são obrigatórios' }, { status: 400 })
    }

    const sb = createServerClient()
    const { data, error } = await sb
      .from('anuncios')
      .insert([{
        cliente_id: anunciante.id,
        titulo: titulo.trim(),
        descricao: descricao?.trim(),
        preco: preco?.trim(),
        categoria,
        imagem_url: imagem_url?.trim(),
        status: 'pendente',
      }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      anuncio: data,
      mensagem: '✅ Anúncio enviado! Aguarde a aprovação do administrador.',
    }, { status: 201 })
  } catch (err) {
    console.error('[VITRINE ANUNCIOS POST]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// DELETE: excluir meu anúncio
export async function DELETE(req: NextRequest) {
  try {
    const anunciante = await extrairToken(req.headers.get('Authorization'))
    if (!anunciante) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    const sb = createServerClient()
    // Verifica se pertence ao anunciante antes de deletar
    const { error } = await sb
      .from('anuncios')
      .delete()
      .eq('id', id)
      .eq('cliente_id', anunciante.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[VITRINE ANUNCIOS DELETE]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
