import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da MD Moto Peças. Saiba como tratamos seus dados pessoais.',
}

export default function PrivacidadePage() {
  return (
    <main className="section max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Política de Privacidade</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
        <p>A sua privacidade é importante para a <strong>MD Moto Peças</strong>. Esta política explica como coletamos, usamos e protegemos suas informações.</p>

        <h2 className="text-xl font-bold mt-8">1. Dados coletados</h2>
        <p>Coletamos as seguintes informações quando você utiliza nosso site:</p>
        <ul>
          <li>Nome, e-mail e telefone (quando você preenche formulários de contato ou cadastro)</li>
          <li>Dados de navegação como páginas visitadas e tempo de sessão (via Google Analytics)</li>
          <li>Informações do dispositivo e navegador para fins de segurança e performance</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">2. Uso dos dados</h2>
        <p>Utilizamos seus dados para:</p>
        <ul>
          <li>Responder a seus contatos e solicitações de orçamento</li>
          <li>Processar e gerenciar seus anúncios na vitrine</li>
          <li>Melhorar nossos serviços e a experiência do usuário</li>
          <li>Enviar comunicações relacionadas aos serviços solicitados</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">3. Compartilhamento</h2>
        <p>Não compartilhamos seus dados pessoais com terceiros, exceto:</p>
        <ul>
          <li>Quando necessário para cumprir obrigações legais</li>
          <li>Com provedores de serviço que nos auxiliam na operação do site (Google Analytics, Supabase)</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">4. Cookies</h2>
        <p>Utilizamos cookies para melhorar a navegação e analisar o tráfego do site. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.</p>

        <h2 className="text-xl font-bold mt-8">5. Seus direitos</h2>
        <p>Nos termos da LGPD, você tem direito a:</p>
        <ul>
          <li>Solicitar acesso, correção ou exclusão de seus dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
          <li>Solicitar a portabilidade dos dados</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">6. Contato</h2>
        <p>Para exercer seus direitos ou esclarecer dúvidas, entre em contato pelo e-mail: <a href="mailto:mdmotopecasserralheria@gmail.com" className="text-blue-600">mdmotopecasserralheria@gmail.com</a></p>

        <p className="text-sm text-gray-500 mt-8">Última atualização: maio de 2026.</p>
      </div>
    </main>
  )
}
