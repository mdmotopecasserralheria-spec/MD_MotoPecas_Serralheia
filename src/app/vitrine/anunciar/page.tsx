import type { Metadata } from 'next'
import { CadastroAnunciante } from '@/components/vitrine/CadastroAnunciante'

export const metadata: Metadata = { title: 'Anunciar grátis — Vitrine MD Moto Peças', description: 'Anuncie grátis na Vitrine MD Moto Peças. Venda suas peças e serviços de serralheria em Santa Tereza de Goiás.' }

export default function AnunciarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f)' }}>
      <CadastroAnunciante />
    </main>
  )
}
