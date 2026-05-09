import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { gerarToken } from '@/lib/auth-vitrine'

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json()

    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 })
    }

    const sb = createServerClient()

    const { data: anunciante, error } = await sb.rpc('login_cliente', {
      p_email: email.toLowerCase().trim(),
      p_senha: senha,
    })

    if (error || !anunciante?.id) {
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = await gerarToken({ id: anunciante.id, nome: anunciante.nome, email: anunciante.email })

    return NextResponse.json({
      ok: true,
      token,
      cliente: { id: anunciante.id, nome: anunciante.nome, email: anunciante.email },
    })

  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
