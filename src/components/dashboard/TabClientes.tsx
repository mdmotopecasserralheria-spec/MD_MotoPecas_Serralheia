'use client'
import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string | null
  criado_em: string
}

interface TabClientesProps {
  token: string
}

export function TabClientes({ token }: TabClientesProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch {
      setClientes([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { carregar() }, [carregar])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-dark-600">
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Nome</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Telefone</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Cadastro</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-12 text-gray-400">Nenhum cliente cadastrado</td>
            </tr>
          ) : (
            clientes.map(c => (
              <tr key={c.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{c.nome}</td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-300">{c.email}</td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-300">{c.telefone || '—'}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">
                  {format(new Date(c.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
