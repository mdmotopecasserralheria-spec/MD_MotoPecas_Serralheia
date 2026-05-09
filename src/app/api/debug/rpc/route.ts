import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/debug/rpc?email=teste@teste.com&senha=123456
// Testa o formato de retorno das RPCs — desativado em produção
export async function GET(req: Request) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Não disponível em produção' }, { status: 404 })
    }
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email') || `debug_${Date.now()}@teste.com`
    const senha = searchParams.get('senha') || '123456'

    const sb = createServerClient()
    const resultados: any = {}

    // Teste 1: cadastrar_cliente (retorna UUID)
    const r1 = await sb.rpc('cadastrar_cliente', {
      p_nome: 'Debug', p_email: email, p_senha: senha, p_telefone: null,
    })
    resultados.cadastrar_cliente = {
      dadosRaw: JSON.parse(JSON.stringify(r1.data)),
      erro: r1.error?.message || null,
      tipoDado: typeof r1.data,
      isArray: Array.isArray(r1.data),
      primeiroElemento: r1.data?.[0],
      tipoPrimeiro: typeof r1.data?.[0],
      chavesPrimeiro: r1.data?.[0] ? Object.keys(r1.data[0]) : [],
    }

    // Se o primeiro foi inserido, deleta pra não poluir
    if (r1.data?.[0]) {
      await sb.from('clientes').delete().eq('email', email)
    }

    // Teste 2: inserir_cliente (retorna JSONB)
    const r2 = await sb.rpc('inserir_cliente', {
      p_nome: 'Debug', p_email: `debug2_${Date.now()}@teste.com`,
      p_senha_hash: '$2a$10$x', p_telefone: null,
    })
    resultados.inserir_cliente = {
      dadosRaw: JSON.parse(JSON.stringify(r2.data)),
      erro: r2.error?.message || null,
      primeiroElemento: r2.data?.[0],
      chavesPrimeiro: r2.data?.[0] ? Object.keys(r2.data[0]) : [],
    }

    if (r2.data?.[0]) {
      await sb.from('clientes').delete().eq('email', `debug2_${Date.now()}@teste.com`)
    }

    return NextResponse.json(resultados)
  } catch (e: any) {
    console.error('[DEBUG RPC] error:', e.message || e)
    return NextResponse.json({ error: e.message || 'Erro interno' }, { status: 500 })
  }
}
