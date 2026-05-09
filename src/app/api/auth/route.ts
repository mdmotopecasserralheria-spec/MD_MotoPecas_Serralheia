import { NextRequest, NextResponse } from 'next/server'
import { gerarTokenAdmin } from '@/lib/auth-vitrine'

export async function POST(req: NextRequest) {
  try {
    const { senha } = await req.json()
    const correta = process.env.DASHBOARD_SECRET

    if (!correta) {
      return NextResponse.json({ error: 'Servidor não configurado' }, { status: 500 })
    }

    if (senha !== correta) {
      await new Promise(r => setTimeout(r, 1000))
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }

    const token = await gerarTokenAdmin()
    return NextResponse.json({ token, ok: true })
  } catch (e) {
    console.error('Erro no auth:', e)
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }
}
