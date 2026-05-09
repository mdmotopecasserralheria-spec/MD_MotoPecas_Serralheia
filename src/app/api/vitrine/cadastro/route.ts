import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { hashSenha, gerarToken } from '@/lib/auth-vitrine'

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, telefone } = await req.json()

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
    }

    if (senha.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const sb = createServerClient()

    // Verificar se email já existe
    const { data: existente } = await sb
      .from('clientes')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existente) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    // Criar conta
    const senhaHash = await hashSenha(senha)
    const { data: novo, error } = await sb
      .from('clientes')
      .insert([{
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha_hash: senhaHash,
        telefone: telefone?.trim() || null,
      }])
      .select('id, nome, email')
      .single()

    if (error) {
      console.error('[CADASTRO]', error)
      return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
    }

    const token = await gerarToken({ id: novo.id, nome: novo.nome, email: novo.email })

    return NextResponse.json({
      ok: true,
      token,
      cliente: { id: novo.id, nome: novo.nome, email: novo.email },
    }, { status: 201 })

  } catch (err) {
    console.error('[CADASTRO ERROR]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
