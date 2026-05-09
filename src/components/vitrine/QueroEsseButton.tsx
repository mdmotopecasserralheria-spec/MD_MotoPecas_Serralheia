'use client'
import { useState } from 'react'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { WHATSAPP_PECAS } from '@/lib/constants'

interface QueroEsseButtonProps {
  anuncioId: string
}

export function QueroEsseButton({ anuncioId }: QueroEsseButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const stored = localStorage.getItem('vitrine_cliente')
      if (!stored) {
        const msg = `Olá! Tenho interesse no anúncio #${anuncioId}. Poderia me passar mais informações?`
        window.open(`https://wa.me/${WHATSAPP_PECAS}?text=${encodeURIComponent(msg)}`, '_blank')
        toast.success('Redirecionando para o WhatsApp...')
        setLoading(false)
        return
      }
      const cliente = JSON.parse(stored)
      const res = await fetch('/api/orcamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: cliente.nome || 'Lead WhatsApp',
          telefone: cliente.telefone || '00000000000',
          anuncio_id: anuncioId,
          mensagem: 'Quero esse anúncio!',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Erro ao registrar interesse')
        return
      }

      const msg = `Olá! Tenho interesse no anúncio #${anuncioId}. Poderia me passar mais informações?`
      window.open(`https://wa.me/${WHATSAPP_PECAS}?text=${encodeURIComponent(msg)}`, '_blank')
      toast.success('Redirecionando para o WhatsApp...')
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
    >
      {loading ? (
        <Loader size={18} className="animate-spin" />
      ) : (
        'Quero esse anúncio!'
      )}
    </button>
  )
}
