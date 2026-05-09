'use client'
import { useState, useEffect, useCallback } from 'react'
import { Trash2, MessageSquare, Phone, User, Calendar, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Orcamento {
  id: string
  nome: string
  telefone: string
  anuncio_id: string | null
  mensagem: string | null
  status: string
  criado_em: string
  clientes?: { nome: string; telefone: string } | null
}

const COLUMNS = [
  { key: 'pendente', label: 'Pendentes', color: 'yellow' },
  { key: 'respondido', label: 'Respondidos', color: 'blue' },
  { key: 'convertido', label: 'Convertidos', color: 'green' },
  { key: 'fechado', label: 'Fechado', color: 'gray' },
] as const

interface TabOrcamentosProps {
  token: string
}

export function TabOrcamentos({ token }: TabOrcamentosProps) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(true)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orcamentos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setOrcamentos(data.orcamentos || [])
    } catch {
      toast.error('Erro ao carregar orçamentos')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { carregar() }, [carregar])

  async function atualizarStatus(id: string, status: string) {
    const res = await fetch('/api/orcamentos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) { toast.error('Erro ao atualizar status'); return }
    setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    toast.success('Status atualizado!')
  }

  async function excluir(id: string) {
    const res = await fetch(`/api/orcamentos?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) { toast.error('Erro ao excluir'); return }
    setOrcamentos(prev => prev.filter(o => o.id !== id))
    toast.success('Orçamento excluído')
  }

  function handleDragStart(id: string) {
    setDraggingId(id)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(status: string) {
    if (draggingId) {
      atualizarStatus(draggingId, status)
      setDraggingId(null)
    }
  }

  function getCardContent(o: Orcamento) {
    const nome = o.clientes?.nome || o.nome
    const telefone = o.clientes?.telefone || o.telefone
    return { nome, telefone }
  }

  return (
    <div>
      {loading && orcamentos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const items = orcamentos.filter(o => o.status === col.key)
            return (
              <div
                key={col.key}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.key)}
                className="bg-gray-50 dark:bg-dark-800 rounded-xl p-4 min-h-[300px]"
              >
                <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg font-bold text-sm ${
                  col.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                  col.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                  col.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  'bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400'
                }`}>
                  <span className="text-xs">{items.length}</span>
                  <span>{col.label}</span>
                </div>

                <div className="space-y-3">
                  {items.map(o => {
                    const { nome, telefone } = getCardContent(o)
                    return (
                      <div
                        key={o.id}
                        draggable
                        onDragStart={() => handleDragStart(o.id)}
                        className="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                            <User size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{nome}</span>
                          </div>
                          <button
                            onClick={() => excluir(o.id)}
                            className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          <Phone size={12} className="flex-shrink-0" />
                          <span>{telefone}</span>
                        </div>

                        {o.anuncio_id && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            <Package size={12} className="flex-shrink-0" />
                            <span>Anúncio #{o.anuncio_id.slice(0, 8)}</span>
                          </div>
                        )}

                        {o.mensagem && (
                          <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300 mb-2 bg-gray-50 dark:bg-dark-600 p-2 rounded-lg">
                            <MessageSquare size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
                            <span className="line-clamp-2">{o.mensagem}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar size={12} className="flex-shrink-0" />
                          <span>{format(new Date(o.criado_em), "dd 'de' MMM", { locale: ptBR })}</span>
                        </div>
                      </div>
                    )
                  })}
                  {items.length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-400">
                      Nenhum orçamento
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
