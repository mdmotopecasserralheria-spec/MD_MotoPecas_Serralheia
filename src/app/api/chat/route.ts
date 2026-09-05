import { NextRequest, NextResponse } from 'next/server'
import { orquestrador, responderAgente, type MensagemChat } from '@/lib/agentes'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { mensagem, historico = [] } = await req.json() as {
      mensagem: string
      historico: MensagemChat[]
    }

    if (!mensagem || mensagem.trim().length === 0) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
    }

    if (mensagem.length > 500) {
      return NextResponse.json({ error: 'Mensagem muito longa' }, { status: 400 })
    }

    // Orquestrador decide qual agente usar
    const { agente, empresa } = await orquestrador(mensagem, historico)

    // Agente responde
    const resposta = await responderAgente(agente, mensagem, historico)

    // Log de analytics (opcional)
    const log = {
      timestamp: new Date().toISOString(),
      agente,
      empresa,
      mensagem_chars: mensagem.length,
    }
    console.log('[CHAT]', JSON.stringify(log))

    return NextResponse.json({
      resposta,
      agente,
      empresa,
    })
  } catch (err: any) {
    // Diagnóstico: diferenciar chave ausente de demais erros
    const msg = err?.message || String(err)
    const semChave = msg?.includes('x_key_missing') || /GROQ_API_KEY|apiKey|401|authentication/i.test(String(msg))
    console.error('[CHAT ERROR]', msg, { stack: err?.stack })
    return NextResponse.json(
      { error: semChave ? 'Chave do Groq não configurada.' : 'Erro ao processar. Tente novamente.' },
      { status: semChave ? 503 : 500 }
    )
  }
}
