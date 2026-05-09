import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/cliente/', '/vitrine/login/', '/vitrine/admin/'],
      },
    ],
    sitemap: 'https://mdmotopecas.com.br/sitemap.xml',
  }
}
