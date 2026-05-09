'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export function CadastroForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '', confirma: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function enviar() {
    if (!form.nome || !form.email || !form.senha) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    if (form.senha !== form.confirma) {
      toast.error('As senhas não coincidem')
      return
    }
    if (form.senha.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/vitrine/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email: form.email, senha: form.senha, telefone: form.telefone }),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('vitrine_token', data.token)
        localStorage.setItem('vitrine_cliente', JSON.stringify(data.cliente))
        toast.success(`Bem-vindo, ${data.cliente.nome}! 🎉`)
        router.push('/vitrine/painel')
      } else {
        toast.error(data.error || 'Erro ao criar conta')
      }
    } catch (e) {
      console.error('Erro no cadastro:', e)
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
            <Image src="/icons/Logo para Perfil.png" alt="MD Moto Peças" width={80} height={80} className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar conta grátis</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Cadastre-se e anuncie gratuitamente
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="cadastro-nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome completo *</label>
              <input id="cadastro-nome" value={form.nome} onChange={set('nome')} placeholder="Seu nome" autoComplete="name" className="input" />
            </div>

            <div>
              <label htmlFor="cadastro-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input id="cadastro-email" value={form.email} onChange={set('email')} type="email" placeholder="seu@email.com" autoComplete="email" className="input" />
            </div>

            <div>
              <label htmlFor="cadastro-telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp para contato</label>
              <input id="cadastro-telefone" value={form.telefone} onChange={set('telefone')} placeholder="(62) 9 9999-9999" autoComplete="tel" className="input" />
            </div>

            <div>
              <label htmlFor="cadastro-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha *</label>
              <div className="relative">
                <input id="cadastro-senha"
                  value={form.senha}
                  onChange={set('senha')}
                  type={showSenha ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  className="input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="cadastro-confirma" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirmar senha *</label>
              <input id="cadastro-confirma"
                value={form.confirma}
                onChange={set('confirma')}
                type="password"
                placeholder="Repita a senha"
                className="input"
                autoComplete="new-password"
                onKeyDown={e => e.key === 'Enter' && enviar()}
              />
            </div>

            <button
              onClick={enviar}
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
            >
              {loading ? 'Criando conta...' : 'Criar minha conta'}
              {!loading && <ArrowRight size={16} />}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-300">
              Já tem conta?{' '}
              <Link href="/vitrine/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-400 text-center">
            ℹ️ Após criar o anúncio, ele passará por <strong>aprovação do administrador</strong> antes de aparecer na vitrine pública.
          </p>
        </div>
      </div>
    </main>
  )
}
