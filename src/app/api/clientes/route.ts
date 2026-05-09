import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { gerarToken, hashSenha, isAdmin } from '@/lib/auth-vitrine'
import { sendEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req.headers.get('Authorization')))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const sb = createServerClient()
    const { data: clientes, error } = await sb.from('clientes').select('id, nome, email, telefone, criado_em').order('criado_em', { ascending: false })
    if (error) {
      console.error('[GET /api/clientes] erro:', error.message)
      return NextResponse.json({ error: 'Erro ao listar clientes' }, { status: 500 })
    }
    return NextResponse.json({ clientes })
  } catch (err) {
    console.error('[CLIENTES GET]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  let body: Record<string, any>
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const sb = createServerClient()

  if (action === 'cadastro') {
    const { nome, email, senha, telefone } = body
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
    }
    if (senha.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter ao menos 6 caracteres' }, { status: 400 })
    }

    const emailLower = email.toLowerCase()

    // Verificar se email já existe
    const { data: existe, error: selectErr } = await sb.from('clientes').select('id').eq('email', emailLower).maybeSingle()
    if (selectErr) console.error('[SELECT] verificação de email falhou:', selectErr.message)
    if (existe?.id) return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })

    // RPC cadastrar_cliente (SECURITY DEFINER + pgcrypt)
    // PostgREST + supabase-js retorna a UUID como string DIRETA (não array)
    const { data: id, error: rpcError } = await sb.rpc('cadastrar_cliente', {
      p_nome: nome, p_email: emailLower, p_senha: senha, p_telefone: telefone || null,
    })

    if (!rpcError && typeof id === 'string') {
      const token = await gerarToken({ id, nome, email: emailLower })
      return NextResponse.json({ token, cliente: { id, nome, email: emailLower } }, { status: 201 })
    }

    if (rpcError) {
      console.error('[RPC] cadastrar_cliente falhou:', rpcError.message)
      if (rpcError.message?.includes('duplicate key') || rpcError.message?.includes('unique constraint')) {
        return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
      }
    }

    // Fallback: RPC inserir_cliente (SECURITY DEFINER, Node hash)
    // PostgREST + supabase-js retorna o JSONB como objeto DIRETO (não array)
    const senhaHash = await hashSenha(senha)
    const { data: cliente, error: err } = await sb.rpc('inserir_cliente', {
      p_nome: nome, p_email: emailLower, p_senha_hash: senhaHash, p_telefone: telefone || null,
    })

    if (err || !cliente?.id) {
      console.error('[RPC] inserir_cliente falhou:', err?.message || 'sem dados')
      return NextResponse.json({ error: 'Erro ao cadastrar: ' + (err?.message || 'sem resposta') }, { status: 500 })
    }

    const token = await gerarToken({ id: cliente.id, nome: cliente.nome, email: cliente.email })
    return NextResponse.json({ token, cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email } }, { status: 201 })
  }

  if (action === 'solicitar-recuperacao') {
    const { email } = body
    if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 })

    const emailLower = email.toLowerCase()
    const { data: token, error: rpcError } = await sb.rpc('solicitar_recuperacao', { p_email: emailLower })

    if (rpcError) {
      console.error('[RPC] solicitar_recuperacao falhou:', rpcError.message)
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }

    if (!token) {
      return NextResponse.json({ message: 'Se o email existir, você receberá um link de recuperação.' })
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const resetLink = `${origin}/vitrine/redefinir-senha?token=${token}`

    try {
      await sendEmail({
        to: emailLower,
        subject: 'Recuperação de Senha — MD Moto Peças',
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1a3a8f">Recuperação de Senha</h2>
          <p>Clique no link abaixo para redefinir sua senha. O link expira em 1 hora.</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#FFD700;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0">
            Redefinir Senha
          </a>
          <p style="color:#666;font-size:14px">Se você não solicitou esta recuperação, ignore este email.</p>
        </div>`,
      })
    } catch (err) {
      console.error('[EMAIL] falha ao enviar para', emailLower, ':', err)
      return NextResponse.json({
        message: 'Link de recuperação enviado para seu email.',
        resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
      })
    }

    return NextResponse.json({ message: 'Link de recuperação enviado para seu email.' })
  }

  if (action === 'redefinir-senha') {
    const { token, senha } = body
    if (!token || !senha) return NextResponse.json({ error: 'Token e nova senha obrigatórios' }, { status: 400 })
    if (senha.length < 6) return NextResponse.json({ error: 'Senha deve ter ao menos 6 caracteres' }, { status: 400 })

    const { data: ok, error: rpcError } = await sb.rpc('redefinir_senha', { p_token: token, p_nova_senha: senha })

    if (rpcError) {
      console.error('[RPC] redefinir_senha falhou:', rpcError.message)
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }

    if (!ok) {
      return NextResponse.json({ error: 'Link inválido ou expirado. Solicite uma nova recuperação.' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Senha redefinida com sucesso!' })
  }

  if (action === 'login') {
    const { email, senha } = body
    if (!email || !senha) return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 })

    const { data: cliente, error: loginErr } = await sb.rpc('login_cliente', {
      p_email: email.toLowerCase(),
      p_senha: senha,
    })

    if (loginErr || !cliente?.id) { await new Promise(r => setTimeout(r, 800)); return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 }) }

    const token = await gerarToken({ id: cliente.id, nome: cliente.nome, email: cliente.email })
    return NextResponse.json({ token, cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email } })
  }

  return NextResponse.json({ error: 'Action inválida. Use ?action=cadastro ou ?action=login' }, { status: 400 })
}
