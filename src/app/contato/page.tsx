import type { Metadata } from 'next'
import { MapPin, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato e Localização',
  description: 'Entre em contato com a MD Moto Peças e Serralheria. WhatsApp, localização e horários de atendimento.',
  openGraph: {
    title: 'Contato e Localização | MD Moto Peças',
    description: 'Entre em contato com a MD Moto Peças e Serralheria. WhatsApp, localização e horários de atendimento.',
    url: 'https://mdmotopecas.com.br/contato',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

const cidade = process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'
const wp = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'
const wpSerr = process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '5562991444852'

export default function ContatoPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-gray-950 to-gray-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="badge bg-brand-500/20 text-brand-400 mb-4">📍 Localização</span>
          <h1 className="text-4xl font-bold text-white mb-4">Como nos encontrar</h1>
          <p className="text-gray-400">Estamos em {cidade}, Goiás. Fale pelo WhatsApp ou venha nos visitar!</p>
        </div>
      </section>

      <section className="section">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Informações */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Informações de contato</h2>
              <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Endereço</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Av. Bernardo Sayão, 628 — {cidade}, GO — Brasil</p>
                      <p className="text-gray-400 text-xs mt-1">CNPJ: 13.276.452/0001-42</p>
                    </div>
                  </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Horário</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Segunda a Sábado: 8h às 18h</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Domingo e feriados: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">WhatsApp por setor</h2>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${wp}?text=Olá! Vim pelo site e preciso de peças.`}
                  target="_blank"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 hover:border-green-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏍️</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">MD Moto Peças</p>
                      <p className="text-green-600 dark:text-green-400 text-xs">Peças, acessórios e capacetes</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href={`https://wa.me/${wpSerr}?text=Olá! Vim pelo site e quero um orçamento de serralheria.`}
                  target="_blank"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 hover:border-green-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">MD Serralheria</p>
                      <p className="text-green-600 dark:text-green-400 text-xs">Portões, grades e estruturas</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Mapa placeholder */}
          <div className="card overflow-hidden">
            <div className="bg-gray-100 dark:bg-dark-700 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={40} className="text-brand-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">{cidade}, GO</p>
                <p className="text-gray-400 text-sm mt-1">Clique para abrir no Google Maps</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent('Av. Bernardo Sayão, 628, ' + cidade + ' GO')}`}
                  target="_blank"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline"
                >
                  Abrir no Google Maps <ArrowRight size={12} />
                </a>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Como chegar</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Localize-nos no Google Maps ou entre em contato pelo WhatsApp para mais informações de localização.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
