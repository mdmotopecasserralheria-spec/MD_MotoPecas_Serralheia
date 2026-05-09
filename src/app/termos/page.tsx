import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do site da MD Moto Peças e Serralheria.',
}

export default function TermosPage() {
  return (
    <main className="section max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Termos de Uso</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
        <p>Ao acessar e utilizar o site da <strong>MD Moto Peças</strong>, você concorda com os termos e condições abaixo.</p>

        <h2 className="text-xl font-bold mt-8">1. Serviços</h2>
        <p>A MD Moto Peças oferece:</p>
        <ul>
          <li>Venda de peças e acessórios para motos</li>
          <li>Serviços de serralheria (portões, grades, estruturas metálicas)</li>
          <li>Plataforma de vitrine para anúncios de terceiros</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">2. Anúncios na Vitrine</h2>
        <p>A vitrine é um espaço para usuários anunciarem peças e serviços. Todo anúncio passa por aprovação do administrador antes de ser publicado. A MD Moto Peças não se responsabiliza pela veracidade das informações dos anúncios de terceiros.</p>

        <h2 className="text-xl font-bold mt-8">3. Obrigações do usuário</h2>
        <ul>
          <li>Fornecer informações verdadeiras ao se cadastrar ou anunciar</li>
          <li>Não publicar conteúdo ofensivo, ilegal ou enganoso</li>
          <li>Não utilizar a plataforma para atividades fraudulentas</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">4. Orçamentos</h2>
        <p>Os orçamentos fornecidos via WhatsApp são validados pela nossa equipe. O prazo e o preço podem variar conforme avaliação técnica presencial.</p>

        <h2 className="text-xl font-bold mt-8">5. Limitação de responsabilidade</h2>
        <p>A MD Moto Peças não se responsabiliza por danos indiretos decorrentes do uso do site, incluindo mas não limitado a lucros cessantes ou interrupção de negócios.</p>

        <h2 className="text-xl font-bold mt-8">6. Alterações</h2>
        <p>Estes termos podem ser alterados a qualquer momento. As alterações serão publicadas nesta página.</p>

        <h2 className="text-xl font-bold mt-8">7. Contato</h2>
        <p>Dúvidas sobre estes termos: <a href="mailto:mdmotopecasserralheria@gmail.com" className="text-blue-600">mdmotopecasserralheria@gmail.com</a></p>

        <p className="text-sm text-gray-500 mt-8">Última atualização: maio de 2026.</p>
      </div>
    </main>
  )
}
