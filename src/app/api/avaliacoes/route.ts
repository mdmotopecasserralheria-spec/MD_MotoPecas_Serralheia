import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth-vitrine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const admin = searchParams.get('admin') === 'true'
  const authHeader = req.headers.get('Authorization')

  const sb = createServerClient()

  if (admin && (await isAdmin(authHeader))) {
    const { data, error } = await sb
      .from('avaliacoes')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ avaliacoes: data || [] })
  }

  const { data, error } = await sb
    .from('avaliacoes')
    .select('*')
    .eq('aprovado', true)
    .order('criado_em', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ avaliacoes: data || [] })
}

export async function POST(req: NextRequest) {
  const sb = createServerClient()
  let body: Record<string, any>
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const { nome, nota, comentario } = body
  if (!nome || !nota || nota < 1 || nota > 5) {
    return NextResponse.json({ error: 'Nome e nota (1-5) são obrigatórios' }, { status: 400 })
  }

  const { data, error } = await sb.from('avaliacoes').insert({
    nome, nota, comentario: comentario || null, aprovado: false,
  }).select('id').single()

  if (error) {
    console.error('[AVALIACOES] post error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req.headers.get('Authorization')))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { id?: string; aprovado?: boolean }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const { id, aprovado } = body
  if (!id || aprovado === undefined) {
    return NextResponse.json({ error: 'id e aprovado são obrigatórios' }, { status: 400 })
  }

  const sb = createServerClient()
  const { error } = await sb.from('avaliacoes').update({ aprovado }).eq('id', id)

  if (error) {
    console.error('[AVALIACOES] patch error:', error.message)
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
  const { error } = await sb.from('avaliacoes').delete().eq('id', id)

  if (error) {
    console.error('[AVALIACOES] delete error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
