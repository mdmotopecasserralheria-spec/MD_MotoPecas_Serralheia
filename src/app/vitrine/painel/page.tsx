import type { Metadata } from 'next'
import { PainelAnunciante } from '@/components/vitrine/PainelAnunciante'

export const metadata: Metadata = { title: 'Meus Anúncios — Vitrine MD Moto Peças', description: 'Gerencie seus anúncios na Vitrine MD Moto Peças. Acompanhe status, crie novos anúncios e edite seus listings.' }

export default function PainelPage() {
  return <PainelAnunciante />
}
