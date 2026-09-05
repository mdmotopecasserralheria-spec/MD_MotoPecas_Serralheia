import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

// Secrets lazy: NÃO lançam erro na carga do módulo (isso quebrava o build
// e derrubava todas as rotas que importam este arquivo). O erro só ocorre
// se uma rota realmente precisar assinar/verificar um token sem a variável
// configurada no ambiente.
let _SECRET: Uint8Array | null = null
let _ADMIN_SECRET: Uint8Array | null = null

function getSecret(): Uint8Array {
  if (_SECRET) return _SECRET
  const jwtSecret = process.env.VITRINE_JWT_SECRET
  if (!jwtSecret) throw new Error('VITRINE_JWT_SECRET não configurado no ambiente')
  _SECRET = new TextEncoder().encode(jwtSecret)
  return _SECRET
}

function getAdminSecret(): Uint8Array {
  if (_ADMIN_SECRET) return _ADMIN_SECRET
  const adminJwtSecret = process.env.DASHBOARD_JWT_SECRET
  if (!adminJwtSecret) throw new Error('DASHBOARD_JWT_SECRET não configurado no ambiente')
  _ADMIN_SECRET = new TextEncoder().encode(adminJwtSecret)
  return _ADMIN_SECRET
}

export interface AnuncianteToken {
  id: string
  nome: string
  email: string
}

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10)
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash)
}

export async function gerarToken(anunciante: AnuncianteToken): Promise<string> {
  return new SignJWT({ ...anunciante, tipo: 'anunciante' } as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verificarToken(token: string): Promise<AnuncianteToken | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as AnuncianteToken
  } catch { return null }
}

export async function extrairToken(authHeader: string | null): Promise<AnuncianteToken | null> {
  if (!authHeader?.startsWith('Bearer ')) return null
  return verificarToken(authHeader.slice(7))
}

export async function gerarTokenAdmin(): Promise<string> {
  return new SignJWT({ tipo: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getAdminSecret())
}

export async function isAdmin(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith('Bearer ')) return false
  try {
    const { payload } = await jwtVerify(authHeader.slice(7), getAdminSecret())
    return (payload as any).tipo === 'admin'
  } catch { return false }
}
