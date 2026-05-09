import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meus Anúncios — Área do Cliente',
  description: 'Gerencie seus anúncios na Vitrine MD Moto Peças.',
  robots: { index: false, follow: false },
}

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
