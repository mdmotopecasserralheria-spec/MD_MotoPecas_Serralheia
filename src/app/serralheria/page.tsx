import type { Metadata } from 'next'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serralheria — Portões, Grades e Estruturas Metálicas',
  description: 'Serralheria profissional em Goiás. Portões automáticos, grades de proteção, escadas, corrimãos e estruturas metálicas. Orçamento gratuito.',
  openGraph: {
    title: 'Serralheria — Portões, Grades e Estruturas Metálicas | MD Moto Peças',
    description: 'Serralheria profissional em Goiás. Portões automáticos, grades de proteção, escadas, corrimãos e estruturas metálicas. Orçamento gratuito.',
    url: 'https://mdmotopecas.com.br/serralheria',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

const servicos = [
  { emoji: '🚪', nome: 'Portões Automáticos', desc: 'Portões deslizantes e basculantes com automação, motor e controle remoto inclusos.' },
  { emoji: '🛡️', nome: 'Grades de Proteção', desc: 'Grades para janelas, portas e muros. Segurança com design personalizado.' },
  { emoji: '🪜', nome: 'Escadas e Corrimãos', desc: 'Escadas internas e externas, corrimãos em ferro e inox com acabamento profissional.' },
  { emoji: '🏗️', nome: 'Estruturas Metálicas', desc: 'Mezaninos, coberturas, pergolados e estruturas para construção civil.' },
  { emoji: '🔒', nome: 'Fechamentos e Cercas', desc: 'Cercas, muros de arrimo, gradil e soluções completas de fechamento de terrenos.' },
  { emoji: '🔧', nome: 'Manutenção e Reforma', desc: 'Recuperação, pintura anticorrosiva e manutenção de estruturas metálicas existentes.' },
]

const diferenciais = [
  'Orçamento gratuito e sem compromisso',
  'Medição no local incluída',
  'Materiais de primeira qualidade',
  'Garantia em todos os serviços',
  'Prazo de entrega cumprido',
  'Pintura anticorrosiva padrão',
]

const wp = process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '5562992458972'

export default function SerralheriaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #888 0, #888 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge bg-gray-700 text-gray-300 mb-4">⚙️ Serralheria Profissional</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Estruturas metálicas com qualidade e <span className="gradient-text">garantia</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Portões, grades, escadas e estruturas metálicas sob medida para sua residência ou empresa em {process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Goiás'}.
            </p>
            <a
              href={`https://wa.me/${wp}?text=Olá! Gostaria de um orçamento de serralheria. Pode me ajudar?`}
              target="_blank"
              referrerPolicy="no-referrer-when-downgrade"
              className="btn-primary text-base py-4 px-8 inline-flex"
            >
              💬 Solicitar orçamento gratuito
              <ArrowRight size={18} />
            </a>
            <p className="mt-3 text-xs text-gray-400">Envie fotos do local pelo WhatsApp para agilizar o orçamento!</p>
          </div>

          {/* Diferenciais */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 text-lg">Por que escolher a MD Serralheria?</h3>
            <ul className="space-y-3">
              {diferenciais.map(d => (
                <li key={d} className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle size={16} className="text-brand-500 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Nossos serviços</h2>
          <p className="text-gray-500 dark:text-gray-400">Trabalhamos com ferro, inox e alumínio, tudo sob medida.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {servicos.map(s => (
            <div key={s.nome} className="card p-6 hover:border-brand-200 dark:hover:border-brand-800 transition-all group">
              <div className="text-4xl mb-4">{s.emoji}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.nome}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{s.desc}</p>
              <a
                href={`https://wa.me/${wp}?text=Olá! Preciso de ${s.nome}. Pode me fazer um orçamento?`}
                target="_blank"
                referrerPolicy="no-referrer-when-downgrade"
                className="text-sm text-brand-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Pedir orçamento <ArrowRight size={13} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Pronto para começar seu projeto?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Mande uma foto do local pelo WhatsApp e receba seu orçamento em até 24h!
          </p>
          <a
            href={`https://wa.me/${wp}?text=Olá! Quero fazer um orçamento de serralheria. Segue a foto do local:`}
            target="_blank"
            referrerPolicy="no-referrer-when-downgrade"
            className="btn-primary inline-flex text-base py-4 px-10"
          >
            📸 Enviar foto e pedir orçamento
          </a>
        </div>
      </section>
    </>
  )
}
