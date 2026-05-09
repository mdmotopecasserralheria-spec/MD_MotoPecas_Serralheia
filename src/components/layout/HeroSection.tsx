import Link from 'next/link'
import { ArrowRight, Star, MapPin, Clock, ShieldCheck } from 'lucide-react'

const badges = [
  { icon: Star, text: 'Melhor avaliado da região' },
  { icon: MapPin, text: process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás' },
  { icon: Clock, text: 'Seg–Sáb 8h às 18h' },
  { icon: ShieldCheck, text: 'Garantia em todos serviços' },
]

export function HeroSection() {
  const wp = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-16 md:pb-20 lg:pb-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Orange glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 py-2 md:py-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="animate-fade-in">
          <span className="badge bg-brand-500/20 text-brand-400 mb-4">
            ⚡ Atendimento via WhatsApp
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Peças para sua{' '}
            <span className="gradient-text">moto</span>{' '}
            e serviços de{' '}
            <span className="gradient-text">serralheria</span>
          </h1>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Encontre a peça certa para qualquer moto, solicite orçamentos de serralheria
            e resolva tudo pelo WhatsApp. Atendimento rápido em{' '}
            {process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'}, GO.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href={`https://wa.me/${wp}?text=Olá! Preciso de peças para minha moto.`}
              target="_blank"
              referrerPolicy="no-referrer-when-downgrade"
              className="btn-primary text-base py-4 px-8 justify-center"
            >
              Ver Peças via WhatsApp
              <ArrowRight size={18} />
            </Link>
            <Link href="/serralheria" className="btn-secondary text-base py-4 px-8 justify-center border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-700 hover:text-white">
              Serralheria
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {badges.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-400">
                <Icon size={13} className="text-brand-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Card visual */}
        <div className="relative hidden md:flex justify-center items-center animate-slide-up">
          <div className="relative w-full max-w-md">
            {/* Main card */}
            <div className="card p-6 bg-dark-800/80 border-dark-600 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-2xl">🔧</div>
                <div>
                  <p className="font-semibold text-white">MD Moto Peças</p>
                  <p className="text-xs text-gray-400">Peças, acessórios e capacetes</p>
                </div>
                <span className="ml-auto badge bg-green-500/20 text-green-400">● Aberto</span>
              </div>

              {/* Chat preview */}
              <div className="space-y-3 bg-dark-900/60 rounded-xl p-4">
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">M</div>
                  <div className="chat-bubble-bot text-xs">
                    Olá! Sou a IA da MD Moto Peças. Qual peça você precisa hoje? 🏍️
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="chat-bubble-user text-xs">
                    Preciso de corrente para Honda CB 300
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">M</div>
                  <div className="chat-bubble-bot text-xs">
                    Temos a corrente DID 428 compatível com CB 300! Quer que eu te mande o preço pelo WhatsApp? 🔗
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-brand-500 text-white rounded-2xl px-4 py-2 text-sm font-bold shadow-lg shadow-brand-500/40 rotate-3">
              + Serralheria
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" className="dark:fill-dark-900" />
        </svg>
      </div>
    </section>
  )
}
