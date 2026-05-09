import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Security headers (production only — dev needs eval for React Refresh)
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com`,
      `style-src 'self' 'unsafe-inline'`,
      `object-src 'none'`,
      `manifest-src 'self'`,
      `img-src 'self' data: blob: https:`,
      `font-src 'self'`,
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.groq.com`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ].join('; ')

    res.headers.set('Content-Security-Policy', csp)
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '0')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CORS for API routes
  if (isApiRoute(pathname)) {
    const origin = req.headers.get('origin') || ''
    const allowedOrigins = [
      'https://mdmotopecas.com.br',
      'https://www.mdmotopecas.com.br',
    ]
    // Allow Vercel preview deployments
    if (origin.endsWith('.vercel.app')) allowedOrigins.push(origin)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      res.headers.set('Access-Control-Allow-Origin', origin)
    }
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: res.headers })
    }
  }

  // Rate limiting for API routes (extracted to lib/rate-limit.ts)
  if (isApiRoute(pathname)) {
    const ip = getClientIp(req)
    const result = await checkRateLimit(ip)

    if (!result.allowed) {
      return new NextResponse('Too many requests', {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(result.resetIn / 1000)) },
      })
    }
  }

  return res
}

export const config = {
  matcher: [
    { source: '/api/:path*' },
    { source: '/((?!_next/static|_next/image|favicon.ico|images|icons|screenshots|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?)$).*)' },
  ],
}
