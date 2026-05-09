import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar Senha — Vitrine MD Moto Peças',
  description: 'Recupere sua senha de acesso ao painel de anunciante da Vitrine MD Moto Peças.',
}

export default function RecuperarSenhaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
