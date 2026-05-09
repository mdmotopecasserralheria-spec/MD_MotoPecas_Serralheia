import { MetadataRoute } from 'next'

const POSTS = [
  { slug: 'cuidados-com-corrente-da-moto', data: '2024-12-15' },
  { slug: 'como-escolher-capacete-ideal', data: '2024-11-20' },
  { slug: 'portao-automatico-vantagens', data: '2024-10-05' },
  { slug: 'oleo-de-moto-troca-correta', data: '2024-09-10' },
  { slug: 'grades-de-ferro-seguranca', data: '2024-08-22' },
  { slug: 'pneus-de-moto-quando-trocar', data: '2024-07-15' },
  { slug: 'fundacao-santa-tereza-goias', data: '2025-05-09' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mdmotopecas.com.br'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/catalogo`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/serralheria`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vitrine`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/vitrine/anunciar`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contato`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogPosts: MetadataRoute.Sitemap = POSTS.map(p => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.data),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPosts]
}
