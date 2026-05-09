'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [resetLink, setResetLink] = useState('')

  async function solicitar() {
    if (!email) { toast.error('Informe seu email'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/clientes?action=solicitar-recuperacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setEnviado(true)
        if (data.resetLink) setResetLink(data.resetLink)
      } else {
        toast.error(data.error || 'Erro ao solicitar recuperação')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Image src="/images/logo.webp" alt="MD Moto Peças" width={140} height={69} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {enviado ? 'Verifique seu email' : 'Receba um link para redefinir sua senha'}
            </p>
          </div>

          {enviado ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center text-green-500">
                <CheckCircle size={48} />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Se o email <strong>{email}</strong> estiver cadastrado, você receberá um link de recuperação.
              </p>
              {resetLink && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Link de recuperação (desenvolvimento):</p>
                  <a href={resetLink} className="text-blue-600 dark:text-blue-400 text-sm break-all font-medium hover:underline">
                    Clique aqui para redefinir sua senha
                  </a>
                </div>
              )}
              <p className="text-sm text-gray-400">O link expira em 1 hora.</p>
              <Link href="/vitrine/login" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">
                <ArrowLeft size={16} /> Voltar ao login
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="rec-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input id="rec-email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="seu@email.com" autoComplete="email" className="input" onKeyDown={e => e.key === 'Enter' && solicitar()} />
              </div>

              <button
                onClick={solicitar}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all mt-2"
                style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
              >
                <Mail size={16} />
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-300">
                <Link href="/vitrine/login" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  <ArrowLeft size={14} /> Voltar ao login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
