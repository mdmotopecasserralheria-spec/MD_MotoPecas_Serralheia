'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'

export function AvaliacoesCard() {
  const [nome, setNome] = useState('')
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)

  async function enviar() {
    if (!nome || nota === 0) {
      toast.error('Preencha seu nome e selecione uma nota')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, nota, comentario: comentario || null }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Erro ao enviar avaliação')
        return
      }
      toast.success('Avaliação enviada com sucesso! Obrigado!')
      setNome('')
      setNota(0)
      setComentario('')
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white dark:bg-dark-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-600">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <Star size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Avalie nosso atendimento</p>
          <p className="text-[11px] text-gray-400">Sua opinião é importante para nós</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input id="avaliacao-nome" value={nome} onChange={e => setNome(e.target.value)}
            placeholder="Seu nome" className="input flex-1 text-sm text-gray-900 dark:text-white" />
          <div className="flex gap-0.5 flex-shrink-0">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setNota(n)}
                className="p-1 transition-all hover:scale-110">
                <Star size={20} className={n <= nota ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
              </button>
            ))}
          </div>
        </div>

        <textarea id="avaliacao-comentario" value={comentario} onChange={e => setComentario(e.target.value)}
          rows={2} placeholder="Conte sua experiência (opcional)..." className="input resize-none text-sm text-gray-900 dark:text-white" />

        <button onClick={enviar} disabled={loading || !nome || nota === 0}
          className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>
          {loading ? 'Enviando...' : 'Enviar avaliação'}
        </button>
      </div>
    </div>
  )
}
