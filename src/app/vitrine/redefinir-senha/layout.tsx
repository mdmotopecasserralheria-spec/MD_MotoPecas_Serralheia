import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redefinir Senha — Vitrine MD Moto Peças',
  description: 'Redefina sua senha de acesso ao painel de anunciante da Vitrine MD Moto Peças.',
}

export default function RedefinirSenhaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
