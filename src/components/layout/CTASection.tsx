import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react'

export function CTASection() {
  const wp = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'
  const cidade = process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'

  return (
    <section className="py-20 px-4 bg-white dark:bg-dark-900">
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto text-center">
        <div className="card p-10 md:p-16 bg-gradient-to-br from-gray-950 to-gray-900 border-gray-800">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Precisa de peça ou<br />orçamento de serralheria?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Nossa IA atende 24h no site. Para comprar, fale direto pelo WhatsApp!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`https://wa.me/${wp}?text=Olá! Vim pelo site e preciso de ajuda.`}
              target="_blank"
              referrerPolicy="no-referrer-when-downgrade"
              className="btn-primary text-base py-4 px-8"
            >
              💬 Falar pelo WhatsApp
              <ArrowRight size={18} />
            </Link>
            <Link href="/catalogo" className="btn-secondary text-base py-4 px-8 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-700 hover:text-white">
              Ver catálogo de peças
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-500" />{cidade}, GO</span>
            <span className="flex items-center gap-2"><Clock size={14} className="text-brand-500" />Seg–Sáb 8h–18h</span>
            <span className="flex items-center gap-2"><Phone size={14} className="text-brand-500" />Atendimento por WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  )
}
