'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export function LoginCliente({ defaultMode }: { defaultMode?: 'login' | 'cadastro' }) {
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'cadastro'>(defaultMode || 'login')
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '' })
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)

  async function handleSubmit() {
    if (!form.email || !form.senha) { toast.error('Preencha todos os campos'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/clientes?action=${modo === 'login' ? 'login' : 'cadastro'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Erro'); return }
      localStorage.setItem('vitrine_token', data.token)
      localStorage.setItem('vitrine_cliente', JSON.stringify(data.cliente))
      toast.success(modo === 'login' ? 'Bem-vindo de volta! 👋' : 'Cadastro realizado! ✅')
      router.push('/vitrine/painel')
    } catch { toast.error('Erro de conexão') }
    finally { setLoading(false) }
  }

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => {
    const fieldId = `field-${key}`
    return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-blue-100 mb-1.5">{label}</label>
      {type === 'password' ? (
        <div className="relative">
          <input id={fieldId} type={showSenha ? 'text' : 'password'} value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder} className="input pr-10" />
          <button type="button" onClick={() => setShowSenha(v => !v)}
            aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      ) : (
        <input id={fieldId} type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder} className="input" />
      )}
    </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-center mb-8">
          <Image src="/icons/Logo para Perfil.png" alt="MD Moto Peças" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-1">
            {modo === 'login' ? 'Entrar na Vitrine' : 'Criar conta grátis'}
          </h1>
          <p className="text-blue-200 text-sm">
            Cadastre-se e anuncie gratuitamente
          </p>
        </div>

        <div className="space-y-4">
          {modo === 'cadastro' && field('nome', 'Seu nome completo *', 'text', 'Ex: João da Silva')}
          {field('email', 'Email *', 'email', 'seu@email.com')}
          {field('senha', 'Senha *', 'password', modo === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••')}
          {modo === 'cadastro' && field('telefone', 'WhatsApp para contato *', 'tel', '(62) 9 9999-9999')}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: '#FFD700', color: '#0a1628' }}>
            <LogIn size={16} />
            {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar minha conta'}
          </button>
        </div>

        {modo === 'login' && (
          <div className="mt-3 text-center">
            <Link href="/vitrine/recuperar-senha"
              className="text-sm text-blue-300 hover:text-white transition-colors">
              Esqueci minha senha
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => setModo(m => m === 'login' ? 'cadastro' : 'login')}
            className="text-sm text-blue-300 hover:text-white transition-colors">
            {modo === 'login' ? 'Não tem conta? Cadastre-se grátis' : 'Já tem conta? Entrar'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/vitrine" className="text-xs text-blue-400 hover:text-blue-200 transition-colors">
            ← Voltar para a Vitrine
          </Link>
        </div>
      </div>
    </div>
  )
}
