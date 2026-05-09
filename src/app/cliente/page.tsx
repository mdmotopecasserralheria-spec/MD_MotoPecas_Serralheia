'use client'
import { useState, useEffect } from 'react'
import { LogOut, Plus, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface Cliente { id: string; nome: string; email: string; telefone?: string }
interface Anuncio {
  id: string; titulo: string; descricao: string; preco: string
  categoria: string; empresa: string; status: 'pendente' | 'aprovado' | 'rejeitado'
  motivo_rejeicao?: string; criado_em: string
}

const CATS_PECAS = ['Transmissão','Freios','Pneus','Motor','Elétrica','Acessórios','Outros']
const CATS_SERR  = ['Portões','Grades','Escadas','Estruturas','Cercas','Manutenção','Outros']

const STATUS_CONFIG = {
  pendente:  { label: 'Aguardando aprovação', icon: Clock,         color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  aprovado:  { label: 'Publicado na vitrine', icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  rejeitado: { label: 'Não aprovado',         icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
}

export default function ClientePage() {
  const [tela, setTela]         = useState<'login'|'cadastro'|'painel'>('login')
  const [cliente, setCliente]   = useState<Cliente | null>(null)
  const [token, setToken]       = useState('')
  const [aba, setAba]           = useState<'meus'|'criar'>('meus')
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading]   = useState(false)

  // Form login
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  // Form cadastro
  const [nome, setNome]     = useState('')
  const [tel, setTel]       = useState('')
  // Form anúncio
  const [form, setForm] = useState({ titulo:'', descricao:'', preco:'', categoria:'', imagem_url:'', empresa:'pecas' })

  useEffect(() => {
    const saved = localStorage.getItem('md_cliente')
    if (saved) {
      try {
        const { cliente: c, token: t } = JSON.parse(saved)
        setCliente(c); setToken(t); setTela('painel')
        carregarMeus(t)
      } catch (e) { console.error('Erro ao restaurar sessão:', e) }
    }
  }, [])

  async function login() {
    setLoading(true)
    try {
      const res = await fetch('/api/clientes?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      salvarSessao(data.cliente, data.token)
    } catch { toast.error('Erro de conexão') }
    finally { setLoading(false) }
  }

  async function cadastrar() {
    setLoading(true)
    try {
      const res = await fetch('/api/clientes?action=cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, telefone: tel }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      toast.success('Conta criada! Bem-vindo(a) 🎉')
      salvarSessao(data.cliente, data.token)
    } catch { toast.error('Erro de conexão') }
    finally { setLoading(false) }
  }

  function salvarSessao(c: Cliente, t: string) {
    setCliente(c); setToken(t); setTela('painel')
    localStorage.setItem('md_cliente', JSON.stringify({ cliente: c, token: t }))
    carregarMeus(t)
  }

  async function carregarMeus(t: string) {
    try {
      const res = await fetch('/api/anuncios?scope=meus', {
        headers: { Authorization: `Bearer ${t}` }
      })
      const data = await res.json()
      setAnuncios(data.anuncios || [])
    } catch (e) { console.error('Erro ao carregar anúncios:', e) }
  }

  async function criarAnuncio() {
    if (!form.titulo || !form.categoria) { toast.error('Preencha título e categoria'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      toast.success(data.mensagem)
      setForm({ titulo:'', descricao:'', preco:'', categoria:'', imagem_url:'', empresa:'pecas' })
      setAba('meus')
      carregarMeus(token)
    } catch { toast.error('Erro ao enviar') }
    finally { setLoading(false) }
  }

  const [excluirId, setExcluirId] = useState<string | null>(null)

  async function excluir(id: string) {
    setExcluirId(id)
  }

  function sair() {
    localStorage.removeItem('md_cliente')
    setCliente(null); setToken(''); setTela('login'); setAnuncios([])
  }

  const cats = form.empresa === 'pecas' ? CATS_PECAS : CATS_SERR

  // ── Tela Login ────────────────────────────────────────────────
  if (tela === 'login') return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-dark-900">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏍️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Área do Anunciante</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Anuncie sua peça ou serviço na vitrine</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="cliente-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Seu e-mail</label>
              <input id="cliente-email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu e-mail" type="email" autoComplete="email" className="input" />
            </div>
            <div>
              <label htmlFor="cliente-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha</label>
              <input id="cliente-senha" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" type="password" autoComplete="current-password" className="input" onKeyDown={e=>e.key==='Enter'&&login()} />
            </div>
            <button onClick={login} disabled={loading||!email||!senha} className="btn-primary w-full justify-center">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-300">
              Não tem conta?{' '}
              <button onClick={()=>setTela('cadastro')} className="text-blue-500 font-semibold hover:underline">Cadastre-se grátis</button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )

  // ── Tela Cadastro ─────────────────────────────────────────────
  if (tela === 'cadastro') return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-dark-900">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">✨</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar conta grátis</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Anuncie suas peças e serviços na vitrine MD</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="cliente-cad-nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome completo</label>
              <input id="cliente-cad-nome" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome completo" autoComplete="name" className="input" />
            </div>
            <div>
              <label htmlFor="cliente-cad-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input id="cliente-cad-email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu e-mail" type="email" autoComplete="email" className="input" />
            </div>
            <div>
              <label htmlFor="cliente-cad-tel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp (opcional)</label>
              <input id="cliente-cad-tel" value={tel} onChange={e=>setTel(e.target.value)} placeholder="WhatsApp (opcional)" autoComplete="tel" className="input" />
            </div>
            <div>
              <label htmlFor="cliente-cad-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha</label>
              <input id="cliente-cad-senha" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Crie uma senha (mín. 6 caracteres)" type="password" autoComplete="new-password" className="input" />
            </div>
            <button onClick={cadastrar} disabled={loading||!nome||!email||!senha} className="btn-primary w-full justify-center"
              style={{background:'linear-gradient(135deg,#16a34a,#15803d)'}}>
              {loading ? 'Criando conta...' : '🚀 Criar minha conta'}
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-300">
              Já tem conta?{' '}
              <button onClick={()=>setTela('login')} className="text-blue-500 font-semibold hover:underline">Fazer login</button>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Após cadastro, seus anúncios passam por aprovação antes de aparecer na vitrine.
        </p>
      </div>
    </main>
  )

  // ── Painel do Cliente ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600 px-4 py-3 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Olá, {cliente?.nome?.split(' ')[0]}! 👋</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Área do Anunciante</p>
          </div>
          <button onClick={sair} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors">
            <LogOut size={15} />Sair
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['pendente','aprovado','rejeitado'] as const).map(s => {
            const cfg = STATUS_CONFIG[s]
            const Icon = cfg.icon
            return (
              <div key={s} className={`card p-4 border ${cfg.bg}`}>
                <Icon size={18} className={`${cfg.color} mb-1`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {anuncios.filter(a=>a.status===s).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300">{cfg.label}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-dark-700 p-1 rounded-xl w-fit">
          {([{id:'meus',label:'Meus anúncios'},{id:'criar',label:'+ Novo anúncio'}] as const).map(t=>(
            <button key={t.id} onClick={()=>setAba(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${aba===t.id ? 'bg-white dark:bg-dark-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Meus anúncios ──────────────────────────────── */}
        {aba === 'meus' && (
          <div>
            {anuncios.length === 0 ? (
              <div className="text-center py-16 card">
                <AlertCircle size={44} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-300 mb-4">Você ainda não tem anúncios</p>
                <button onClick={()=>setAba('criar')} className="btn-primary inline-flex">
                  <Plus size={15} />Criar primeiro anúncio
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {anuncios.map(a => {
                  const cfg = STATUS_CONFIG[a.status]
                  const Icon = cfg.icon
                  return (
                    <div key={a.id} className={`card p-5 border-2 ${cfg.bg}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Icon size={15} className={cfg.color} />
                            <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{a.empresa === 'pecas' ? '🏍️ Peças' : '⚙️ Serralheria'}</span>
                            <span className="text-xs text-gray-400">· {a.categoria}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{a.titulo}</h3>
                          {a.preco && <p className="text-blue-600 font-bold text-sm">R$ {a.preco}</p>}
                          {a.descricao && <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 line-clamp-2">{a.descricao}</p>}
                          {a.status==='rejeitado' && a.motivo_rejeicao && (
                            <p role="alert" className="mt-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                              <strong>Motivo:</strong> {a.motivo_rejeicao}
                            </p>
                          )}
                          {a.status==='pendente' && (
                            <p className="mt-2 text-yellow-600 dark:text-yellow-400 text-xs">
                              ⏳ Aguardando análise do administrador. Você será notificado.
                            </p>
                          )}
                        </div>
                        <button onClick={()=>excluir(a.id)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Criar anúncio ──────────────────────────────── */}
        {aba === 'criar' && (
          <div className="card p-8 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Novo anúncio</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Após enviar, seu anúncio passa por revisão antes de aparecer na vitrine pública.
            </p>

            <div className="space-y-5">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria do anúncio</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['pecas','serralheria'] as const).map(e=>(
                    <button key={e} onClick={()=>setForm(f=>({...f,empresa:e,categoria:''}))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form.empresa===e ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-dark-500 hover:border-gray-300'}`}>
                      <div className="text-2xl mb-1">{e==='pecas'?'🏍️':'⚙️'}</div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{e==='pecas'?'Peça de Moto':'Serralheria'}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="cliente-anuncio-titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título do anúncio *</label>
                <input id="cliente-anuncio-titulo" value={form.titulo} onChange={e=>setForm(f=>({...f,titulo:e.target.value}))}
                  placeholder={form.empresa==='pecas'?'Ex: Corrente Honda Titan 150, nova':'Ex: Grade de ferro 80x120cm, usada'}
                  className="input" />
              </div>

              <div>
                <label htmlFor="cliente-anuncio-categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria *</label>
                <select id="cliente-anuncio-categoria" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} className="input">
                  <option value="">Selecione...</option>
                  {cats.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="cliente-anuncio-preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço (opcional)</label>
                <input id="cliente-anuncio-preco" value={form.preco} onChange={e=>setForm(f=>({...f,preco:e.target.value}))}
                  placeholder="Ex: 150,00 (deixe vazio para mostrar Consulte)" className="input" />
              </div>

              <div>
                <label htmlFor="cliente-anuncio-descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição</label>
                <textarea id="cliente-anuncio-descricao" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))}
                  placeholder="Descreva o estado do produto, medidas, marca, etc..." rows={3} className="input resize-none" />
              </div>

              <div>
                <label htmlFor="cliente-anuncio-imagem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Link da foto (opcional)</label>
                <input id="cliente-anuncio-imagem" value={form.imagem_url} onChange={e=>setForm(f=>({...f,imagem_url:e.target.value}))}
                  placeholder="https://... (cole link de uma foto do produto)" className="input" aria-describedby="cliente-anuncio-imagem-help" />
                <p id="cliente-anuncio-imagem-help" className="text-xs text-gray-400 mt-1">Dica: tire a foto, envie pro Google Fotos ou Imgur e cole o link aqui.</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-300">
                ⏳ <strong>Importante:</strong> seu anúncio será analisado pelo administrador. Após aprovação, aparecerá automaticamente na vitrine pública.
              </div>

              <button onClick={criarAnuncio} disabled={loading||!form.titulo||!form.categoria}
                className="btn-primary w-full justify-center py-4">
                {loading ? 'Enviando para análise...' : '📤 Enviar anúncio para aprovação'}
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={excluirId !== null}
        title="Excluir anúncio"
        message="Excluir este anúncio?"
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={async () => {
          if (!excluirId) return
          await fetch(`/api/anuncios?id=${excluirId}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } })
          toast.success('Anúncio excluído')
          carregarMeus(token)
          setExcluirId(null)
        }}
        onCancel={() => setExcluirId(null)}
      />
    </div>
  )
}
