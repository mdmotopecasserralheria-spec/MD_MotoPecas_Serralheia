'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [form, setForm] = useState({ email: '', senha: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function entrar() {
    if (!form.email || !form.senha) { toast.error('Preencha email e senha'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/vitrine/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('vitrine_token', data.token)
        localStorage.setItem('vitrine_cliente', JSON.stringify(data.cliente))
        toast.success(`Olá, ${data.cliente.nome}!`)
        router.push('/vitrine/painel')
      } else {
        toast.error(data.error || 'Erro ao fazer login')
      }
    } catch (e) {
      console.error('Erro no login:', e)
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Painel do Anunciante</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Entre para gerenciar seus anúncios</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input id="login-email" value={form.email} onChange={set('email')} type="email" placeholder="seu@email.com" autoComplete="email" className="input" />
            </div>

            <div>
              <label htmlFor="login-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha</label>
              <div className="relative">
                <input id="login-senha"
                  value={form.senha}
                  onChange={set('senha')}
                  type={showSenha ? 'text' : 'password'}
                  placeholder="Sua senha"
                  className="input pr-10"
                  autoComplete="current-password"
                  onKeyDown={e => e.key === 'Enter' && entrar()}
                />
                <button type="button" onClick={() => setShowSenha(!showSenha)}
                  aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={entrar}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all mt-2"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
            >
              <LogIn size={16} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-center text-sm">
              <Link href="/vitrine/recuperar-senha" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Esqueci minha senha
              </Link>
            </p>

            <p className="text-center text-sm text-gray-500 dark:text-gray-300">
              Não tem conta?{' '}
              <Link href="/vitrine/cadastro" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
