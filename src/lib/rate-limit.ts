interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

// ATENÇÃO: Store em memória NÃO funciona no Vercel (várias instâncias serverless).
// Migrar para Vercel KV (Redis) ou Upstash em produção:
// import { Ratelimit } from '@upstash/ratelimit'
// import { Redis } from '@upstash/redis'
// export const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(30, '10s') })
const store = new Map<string, RateLimitEntry>()

const DEFAULT_MAX = 30
const DEFAULT_WINDOW = 10_000

function getMilliseconds(): number {
  return Date.now()
}

export async function checkRateLimit(
  key: string,
  max: number = DEFAULT_MAX,
  windowMs: number = DEFAULT_WINDOW
): Promise<RateLimitResult> {
  const now = getMilliseconds()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1, resetIn: windowMs }
  }

  entry.count++

  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  return { allowed: true, remaining: max - entry.count, resetIn: entry.resetAt - now }
}

export function resetRateLimit(key: string): void {
  store.delete(key)
}

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1'
}
