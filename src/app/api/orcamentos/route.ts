import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth-vitrine'

export async function POST(req: NextRequest) {
  let body: { nome?: string; telefone?: string; anuncio_id?: string; mensagem?: string }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const { nome, telefone, anuncio_id, mensagem } = body
  if (!nome || !telefone) {
    return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
  }

  const sb = createServerClient()

  const { data: orcamento, error } = await sb
    .from('orcamentos')
    .insert([{ nome, telefone, anuncio_id: anuncio_id || null, mensagem: mensagem || null }])
    .select('id')
    .single()

  if (error) {
    console.error('[ORCAMENTOS] insert error:', error.message)
    return NextResponse.json({ error: 'Erro ao salvar orçamento' }, { status: 500 })
  }

  if (nome !== 'Lead WhatsApp' && telefone !== '00000000000') {
    const { error: rpcError } = await sb.rpc('inserir_cliente', {
      p_nome: nome,
      p_email: `${telefone.replace(/\D/g, '')}@lead.whatsapp`,
      p_senha_hash: '',
      p_telefone: telefone,
    })
    if (rpcError) console.error('[ORCAMENTOS] inserir_cliente rpc warning:', rpcError.message)
  }

  return NextResponse.json({ orcamento_id: orcamento.id }, { status: 201 })
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req.headers.get('Authorization')))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const sb = createServerClient()

  let query = sb
    .from('orcamentos')
    .select('*, clientes(nome, telefone)')
    .order('criado_em', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[ORCAMENTOS] select error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orcamentos: data || [] })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req.headers.get('Authorization')))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { id?: string; status?: string }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const { id, status } = body
  const validStatuses = ['pendente', 'respondido', 'convertido', 'fechado']

  if (!id || !status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'id e status (pendente/respondido/convertido/fechado) obrigatórios' }, { status: 400 })
  }

  const sb = createServerClient()
  const { error } = await sb.from('orcamentos').update({ status }).eq('id', id)

  if (error) {
    console.error('[ORCAMENTOS] update error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req.headers.get('Authorization')))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

  const sb = createServerClient()
  const { error } = await sb.from('orcamentos').delete().eq('id', id)

  if (error) {
    console.error('[ORCAMENTOS] delete error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
