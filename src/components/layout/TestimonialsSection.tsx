import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Roberto S.', role: 'Cliente há 3 anos', text: 'Achei a corrente da minha CB 300 na hora. Atendimento rápido e preço justo!', stars: 5 },
  { name: 'Ana Paula M.', role: 'Residência', text: 'O portão automático ficou perfeito. Serralheria de qualidade, equipe muito educada.', stars: 5 },
  { name: 'Carlos D.', role: 'Motoboy', text: 'Sempre resolvo tudo aqui. Peças originais e compatíveis para todos os tipos de moto.', stars: 5 },
  { name: 'Mariana L.', role: 'Comerciante', text: 'As grades da minha loja ficaram ótimas! Preço bom e entrega no prazo.', stars: 5 },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="badge bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 mb-3">
            ⭐ Avaliações
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
