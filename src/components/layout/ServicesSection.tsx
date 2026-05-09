import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    emoji: '🏍️',
    title: 'Moto Peças',
    color: 'from-brand-500 to-brand-700',
    items: ['Correntes e relações', 'Pneus e câmaras', 'Pastilhas de freio', 'Filtros e óleos', 'Faróis e lanternas', 'Capacetes e acessórios'],
    cta: 'Ver catálogo',
    href: '/catalogo',
    wp: process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972',
    wpMsg: 'Olá! Quero verificar disponibilidade de peças.',
  },
  {
    emoji: '⚙️',
    title: 'Serralheria',
    color: 'from-gray-700 to-gray-900',
    items: ['Portões automáticos', 'Grades de proteção', 'Escadas e corrimãos', 'Estruturas metálicas', 'Fechamentos', 'Reforma e manutenção'],
    cta: 'Ver portfólio',
    href: '/serralheria',
    wp: process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '5562991444852',
    wpMsg: 'Olá! Gostaria de um orçamento de serralheria.',
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-dark-900">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-14">
          <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-3">
            Nossos serviços
          </span>
          <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Duas empresas, um só endereço
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl 2xl:max-w-3xl mx-auto 2xl:text-lg">
            Peças para qualquer moto e serviços completos de serralheria para sua casa ou empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 2xl:grid-cols-2 gap-8">
          {services.map(s => (
            <div key={s.title} className="card p-8 group hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                {s.emoji}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>

              <ul className="space-y-2 mb-8">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3 flex-wrap">
                <Link href={s.href} className="btn-primary py-2.5 px-5 text-sm">
                  {s.cta}
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href={`https://wa.me/${s.wp}?text=${encodeURIComponent(s.wpMsg)}`}
                  target="_blank"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium hover:underline"
                >
                  💬 Pedir pelo WhatsApp
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
