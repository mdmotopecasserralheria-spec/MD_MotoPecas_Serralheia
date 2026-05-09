'use client'
import { useState, useEffect, useCallback } from 'react'
import { Star, Trash2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Avaliacao {
  id: string
  nome: string
  nota: number
  comentario: string | null
  aprovado: boolean
  criado_em: string
}

interface TabAvaliacoesProps {
  token: string
}

export function TabAvaliacoes({ token }: TabAvaliacoesProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/avaliacoes?admin=true', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAvaliacoes(data.avaliacoes || [])
    } catch {
      toast.error('Erro ao carregar avaliações')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { carregar() }, [carregar])

  async function excluir(id: string) {
    const res = await fetch(`/api/avaliacoes?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) { toast.error('Erro ao excluir avaliação'); return }
    setAvaliacoes(prev => prev.filter(a => a.id !== id))
    toast.success('Avaliação excluída')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {avaliacoes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Nenhuma avaliação encontrada</div>
      ) : (
        avaliacoes.map(a => (
          <div key={a.id} className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>
              {a.nome?.[0]?.toUpperCase() || '?'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{a.nome}</h4>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < a.nota ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1.5">{a.nota}/5</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    a.aprovado
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {a.aprovado ? 'Aprovada' : 'Pendente'}
                  </span>
                  {!a.aprovado && (
                    <button onClick={async () => {
                      const res = await fetch('/api/avaliacoes', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ id: a.id, aprovado: true }),
                      })
                      if (res.ok) { toast.success('Avaliação aprovada!'); carregar() }
                      else toast.error('Erro ao aprovar')
                    }} className="text-green-500 hover:text-green-700 transition-colors" title="Aprovar avaliação">
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => excluir(a.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Excluir avaliação"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {a.comentario && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-dark-600 p-3 rounded-lg">
                  {a.comentario}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {format(new Date(a.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
