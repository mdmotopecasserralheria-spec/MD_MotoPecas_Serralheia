import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { BackToTop } from '@/components/ui/BackToTop'
import { Toaster } from 'react-hot-toast'

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget').then(m => m.ChatWidget), { ssr: false })
const InstallBanner = dynamic(() => import('@/components/InstallBanner'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/CookieConsent').then(m => m.CookieConsent), { ssr: false })

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const cidade = process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F97316',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://mdmotopecas.com.br'),
  title: {
    default: `MD Moto Peças + Serralheria — ${cidade}, GO`,
    template: `%s | MD Moto Peças`,
  },
  description: `Peças para motos e serviços de serralheria em ${cidade}, Goiás. Encontre peças compatíveis com sua moto e solicite orçamentos de serralheria pelo WhatsApp.`,
  keywords: [
    'moto peças', 'serralheria', cidade, 'Goiás',
    'peças para moto', 'portão automático', 'grade de ferro',
    'capacete', 'pneu de moto', 'óleo de moto',
  ],
  authors: [{ name: 'MD Moto Peças' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: `MD Moto Peças — ${cidade}`,
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    article: { tags: ['moto peças', 'Santa Tereza de Goiás', 'serralheria', 'peças para moto', 'Goiás'] },
  } as any,
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://mdmotopecas.com.br' },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/Logo para Perfil.png',
    apple: '/icons/Logo para Perfil.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MD Moto Peças',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MD Moto" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MD Moto Peças" />
        <meta name="msapplication-TileColor" content="#F97316" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-starturl" content="/" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <Script id="ga4-consent" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}
          if (localStorage.getItem('md-moto-cookies-consent') === 'true') {
            gtag('consent', 'default', { 'analytics_storage': 'granted' });
          } else {
            gtag('consent', 'default', { 'analytics_storage': 'denied' });
            window.addEventListener('cookie-consent', () => {
              gtag('consent', 'update', { 'analytics_storage': 'granted' });
            });
          }`}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-D3JPV0KTZY" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-D3JPV0KTZY');`}
        </Script>
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'AutoPartsStore',
                name: 'MD Moto Peças',
                description: `Loja de peças para motos em ${cidade}, Goiás`,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: cidade,
                  addressRegion: 'GO',
                  addressCountry: 'BR',
                  postalCode: '76480-000',
                  streetAddress: 'Av. Bernardo Sayão, 628',
                },
                geo: { '@type': 'GeoCoordinates', latitude: -13.590404, longitude: -48.968508 },
                telephone: process.env.NEXT_PUBLIC_WHATSAPP_PECAS,
                openingHours: 'Mo-Sa 08:00-18:00',
                url: 'https://mdmotopecas.com.br',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'HomeAndConstructionBusiness',
                name: 'MD Serralheria',
                description: `Serralheria em ${cidade}, Goiás — portões, grades, estruturas metálicas`,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: cidade,
                  addressRegion: 'GO',
                  addressCountry: 'BR',
                  postalCode: '76480-000',
                  streetAddress: 'Av. Bernardo Sayão, 628',
                },
                geo: { '@type': 'GeoCoordinates', latitude: -13.590404, longitude: -48.968508 },
                telephone: process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA,
              },
            ]),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg">
          Pular para o conteúdo
        </a>
        <Navbar />
        <main id="main-content" className="pt-16">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <BackToTop />
        <ChatWidget />
        <InstallBanner />
        <CookieConsent />
        <Toaster position="top-right" />

        <Script id="sw-register" strategy="lazyOnload">
          {`if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }); }`}
        </Script>
      </body>
    </html>
  )
}
