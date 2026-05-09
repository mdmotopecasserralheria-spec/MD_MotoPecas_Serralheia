import type { Metadata } from 'next'
import { CadastroForm } from '@/components/vitrine/CadastroForm'

export const metadata: Metadata = {
  title: 'Cadastro — Vitrine MD Moto Peças',
  description: 'Cadastre-se grátis na Vitrine MD Moto Peças e anuncie peças de moto e serviços de serralheria em Santa Tereza de Goiás.',
  openGraph: {
    title: 'Cadastro — Vitrine MD Moto Peças',
    description: 'Cadastre-se grátis e anuncie na vitrine. Peças de moto e serralheria em Santa Tereza de Goiás.',
  },
}

export default function CadastroPage() {
  return <CadastroForm />
}
