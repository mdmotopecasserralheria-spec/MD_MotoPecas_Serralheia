import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

function slugToImage(slug: string): string | null {
  const map: Record<string, string> = {
    'cuidados-com-corrente-da-moto': 'Cuidados essenciais com a corrente da sua moto.png',
    'como-escolher-capacete-ideal': 'Como escolher o capacete ideal para sua segurança.png',
    'portao-automatico-vantagens': 'Portão automático vantagens, tipos e cuidados.png',
    'oleo-de-moto-troca-correta': 'Óleo de moto quando trocar e qual usar.png',
    'grades-de-ferro-seguranca': 'Grades de ferro segurança sem perder o estilo.png',
    'pneus-de-moto-quando-trocar': 'Pneus de moto sinais de que está na hora de trocar.png',
    'fundacao-santa-tereza-goias': 'Santa Tereza de Goiãs.png',
  }
  const filename = map[slug]
  return filename ? `/images/${encodeURIComponent(filename)}` : null
}

const POSTS = [
  {
    slug: 'cuidados-com-corrente-da-moto',
    titulo: 'Cuidados essenciais com a corrente da sua moto',
    resumo: 'Saiba como aumentar a vida útil da corrente e relação da sua moto com dicas simples de limpeza e lubrificação.',
    conteudo: `
      <p>A corrente de transmissão é um dos componentes mais importantes da sua moto. Ela é responsável por transferir a força do motor para a roda traseira, e quando mal cuidada, pode comprometer a segurança e o desempenho.</p>
      <h2>Lubrificação regular</h2>
      <p>O passo mais básico e importante é lubrificar a corrente regularmente. Recomenda-se a cada 500 km ou após pegar chuva. Use lubrificante específico para correntes de moto — nunca use óleo queimado ou graxa comum.</p>
      <h2>Limpeza</h2>
      <p>Antes de lubrificar, limpe a corrente com um pano seco e, se necessário, use desengraxante próprio. Evite lavar com jato d'água forte, pois a água pode infiltrar nos elos e remover a graxa interna.</p>
      <h2>Verificação da folga</h2>
      <p>A corrente deve ter uma folga de 2 a 4 cm no meio do trecho entre a coroa e o pinhão. Folga excessiva pode fazer a corrente pular dentes, enquanto folga insuficiente danifica rolamentos e caixa de câmbio.</p>
      <h2>Quando trocar?</h2>
      <p>Corrente, coroa e pinhão formam um conjunto. Se um deles está gasto, troque todos. Sinais de desgaste: dentes da coroa em formato de "gancho", corrente esticada irregularmente ou ruídos metálicos durante a rodagem.</p>
      <p>Na <strong>MD Moto Peças</strong> você encontra kits de corrente e relação para todas as motos populares. Consulte nossos preços pelo WhatsApp!</p>
    `,
    categoria: 'Manutenção',
    tags: ['corrente', 'relação', 'manutenção', 'transmissão'],
    data: '2024-12-15',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'como-escolher-capacete-ideal',
    titulo: 'Como escolher o capacete ideal para sua segurança',
    resumo: 'Guia completo para escolher o capacete certo: tipos, certificações, tamanhos e dicas de compra.',
    conteudo: `
      <p>O capacete é o item de segurança mais importante para quem anda de moto. Escolher o modelo certo pode fazer a diferença entre a vida e a morte em um acidente.</p>
      <h2>Tipos de capacete</h2>
      <p><strong>Integral:</strong> Oferece a maior proteção, cobrindo toda a cabeça e o queixo. Ideal para uso diário e viagens.</p>
      <p><strong>Aberto:</strong> Mais leve e arejado, mas não protege o queixo. Recomendado para trajetos urbanos curtos.</p>
      <p><strong>Modular:</strong> Combina o melhor dos dois mundos — pode ser usado aberto ou fechado. Verifique se tem selo de aprovação do INMETRO.</p>
      <h2>Certificação</h2>
      <p>No Brasil, todo capacete deve ter o selo do INMETRO. Capacetes importados podem ter certificações DOT (EUA) ou ECE (Europa). Sempre prefira capacetes certificados.</p>
      <h2>Tamanho correto</h2>
      <p>O capacete deve ficar justo, sem apertar. Meça a circunferência da cabeça acima das sobrancelhas. Experimente antes de comprar — ele não deve balançar quando você move a cabeça.</p>
      <p>Na <strong>MD Moto Peças</strong>, temos capacetes das melhores marcas com preços especiais. Visite nossa loja em Santa Tereza de Goiás!</p>
    `,
    categoria: 'Segurança',
    tags: ['capacete', 'segurança', 'acessórios', 'equipamentos'],
    data: '2024-11-20',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'portao-automatico-vantagens',
    titulo: 'Portão automático: vantagens, tipos e cuidados',
    resumo: 'Descubra as vantagens de instalar um portão automático e como escolher o modelo ideal para sua casa ou empresa.',
    conteudo: `
      <p>O portão automático deixou de ser artigo de luxo e se tornou uma solução acessível para residências e comércios em Santa Tereza de Goiás.</p>
      <h2>Vantagens</h2>
      <p><strong>Conforto:</strong> Abra e feche o portão sem sair do carro, especialmente em dias de chuva.</p>
      <p><strong>Segurança:</strong> Sistemas modernos têm trava eletrônica e sensor de obstáculo, impedindo fechamento sobre pessoas ou veículos.</p>
      <p><strong>Valorização do imóvel:</strong> Um portão automático bem instalado valoriza sua propriedade.</p>
      <h2>Tipos de automação</h2>
      <p><strong>Deslizante:</strong> Ideal para portões de correr. O motor é compacto e silencioso.</p>
      <p><strong>Pivotante:</strong> Para portões de abrir. Pode ser de braço articulado ou embutido no pilar.</p>
      <p><strong>Basculante:</strong> Comum em garagens de residências.</p>
      <h2>Manutenção</h2>
      <p>Lubrifique os trilhos e roldanas a cada 3 meses. Mantenho o motor protegido da chuva e verifique as fotocélulas periodicamente.</p>
      <p>A <strong>MD Serralheria</strong> instala e faz manutenção de portões automáticos em Santa Tereza de Goiás e região. Solicite seu orçamento!</p>
    `,
    categoria: 'Serralheria',
    tags: ['portão automático', 'serralheria', 'portões', 'automação'],
    data: '2024-10-05',
    autor: 'MD Serralheria',
  },
  {
    slug: 'oleo-de-moto-troca-correta',
    titulo: 'Óleo de moto: quando trocar e qual usar?',
    resumo: 'Tudo sobre lubrificação do motor: tipos de óleo, intervalos de troca e como escolher o melhor para sua moto.',
    conteudo: `
      <p>O óleo do motor é o sangue da sua moto. Uma troca feita no prazo certo aumenta a vida útil do motor e evita reparos caros.</p>
      <h2>Tipos de óleo</h2>
      <p><strong>Mineral:</strong> Mais barato, indicado para motos de baixa cilindrada e uso moderado. Troca a cada 1.500 km.</p>
      <p><strong>Semi-sintético:</strong> Equilíbrio entre custo e desempenho. Troca a cada 3.000 km.</p>
      <p><strong>Sintético:</strong> Maior proteção e durabilidade. Ideal para motos esportivas e de alta cilindrada. Troca a cada 5.000 km.</p>
      <h2>Viscosidade</h2>
      <p>Escolha a viscosidade recomendada pelo fabricante da sua moto (ex: 10W40, 20W50). Usar a viscosidade errada pode reduzir a lubrificação e danificar o motor.</p>
      <h2>Sinais de que precisa trocar</h2>
      <p>Nível baixo no visor, cor escura (borra de óleo), cheiro de queimado ou motor mais barulhento que o normal.</p>
      <p>Na <strong>MD Moto Peças</strong> você encontra óleos das melhores marcas com preço justo. Passa lá na Av. Bernardo Sayão, 628!</p>
    `,
    categoria: 'Manutenção',
    tags: ['óleo', 'motor', 'lubrificação', 'manutenção'],
    data: '2024-09-10',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'grades-de-ferro-seguranca',
    titulo: 'Grades de ferro: segurança sem perder o estilo',
    resumo: 'Modelos de grades de ferro para janelas e portas que aliam segurança, durabilidade e design.',
    conteudo: `
      <p>A grade de ferro continua sendo a solução mais popular para segurança de residências e comércios em Goiás. Mas hoje em dia, segurança não precisa abrir mão do estilo.</p>
      <h2>Modelos populares</h2>
      <p><strong>Grade reta:</strong> Clássica e discreta. Ideal para quem busca segurança sem chamar atenção.</p>
      <p><strong>Grade decorativa:</strong> Com curvas e desenhos artesanais, agrega valor estético à fachada.</p>
      <p><strong>Grade tubular:</strong> Leve e moderna, feita com tubos de aço. Ótima para sacadas e varandas.</p>
      <h2>Tratamento anticorrosivo</h2>
      <p>O ferro precisa de proteção contra ferrugem. Toda grade da MD Serralheria recebe tratamento anticorrosivo e pintura eletrostática de alta durabilidade.</p>
      <h2>Orçamento gratuito</h2>
      <p>Solicite um orçamento sem compromisso. Medimos e instalamos em Santa Tereza de Goiás e região.</p>
    `,
    categoria: 'Serralheria',
    tags: ['grade de ferro', 'segurança', 'serralheria', 'janelas'],
    data: '2024-08-22',
    autor: 'MD Serralheria',
  },
  {
    slug: 'pneus-de-moto-quando-trocar',
    titulo: 'Pneus de moto: sinais de que está na hora de trocar',
    resumo: 'Aprenda a identificar o desgaste dos pneus da sua moto e saiba quando é o momento certo para substituí-los.',
    conteudo: `
      <p>Os pneus são o único ponto de contato da moto com o chão. Pneus gastos ou danificados são uma das principais causas de acidentes.</p>
      <h2>Profundidade dos sulcos</h2>
      <p>O limite legal é de 1,6 mm, mas o ideal é trocar quando atingir 2 mm. Use um medidor de profundidade ou veja os indicadores TWI (pequenas saliências entre os sulcos).</p>
      <h2>Idade do pneu</h2>
      <p>Mesmo com boa profundidade, pneus com mais de 5 anos devem ser substituídos. A borracha resseca e perde aderência. Verifique a data de fabricação no código DOT.</p>
      <h2>Sinais visíveis</h2>
      <p>Trincas na borracha, bolhas nas laterais, desgaste irregular (pode indicar problemas de suspensão ou calibragem) ou remendos mal feitos.</p>
      <h2>Calibragem correta</h2>
      <p>Calibre os pneus semanalmente. Pneu murcho reduz a vida útil e aumenta o consumo. Pneu muito cheio reduz a aderência.</p>
      <p>Na <strong>MD Moto Peças</strong> trabalhamos com pneus originais e substituição com montagem gratuita. Consulte-nos!</p>
    `,
    categoria: 'Segurança',
    tags: ['pneus', 'segurança', 'manutenção', 'pneu de moto'],
    data: '2024-07-15',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'fundacao-santa-tereza-goias',
    titulo: 'História de Santa Tereza de Goiás: da fundação aos dias atuais',
    resumo: 'Conheça a história da fundação de Santa Tereza de Goiás, desde o povoado Entroncamento de Formoso até se tornar município em 1963.',
    conteudo: `
      <p>Santa Tereza de Goiás é um município do norte goiano com uma história rica que remonta ao período da construção da rodovia Belém-Brasília. Sua origem está diretamente ligada à marcha para o oeste e à ocupação das terras devolutas da região.</p>

      <h2>Os primeiros povoadores</h2>
      <p>A região onde hoje está Santa Tereza de Goiás pertenceu ao antigo município de Uruaçu, que teve seu povoamento a partir da segunda metade do século XVIII, impulsionado pela mineração. Com a decadência do ouro, a região passou à agricultura de subsistência e à pecuária extensiva.</p>
      <p>No ano de 1948, com a emancipação do Arraial do Descoberto (atual Porangatu), a área que viria a ser Santa Tereza foi incorporada a Porangatu. As famílias viviam em fazendas, cultivando arroz, feijão, milho e criando gado leiteiro. A economia era de subsistência, e o comércio era feito na cidade de Corumbá.</p>

      <h2>O Entroncamento de Formoso</h2>
      <p>O povoamento da atual cidade teve início com a construção da rodovia Belém-Brasília (BR-153), obra do engenheiro Bernardo Sayão. No local conhecido como <strong>"Entroncamento de Formoso"</strong>, começaram a surgir ranchos ao longo da pista, construídos por migrantes que deixavam as cidades de Trombas e Formoso em busca de novas oportunidades.</p>
      <p>A primeira casa foi a de <strong>D. Júlia Rodrigues de Moura</strong>, que montou uma pensão para atender os viajantes. A fertilidade das terras atraiu cada vez mais pessoas, e logo surgiram as primeiras casas comerciais.</p>

      <h2>Belarmino Cruvinel — o pioneiro</h2>
      <p>Figura central na fundação da cidade, <strong>Belarmino Cruvinel</strong> foi um político de Goiânia que possuía terras na região. Descendente de tradicional família mineira, ele nasceu com espírito de bandeirante e foi atraído pelo desafio de desenvolver o norte de Goiás.</p>
      <p>Em 1955, Belarmino Cruvinel implantou uma serralheria movida a vapor que gerou empregos para os moradores. No mesmo ano, montou uma farmácia para atender a população, administrada pelo farmacêutico conhecido como Durães. Também fundou um armazém, que depois foi vendido aos senhores José da Silva e Nefthali Canêdo.</p>

      <h2>Elevação a Distrito</h2>
      <p>A comunidade foi se organizando e surgiu a vontade de elevação do povoado à condição de Distrito. No dia <strong>22 de fevereiro de 1957</strong>, pela Lei Municipal nº 52 de Porangatu, o povoado de Entroncamento de Formoso foi elevado a Distrito com a denominação de <strong>Santa Tereza</strong>.</p>

      <h2>Emancipação política</h2>
      <p>O grande marco veio em <strong>13 de novembro de 1963</strong>, quando foi aprovada a <strong>Lei Estadual nº 4.896</strong>, sancionada pelo então Governador <strong>Mauro Borges Teixeira</strong>, criando o município de Santa Tereza. O município foi instalado em <strong>1º de janeiro de 1964</strong>, tendo como primeiro prefeito o Sr. <strong>Geraldo Severino Neto</strong>, nomeado pelo governo estadual.</p>

      <h2>Origem do nome</h2>
      <p>O nome Santa Tereza forma uma tríade especial: é o nome do <strong>Rio Santa Tereza</strong> (afluente do Rio Tocantins), do <strong>município</strong> e da <strong>Santa Padroeira</strong>, protetora dos professores. Como diz o dito popular local: <em>"Terra, Rio e Padroeira… três vezes Santa Tereza do Norte Goiano!"</em></p>

      <h2>A cidade hoje</h2>
      <p>Atualmente, Santa Tereza de Goiás possui cerca de 3.700 habitantes e uma área de aproximadamente 798 km². Está localizada a 370 km de Goiânia, às margens da BR-153, fazendo divisa com Porangatu, Trombas, Estrela do Norte, Formoso e Mutunópolis. O gentílico dos nascidos na cidade é <strong>santerezense</strong>.</p>
      <p>A cidade mantém vivas suas tradições culturais como a Folia de Reis, o Arraiá de São João Batista, a Festa do Peão e o Projeto Raízes Folclóricas, que fortalecem a identidade do povo santerezense.</p>
      <p>A <strong>MD Moto Peças e Serralheria</strong> tem orgulho de fazer parte da história de Santa Tereza de Goiás, oferecendo peças para motos e serviços de serralheria para a comunidade há anos. Venha nos visitar na Av. Bernardo Sayão, 628!</p>
    `,
    categoria: 'História',
    tags: ['Santa Tereza de Goiás', 'fundação', 'história', 'Goiás', 'Belarmino Cruvinel'],
    data: '2025-05-09',
    autor: 'MD Moto Peças',
  },
]

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) return {}

  const imageUrl = slugToImage(post.slug) || '/images/og-image.jpg'

  return {
    title: `${post.titulo} — Blog MD Moto Peças`,
    description: post.resumo,
    keywords: post.tags,
    openGraph: {
      title: post.titulo,
      description: post.resumo,
      type: 'article',
      locale: 'pt_BR',
      publishedTime: post.data + 'T12:00:00Z',
      authors: [post.autor],
      tags: post.tags,
      images: [{ url: imageUrl, width: 1200, height: 675 }],
    },
  }
}

