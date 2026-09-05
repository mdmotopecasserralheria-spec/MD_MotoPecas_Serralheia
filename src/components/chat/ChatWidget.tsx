'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, MessageCircleMore } from 'lucide-react'
import type { MensagemChat } from '@/lib/agentes'

const QUICK_REPLIES = [
  'Que peças vocês têm?',
  'Quero um orçamento de portão',
  'Qual o horário de funcionamento?',
  'Corrente para Honda Titan',
]

function renderText(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g)
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>
          }
          return <span key={j}>{part}</span>
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    )
  })
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agente, setAgente] = useState<string>('')
  const [empresa, setEmpresa] = useState<string>('')
  const [historico, setHistorico] = useState<MensagemChat[]>([])
  const [msgs, setMsgs] = useState<{ role: 'bot' | 'user'; text: string; mostrarWhats?: boolean }[]>([
    { role: 'bot', text: `👋 Olá! Sou o assistente da **MD Moto Peças e Serralheria** 🏍️⚙️\n\nPosso te ajudar com:\n• Peças para sua moto\n• Orçamentos de serralheria\n• Horários e localização\n\nComo posso ajudar?` },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wpPecas = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'
  const wpSerralheria = process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '5562992458972'

  const wp = useMemo(() => empresa === 'serralheria' ? wpSerralheria : wpPecas, [empresa])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open, minimized])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) { setOpen(false); setMinimized(false) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  useEffect(() => {
    if (open && !minimized && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open, minimized])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth > 640 && containerRef.current && !containerRef.current.contains(e.target as Node) && open) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function enviar(texto?: string) {
    const msg = (texto || input).trim()
    if (!msg || loading) return

    setInput('')
    setMsgs(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    const novoHistorico: MensagemChat[] = [...historico, { role: 'user', content: msg }]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: msg, historico }),
      })
      const data = await res.json()
      const resposta = data.resposta || ''
      const citouWhats = /whatsapp|whats|me chama|me liga|falar com|chama no|me passa|entra em contato/i.test(resposta)

      setMsgs(prev => [...prev, { role: 'bot', text: resposta, mostrarWhats: citouWhats }])
      setAgente(data.agente || '')
      setEmpresa(data.empresa || 'pecas')
      setHistorico([...novoHistorico, { role: 'assistant', content: resposta }])
    } catch {
      setMsgs(prev => [...prev, { role: 'bot', text: 'Ops, tive um problema! Fale pelo WhatsApp 😅' }])
    } finally {
      setLoading(false)
    }
  }

  const agenteLabel: Record<string, string> = {
    pecas: '🔧 Agente Peças',
    serralheria: '⚙️ Agente Serralheria',
    vendas: '🛒 Agente Vendas',
    geral: '💬 Atendimento Geral',
  }

  function close() { setOpen(false); setMinimized(false) }

  // ── Toggle button ──
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed z-[70] group bottom-24 right-6"
        aria-label="Abrir chat de atendimento"
      >
        <div className="relative">
          <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center
            bg-gradient-to-br from-brand-500 to-brand-600
            text-white shadow-lg shadow-brand-500/30
            transition-all duration-300 ease-out
            group-hover:scale-110 group-hover:shadow-brand-500/50
            group-active:scale-95"
          >
            <MessageCircle className="w-7 h-7" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500
            rounded-full flex items-center justify-center text-[10px]
            font-bold text-white border-2 border-gray-900
            animate-pulse">1</span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2
            px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg
            whitespace-nowrap opacity-0 group-hover:opacity-100
            transition-opacity duration-200 pointer-events-none">
            Atendimento MD
          </span>
        </div>
      </button>
    )
  }

  return (
    <>
      {/* Overlay escuro (mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[69]
          transition-opacity duration-300 sm:hidden`}
        onClick={close}
      />

      {/* Chat */}
      <div
        ref={containerRef}
        style={{
          bottom: minimized ? '96px' : '100px',
          right: '24px'
        }}
        className={`fixed z-[70] flex flex-col
          transition-all duration-300 ease-out
          ${minimized
            ? 'w-80'
            : 'w-[360px] max-w-[calc(100vw-40px)] h-[520px] max-h-[calc(100vh-120px)]'
          }
        `}
        role="dialog" aria-modal="true" aria-label="Chat de atendimento MD Moto Peças"
      >
        {/* ── Header ── */}
        <div
          className={`bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800
            border-b border-white/5
            ${minimized ? 'rounded-2xl' : 'rounded-t-2xl'}
            px-4 py-3 flex items-center justify-between
            shadow-lg select-none flex-shrink-0`}
          onClick={() => minimized && setMinimized(false)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600
                flex items-center justify-center text-white font-bold text-lg
                shadow-lg shadow-brand-500/20">M</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                bg-green-500 border-2 border-gray-800 rounded-full" />
            </div>
            <div className="min-w-0 overflow-hidden">
              <h3 className="font-semibold text-sm text-white leading-tight truncate">MD Moto Peças</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="truncate">{agente ? agenteLabel[agente] : 'Online agora'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button onClick={e => { e.stopPropagation(); setMinimized(!minimized) }}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              aria-label={minimized ? 'Expandir' : 'Minimizar'}>
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={e => { e.stopPropagation(); close() }}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group/close"
              aria-label="Fechar chat">
              <X className="w-4 h-4 group-hover/close:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        {!minimized && (
          <>
            {/* Mensagens */}
            <div className="bg-gray-900 flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] sm:max-h-[360px]"
              role="log" aria-live="polite" aria-label="Mensagens da conversa"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(249,115,22,0.3) transparent' }}>
              {msgs.map((m, i) => {
                const resumo = msgs.slice(0, i+1)
                  .filter(x => x.role === 'user' && x.text.replace(/[?.!]/g,'').trim().length > 1)
                  .map(x => x.text.replace(/[?.!]+$/,'').trim())
                  .join(' → ')
                const msgWhats = resumo ? `Olá! Vim do site. ${resumo}` : 'Olá! Vim do site da MD Moto Peças e gostaria de mais informações.'
                return (
                <div key={i}>
                  <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'bot' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600
                        flex items-center justify-center text-white font-bold text-xs
                        flex-shrink-0 mr-2.5 mt-1 shadow-md">M</div>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                        ${m.role === 'user'
                          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-md shadow-md shadow-brand-500/10'
                          : 'bg-gray-800 text-gray-200 rounded-bl-md border border-white/5'
                        }`}
                      style={{ whiteSpace: 'pre-line' }}>
                      {renderText(m.text)}
                    </div>
                  </div>
                  {m.mostrarWhats && (
                    <div className="flex justify-start ml-10 mt-2 mb-1">
                      <a href={`https://wa.me/${wp}?text=${encodeURIComponent(msgWhats)}`}
                        target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer-when-downgrade"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 shadow-lg"
                        style={{ background: '#25D366', boxShadow: '0 4px 15px rgba(37,211,102,0.4)' }}>
                        <MessageCircleMore size={16} />
                        Falar com a nossa equipe
                      </a>
                    </div>
                  )}
                </div>
              )})}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600
                    flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mr-2.5">M</div>
                  <div className="bg-gray-800 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            {msgs.length === 1 && (
              <div className="bg-gray-900 px-4 pb-3 flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map(reply => (
                    <button key={reply} onClick={() => enviar(reply)}
                      className="px-3.5 py-1.5 text-xs font-medium
                        bg-gray-800 hover:bg-gray-700
                        text-brand-400 hover:text-brand-300
                        border border-brand-500/20 hover:border-brand-500/40
                        rounded-full transition-all duration-200
                        hover:scale-105 active:scale-95">
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input + Footer */}
            <div className="bg-gray-800 border-t border-white/5 p-3 rounded-b-2xl flex-shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <input ref={inputRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
                    placeholder="Digite sua dúvida..."
                    className="w-full px-4 py-2.5 pr-10 bg-gray-700/50
                      border border-white/10 rounded-xl
                      text-sm text-white placeholder-gray-500
                      focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20
                      transition-all"
                    aria-label="Digite sua mensagem" disabled={loading} />
                </div>
                <button onClick={() => enviar()}
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-gradient-to-br from-brand-500 to-brand-600
                    text-white rounded-xl hover:from-brand-400 hover:to-brand-500
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200 hover:scale-105 active:scale-95
                    shadow-lg shadow-brand-500/20 flex-shrink-0"
                  aria-label="Enviar mensagem">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>

              <a href={`https://wa.me/${wp}?text=Olá! Vim pelo chat do site da MD Moto Peças.`}
                target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer-when-downgrade"
                className="mt-2 flex items-center justify-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Prefere falar direto pelo WhatsApp?
              </a>
            </div>
          </>
        )}
      </div>
    </>
  )
}
