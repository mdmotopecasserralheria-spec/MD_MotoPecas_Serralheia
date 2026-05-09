import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const HeroCarousel = dynamic(() => import('@/components/HeroCarousel'), { ssr: false })

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog — MD Moto Peças e Serralheria',
  description: 'Dicas e informações sobre peças de moto, serralheria e manutenção em Santa Tereza de Goiás, GO.',
  openGraph: {
    title: 'Blog — MD Moto Peças e Serralheria',
    description: 'Dicas e informações sobre peças de moto, serralheria e manutenção em Santa Tereza de Goiás, GO.',
    type: 'website',
    locale: 'pt_BR',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

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
    categoria: 'Manutenção',
    tags: ['corrente', 'relação', 'manutenção', 'transmissão'],
    data: '2024-12-15',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'como-escolher-capacete-ideal',
    titulo: 'Como escolher o capacete ideal para sua segurança',
    resumo: 'Guia completo para escolher o capacete certo: tipos, certificações, tamanhos e dicas de compra.',
    categoria: 'Segurança',
    tags: ['capacete', 'segurança', 'acessórios', 'equipamentos'],
    data: '2024-11-20',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'portao-automatico-vantagens',
    titulo: 'Portão automático: vantagens, tipos e cuidados',
    resumo: 'Descubra as vantagens de instalar um portão automático e como escolher o modelo ideal para sua casa ou empresa.',
    categoria: 'Serralheria',
    tags: ['portão automático', 'serralheria', 'portões', 'automação'],
    data: '2024-10-05',
    autor: 'MD Serralheria',
  },
  {
    slug: 'oleo-de-moto-troca-correta',
    titulo: 'Óleo de moto: quando trocar e qual usar?',
    resumo: 'Tudo sobre lubrificação do motor: tipos de óleo, intervalos de troca e como escolher o melhor para sua moto.',
    categoria: 'Manutenção',
    tags: ['óleo', 'motor', 'lubrificação', 'manutenção'],
    data: '2024-09-10',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'grades-de-ferro-seguranca',
    titulo: 'Grades de ferro: segurança sem perder o estilo',
    resumo: 'Modelos de grades de ferro para janelas e portas que aliam segurança, durabilidade e design.',
    categoria: 'Serralheria',
    tags: ['grade de ferro', 'segurança', 'serralheria', 'janelas'],
    data: '2024-08-22',
    autor: 'MD Serralheria',
  },
  {
    slug: 'pneus-de-moto-quando-trocar',
    titulo: 'Pneus de moto: sinais de que está na hora de trocar',
    resumo: 'Aprenda a identificar o desgaste dos pneus da sua moto e saiba quando é o momento certo para substituí-los.',
    categoria: 'Segurança',
    tags: ['pneus', 'segurança', 'manutenção', 'pneu de moto'],
    data: '2024-07-15',
    autor: 'MD Moto Peças',
  },
  {
    slug: 'fundacao-santa-tereza-goias',
    titulo: 'História de Santa Tereza de Goiás: da fundação aos dias atuais',
    resumo: 'Conheça a história da fundação de Santa Tereza de Goiás, desde o povoado Entroncamento de Formoso até se tornar município em 1963.',
    categoria: 'História',
    tags: ['Santa Tereza de Goiás', 'fundação', 'história', 'Goiás', 'Belarmino Cruvinel'],
    data: '2025-05-09',
    autor: 'MD Moto Peças',
  },
]

const ALL_TAGS = Array.from(new Set(POSTS.flatMap(p => p.tags))).sort()

const CATEGORY_COLORS: Record<string, { badge: string; hover: string }> = {
  Manutenção: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', hover: 'hover:border-blue-500/30' },
  Segurança: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', hover: 'hover:border-emerald-500/30' },
  Serralheria: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', hover: 'hover:border-amber-500/30' },
  História: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', hover: 'hover:border-purple-500/30' },
}

function formatDate(data: string) {
  return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function MagazineCard({ post, featured = false }: { post: typeof POSTS[number]; featured?: boolean }) {
  const img = slugToImage(post.slug)
  const cat = CATEGORY_COLORS[post.categoria] || CATEGORY_COLORS.Manutenção

  return (
    <Link href={`/blog/${post.slug}`} className={`group block rounded-2xl overflow-hidden bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 ${cat.hover} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30`}>
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-dark-700 overflow-hidden">
        {img && (
          <Image src={img} alt={post.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.badge} backdrop-blur-sm`}>
            {post.categoria}
          </span>
        </div>
      </div>
      <div className="p-5">
        <time className="text-xs text-gray-400">{formatDate(post.data)}</time>
        <h3 className={`font-bold text-gray-900 dark:text-white mt-1 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${featured ? 'text-xl' : 'text-base'}`}>
          {post.titulo}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{post.resumo}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-dark-600">
          <span className="text-xs text-gray-400">{post.autor}</span>
          <div className="flex gap-1.5">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-gray-400">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

function BlogContent({ searchParams }: { searchParams: { tag?: string } }) {
  const tagFiltro = searchParams.tag
  const filtrados = tagFiltro
    ? POSTS.filter(p => p.tags.some(t => t.toLowerCase() === tagFiltro.toLowerCase()))
    : POSTS

  if (filtrados.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-400">Nenhum post encontrado para esta tag.</p>
        <Link href="/blog" className="text-blue-500 hover:underline text-sm mt-2 inline-block">Ver todos os posts</Link>
      </div>
    )
  }

  const outros = tagFiltro ? filtrados : filtrados.slice(1)

  return (
    <div className="space-y-10">
      {!tagFiltro && <HeroCarousel posts={filtrados} />}

      {tagFiltro && (
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
          <span>Filtrando por: <strong className="text-brand-600 dark:text-brand-400">#{tagFiltro}</strong></span>
          <Link href="/blog" className="text-xs text-blue-500 hover:underline ml-2">Limpar filtro</Link>
        </div>
      )}

      {outros.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {outros.map((post, i) => (
            <MagazineCard key={post.slug} post={post} featured={i === 0 && !tagFiltro} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function BlogPage({ searchParams }: { searchParams: { tag?: string } }) {
  const tagFiltro = searchParams.tag

  return (
    <>
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(249,115,22,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(37,99,235,0.1) 0%, transparent 50%)'
        }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Revista Digital
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Nosso <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Dicas, guias e informações sobre peças de moto, serralheria e manutenção em Santa Tereza de Goiás.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        {!tagFiltro && (
          <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-gray-200 dark:border-dark-600">
            <Link href="/blog"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-brand-500 text-white transition-colors">
              Todas
            </Link>
            {ALL_TAGS.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 dark:hover:text-brand-400 transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        )}

        <Suspense fallback={<div className="text-center py-12 text-gray-400">Carregando...</div>}>
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  )
}
