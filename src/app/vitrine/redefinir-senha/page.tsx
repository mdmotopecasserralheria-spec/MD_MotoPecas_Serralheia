'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function RedefinirForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<'ok' | 'erro' | null>(null)

  useEffect(() => {
    if (!token) setResultado('erro')
  }, [token])

  async function redefinir() {
    if (!senha || !confirmar) { toast.error('Preencha todos os campos'); return }
    if (senha !== confirmar) { toast.error('Senhas não conferem'); return }
    if (senha.length < 6) { toast.error('Senha deve ter ao menos 6 caracteres'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/clientes?action=redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha }),
      })
      const data = await res.json()
      if (res.ok) {
        setResultado('ok')
        toast.success('Senha redefinida!')
      } else {
        toast.error(data.error || 'Erro ao redefinir senha')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center space-y-4">
            <div className="flex justify-center text-red-500"><XCircle size={48} /></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Link Inválido</h1>
            <p className="text-gray-500 dark:text-gray-400">O link de recuperação está incorreto ou ausente.</p>
            <Link href="/vitrine/recuperar-senha" className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">
              Solicitar novo link
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (resultado === 'ok') {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center space-y-4">
            <div className="flex justify-center text-green-500"><CheckCircle size={48} /></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Senha Redefinida!</h1>
            <p className="text-gray-500 dark:text-gray-400">Sua senha foi alterada com sucesso.</p>
            <button onClick={() => router.push('/vitrine/login')} className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all" style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
              Fazer Login
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Image src="/images/logo.webp" alt="MD Moto Peças" width={140} height={69} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Redefinir Senha</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Escolha uma nova senha</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="red-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nova Senha</label>
              <div className="relative">
                <input id="red-senha" value={senha} onChange={e => setSenha(e.target.value)} type={showSenha ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" className="input pr-10" autoComplete="new-password" />
                <button type="button" onClick={() => setShowSenha(!showSenha)} aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="red-confirmar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirmar Senha</label>
              <input id="red-confirmar" value={confirmar} onChange={e => setConfirmar(e.target.value)} type="password" placeholder="Repita a senha" className="input" autoComplete="new-password" onKeyDown={e => e.key === 'Enter' && redefinir()} />
            </div>

            <button
              onClick={redefinir}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all mt-2"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
            >
              <Lock size={16} />
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center text-gray-500 dark:text-gray-400">Carregando...</div>
      </main>
    }>
      <RedefinirForm />
    </Suspense>
  )
}
