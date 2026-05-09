import type { Metadata } from 'next'
import { LoginCliente } from '@/components/vitrine/LoginCliente'

export const metadata: Metadata = { title: 'Entrar — Vitrine MD Moto Peças', description: 'Entre no painel do anunciante da Vitrine MD Moto Peças para gerenciar seus anúncios.' }

export default function EntrarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f)' }}>
      <LoginCliente />
    </main>
  )
}
