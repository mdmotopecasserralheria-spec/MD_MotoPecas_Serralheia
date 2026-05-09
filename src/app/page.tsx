import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/layout/HeroSection'
import { ServicesSection } from '@/components/layout/ServicesSection'
import { TestimonialsSection } from '@/components/layout/TestimonialsSection'
import { CTASection } from '@/components/layout/CTASection'
import { Smartphone } from 'lucide-react'

const InstallButton = dynamic(() => import('@/components/InstallButton'), { ssr: false })

export const metadata: Metadata = {
  title: 'Início — MD Moto Peças + Serralheria',
  description: 'Peças para motos e serviços de serralheria em Santa Tereza de Goiás, GO. Encontre peças compatíveis com sua moto e solicite orçamentos de serralheria pelo WhatsApp.',
}

export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />

      {/* Seção Instalar App */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Instale o App da MD Moto
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
            Acesso rápido, modo offline e notificações de ofertas e orçamentos direto no seu celular.
          </p>
          <InstallButton />
          <p className="text-xs text-gray-400 mt-4">Disponível para Android e iOS. Gratuito.</p>
        </div>
      </section>
    </>
  )
}
