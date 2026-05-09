import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Catálogo de Peças para Moto',
  description: 'Peças para Honda, Yamaha, Suzuki, Kawasaki e mais. Correntes, pneus, pastilhas, filtros e acessórios.',
  openGraph: {
    title: 'Catálogo de Peças para Moto | MD Moto Peças',
    description: 'Peças para Honda, Yamaha, Suzuki, Kawasaki e mais. Correntes, pneus, pastilhas, filtros e acessórios.',
    url: 'https://mdmotopecas.com.br/catalogo',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

const categorias = [
  { id: 'transmissao', nome: 'Transmissão', emoji: '⛓️', itens: ['Correntes', 'Relações', 'Coroas', 'Pinhões'] },
  { id: 'freios', nome: 'Freios', emoji: '🛑', itens: ['Pastilhas disco', 'Lonas de tambor', 'Discos de freio', 'Fluido de freio'] },
  { id: 'pneus', nome: 'Pneus', emoji: '⚫', itens: ['Pneus dianteiros', 'Pneus traseiros', 'Câmaras de ar', 'Protetores'] },
  { id: 'motor', nome: 'Motor', emoji: '🔧', itens: ['Filtros de ar', 'Filtros de óleo', 'Velas de ignição', 'Correias', 'Óleo motor'] },
  { id: 'eletrica', nome: 'Elétrica', emoji: '⚡', itens: ['Faróis', 'Lanternas', 'Baterias', 'Reguladores', 'Pisca-piscas'] },
  { id: 'acessorios', nome: 'Acessórios', emoji: '🪖', itens: ['Capacetes', 'Luvas', 'Jaquetas', 'Botas', 'Retrovisor'] },
]

const marcas = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Shineray', 'Dafra', 'Haojue', 'BMW', 'Triumph']
const wp = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'

export default function CatalogoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-gray-900 py-16 px-4">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <span className="badge bg-brand-500/20 text-brand-400 mb-4">🔧 Catálogo de Peças</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Encontre a peça certa<br />para sua <span className="gradient-text">moto</span>
          </h1>
          <p className="text-gray-400 max-w-xl mb-8">
            Atendemos todas as marcas. Confirme disponibilidade e preço pelo WhatsApp.
          </p>
          <a
            href={`https://wa.me/${wp}?text=Olá! Quero verificar se têm a peça que preciso.`}
            target="_blank"
            referrerPolicy="no-referrer-when-downgrade"
            className="btn-primary inline-flex"
          >
            💬 Checar disponibilidade no WhatsApp
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-10 px-4 bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-700">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Marcas atendidas:</p>
          <div className="flex flex-wrap gap-2">
            {marcas.map(m => (
              <span key={m} className="px-3 py-1.5 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="section">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Categorias de peças</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {categorias.map(cat => (
            <div key={cat.id} className="card p-6 group">
              <div className="text-4xl mb-4">{cat.emoji}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{cat.nome}</h3>
              <ul className="space-y-1.5 mb-5">
                {cat.itens.map(item => (
                  <li key={item} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand-500 rounded-full" />{item}
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${wp}?text=Olá! Preciso de peças da categoria ${cat.nome}.`}
                target="_blank"
                referrerPolicy="no-referrer-when-downgrade"
                className="text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Solicitar pelo WhatsApp <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-12 text-center p-8 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Não encontrou o que precisa?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Fale pelo WhatsApp e nossa equipe verifica a disponibilidade para você!
          </p>
          <a
            href={`https://wa.me/${wp}?text=Olá! Preciso de uma peça específica que não encontrei no site.`}
            target="_blank"
            referrerPolicy="no-referrer-when-downgrade"
            className="btn-primary inline-flex"
          >
            💬 Falar com nossa equipe
          </a>
        </div>
      </section>
    </>
  )
}
