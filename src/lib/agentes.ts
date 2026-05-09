import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ─── Tipos ───────────────────────────────────────────────
export type Empresa = 'pecas' | 'serralheria' | 'geral'
export type Agente = 'pecas' | 'serralheria' | 'geral' | 'vendas'

export interface MensagemChat {
  role: 'user' | 'assistant'
  content: string
}

// ─── Orquestrador ────────────────────────────────────────
export async function orquestrador(
  mensagem: string,
  _historico: MensagemChat[]
): Promise<{ agente: Agente; empresa: Empresa }> {
  const prompt = `Você é um orquestrador inteligente. Analise a mensagem do cliente e retorne JSON com:
- "agente": qual agente deve responder (pecas | serralheria | geral | vendas)
- "empresa": qual empresa é mais relevante (pecas | serralheria | geral)

Regras:
- "pecas": perguntas sobre peças, marcas de moto, compatibilidade, preços de peças, estoque
- "serralheria": portões, grades, corrimão, estruturas metálicas, orçamento de serralheria
- "vendas": cliente demonstra interesse claro em comprar. Palavras-chave: "quero ver", "quanto custa", "tem?", "quero comprar", "fechar", "me ajuda", "quero com vocês", "preço"
- "geral": horário, endereço, formas de pagamento, dúvidas genéricas, perguntas sobre a vitrine de anúncios, como anunciar, cadastro de anunciante

Mensagem: "${mensagem}"

Responda SOMENTE com JSON válido, sem texto adicional. Exemplo: {"agente":"pecas","empresa":"pecas"}`

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    max_tokens: 60,
    messages: [{ role: 'user', content: prompt }],
  })

  try {
    const json = JSON.parse(res.choices[0].message.content || '{}')
    return { agente: json.agente || 'geral', empresa: json.empresa || 'geral' }
  } catch {
    return { agente: 'geral', empresa: 'geral' }
  }
}

// ─── Agente Peças ─────────────────────────────────────────
const SYSTEM_PECAS = `Você é o vendedor da MD Moto Peças em ${process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'}, GO.

FLUXO (siga UM passo por vez):
1. Cliente perguntou por peça? Pergunte APENAS o modelo/ano e se é original ou paralela.
2. AGUARDE a resposta. NÃO ofereça WhatsApp ainda.
3. DEPOIS de saber modelo + peça, feche com resumo + WhatsApp. Ex: "**Corrente paralela CG 125 2012** — chama no WhatsApp que confirmo o valor e estoque pra você."

REGRAS:
- NUNCA ofereça WhatsApp na mesma mensagem que fez uma pergunta.
- Se o cliente disser "quanto custa", "quero ver", "tem?" depois de já ter dado as infos, feche na hora.
- Máximo 2 frases por vez.

WhatsApp: ${process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '(62) 99999-9999'}
Horário: Seg a Sáb 8h-18h
Atendemos: Honda, Yamaha, Suzuki, Kawasaki, Shineray, Dafra, Haojue, BMW, Triumph.`

// ─── Agente Serralheria ───────────────────────────────────
const SYSTEM_SERRALHERIA = `Você é o vendedor da MD Serralheria em ${process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'}, GO.

FLUXO (siga UM passo por vez):
1. Cliente pediu orçamento? Pergunte APENAS o tipo e as medidas. Ex: "Qual o tipo de portão e as medidas?"
2. AGUARDE o cliente responder. NÃO ofereça WhatsApp ainda.
3. DEPOIS que ele responder, feche com resumo + WhatsApp. Ex: "Anotei! **Portão deslizante 3m** — me chama no WhatsApp que o serralheiro faz o orçamento."

REGRAS:
- NUNCA ofereça WhatsApp na mesma mensagem que fez uma pergunta. Primeiro espera a resposta.
- Máximo 2 frases por vez.
- Se já tiver as medidas e tipo, aí sim ofereça o WhatsApp.

WhatsApp: ${process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '(62) 99999-9998'}
Orçamento: gratuito e personalizado.`

// ─── Agente Geral ─────────────────────────────────────────
const SYSTEM_GERAL = `Você é o recepcionista da MD Moto Peças e Serralheria em ${process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'}, GO.

- Informações rápidas: endereço (${process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'}, GO), horário (Seg a Sáb 8h-18h), WhatsApp Peças ${process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '(62) 99999-9999'}, WhatsApp Serralheria ${process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '(62) 99999-9998'}.
- Pagamento: dinheiro, PIX e cartão.
- Se a dúvida for específica de peças ou serralheria, apresente o agente certo.
- Responda em no máximo 2 frases.

VITRINE DE ANÚNCIOS: O site tem uma seção "Vitrine" (/vitrine) onde anunciantes cadastrados podem criar anúncios gratuitos de peças de moto e serviços de serralheria. Os anúncios passam por aprovação do administrador antes de aparecerem publicamente. Para criar um anúncio, o usuário se cadastra em /vitrine/anunciar ou /vitrine/cadastro, faz login e gerencia os anúncios no painel /vitrine/painel. Qualquer pessoa pode ver os anúncios aprovados em /vitrine sem precisar de cadastro.`

// ─── Agente Vendas ────────────────────────────────────────
const SYSTEM_VENDAS = `Você finaliza a venda da MD Moto Peças e Serralheria.

REGRA:
- Recapitule o pedido em 1 frase e passe o WhatsApp. Ex: "**Corrente paralela CG 125 2012** — chama no WhatsApp que eu passo o valor."
- Máximo 2 frases. Sem perguntas.

WhatsApp Peças: ${process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '(62) 99999-9999'}
WhatsApp Serralheria: ${process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '(62) 99999-9998'}`

// ─── Dispatcher ──────────────────────────────────────────
const SYSTEMS: Record<Agente, string> = {
  pecas: SYSTEM_PECAS,
  serralheria: SYSTEM_SERRALHERIA,
  geral: SYSTEM_GERAL,
  vendas: SYSTEM_VENDAS,
}

export async function responderAgente(
  agente: Agente,
  mensagem: string,
  historico: MensagemChat[]
): Promise<string> {
  const messages = [
    { role: 'system' as const, content: SYSTEMS[agente] },
    ...historico.slice(-8).map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: mensagem },
  ]

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 300,
    messages,
  })

  return res.choices[0].message.content || 'Desculpe, não consegui processar. Fale pelo WhatsApp!'
}
