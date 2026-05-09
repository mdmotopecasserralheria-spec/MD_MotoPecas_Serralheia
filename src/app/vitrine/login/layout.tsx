import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login — Vitrine MD Moto Peças',
  description: 'Entre na Vitrine MD Moto Peças para gerenciar seus anúncios e acessar o painel do anunciante.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