export default function PostPage({ params }: Props) {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const imageUrl = slugToImage(post.slug)
  const outrosPosts = POSTS.filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      {/* Hero com imagem de capa */}
      <section className="relative bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent z-10" />
        {imageUrl && (
          <div className="absolute inset-0">
            <Image src={imageUrl} alt={post.titulo} fill className="object-cover opacity-60" sizes="100vw" priority />
          </div>
        )}
        <div className="relative z-20 max-w-4xl mx-auto px-4 pt-32 pb-16">
          <Link href="/blog" className="text-blue-300 hover:text-white transition-colors text-sm mb-6 inline-block">&larr; Voltar ao blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
              {post.categoria}
            </span>
            <time className="text-xs text-gray-400">{new Date(post.data + 'T12:00:00').toLocaleDateString('pt-BR')}</time>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.titulo}</h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">{post.resumo}</p>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
            <span>Por <strong className="text-white">{post.autor}</strong></span>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo do artigo */}
      <section className="bg-white dark:bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
            {/* Artigo */}
            <article>
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4
                  prose-h2:text-2xl
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-5
                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-img:rounded-xl prose-img:my-0
                  prose-li:text-gray-700 dark:prose-li:text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.conteudo }}
              />

              {/* Tags no final */}
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-dark-600">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA pós-artigo */}
              <div className="mt-10 p-8 rounded-2xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ficou com dúvidas?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Entre em contato conosco pelo WhatsApp!</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'}?text=${encodeURIComponent('Olá! Vi o post "' + post.titulo + '" e gostaria de mais informações.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>
                  Fale conosco no WhatsApp
                </a>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Leia também</h3>
                <div className="space-y-4">
                  {outrosPosts.map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2 bg-gray-100 dark:bg-dark-700">
                        {slugToImage(p.slug) && (
                          <Image
                            src={slugToImage(p.slug)!}
                            alt={p.titulo}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="280px"
                          />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{p.categoria}</span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors mt-1 leading-snug">{p.titulo}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
