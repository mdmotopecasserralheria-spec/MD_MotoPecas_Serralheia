'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle, XCircle, Megaphone, LogOut, Eye, Trash2, RefreshCw, LayoutDashboard, MessageSquare, Users, Star } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { TabOrcamentos } from '@/components/dashboard/TabOrcamentos'
import { TabClientes } from '@/components/dashboard/TabClientes'
import { TabAvaliacoes } from '@/components/dashboard/TabAvaliacoes'

interface Anuncio {
  id: string; titulo: string; descricao: string; preco: string; categoria: string
  imagem_url: string; empresa: string; status: string; motivo_rejeicao: string
  criado_em: string; aprovado_em: string
  clientes?: { nome: string; email: string; telefone: string }
}

export default function DashboardPage() {
  const [logado, setLogado] = useState(false)
  const [senha, setSenha] = useState('')
  const [token, setToken] = useState('')
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState<'pendente' | 'aprovado' | 'rejeitado' | 'all'>('pendente')
  const [motivoModal, setMotivoModal] = useState<{ id: string; titulo: string } | null>(null)
  const [motivo, setMotivo] = useState('')
  const [excluirId, setExcluirId] = useState<string | null>(null)
  const [aba, setAba] = useState<'anuncios' | 'orcamentos' | 'clientes' | 'avaliacoes'>('anuncios')

  useEffect(() => {
    const t = localStorage.getItem('md_admin_token')
    if (t) { setToken(t); setLogado(true); carregar(t, filtro) }
  }, [])

  useEffect(() => {
    if (logado && token) carregar(token, filtro)
  }, [filtro])

  async function login() {
    setLoading(true)
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha }) })
      const data = await res.json()
      if (res.ok) {
        setToken(data.token); setLogado(true)
        localStorage.setItem('md_admin_token', data.token)
        carregar(data.token, 'pendente')
        toast.success('Bem-vindo, Admin! 🔑')
      } else { toast.error('Senha incorreta') }
    } catch { toast.error('Erro de conexão') }
    finally { setLoading(false) }
  }

  async function carregar(t: string, s: string) {
    setLoading(true)
    const res = await fetch(`/api/anuncios?scope=admin&status=${s}`, { headers: { Authorization: `Bearer ${t}` } })
    const data = await res.json()
    setAnuncios(data.anuncios || [])
    setLoading(false)
  }

  async function aprovar(id: string) {
    const res = await fetch('/api/anuncios', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: 'aprovado' }),
    })
    if (res.ok) { toast.success('✅ Anúncio aprovado e publicado!'); carregar(token, filtro) }
    else { toast.error('Erro ao aprovar') }
  }

  async function rejeitar(id: string) {
    if (!motivo.trim()) { toast.error('Informe o motivo da rejeição'); return }
    const res = await fetch('/api/anuncios', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: 'rejeitado', motivo_rejeicao: motivo }),
    })
    if (res.ok) {
      toast.success('Anúncio rejeitado com feedback'); setMotivoModal(null); setMotivo('')
      carregar(token, filtro)
    } else { toast.error('Erro ao rejeitar') }
  }

  async function excluir(id: string) {
    setExcluirId(id)
  }

  function sair() {
    localStorage.removeItem('md_admin_token')
    setLogado(false); setToken(''); setAnuncios([])
  }

  // ─── LOGIN ────────────────────────────────────────────────────
  if (!logado) return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/icons/Logo para Perfil.png" alt="MD Moto Peças" width={64} height={64} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Painel Admin</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Aprove e gerencie anúncios da vitrine</p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha de administrador</label>
            <input id="admin-senha" type="password" value={senha} onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Senha de administrador" autoComplete="current-password" className="input" />
          </div>
          <button onClick={login} disabled={loading || !senha}
            className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )

  // ─── DASHBOARD ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Top bar */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>M</div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">Admin — MD Moto Peças</p>
              <p className="text-xs text-gray-400">Gerenciamento de anúncios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => carregar(token, filtro)} className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              <RefreshCw size={16} />
            </button>
            <Link href="/vitrine" target="_blank" referrerPolicy="no-referrer-when-downgrade" className="hidden sm:flex items-center gap-1.5 text-sm text-blue-500 hover:underline">
              <Eye size={14} />Ver vitrine
            </Link>
            <button onClick={sair} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors">
              <LogOut size={14} />Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Abas */}
        <div className="flex flex-wrap gap-2 mb-8">
          {([
            { id: 'anuncios', label: 'Anúncios', icon: LayoutDashboard },
            { id: 'orcamentos', label: 'Orçamentos', icon: MessageSquare },
            { id: 'clientes', label: 'Clientes', icon: Users },
            { id: 'avaliacoes', label: 'Avaliações', icon: Star },
          ] as const).map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setAba(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                  aba === tab.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-transparent bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                }`}>
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Conteúdo das abas */}
        {aba === 'anuncios' && (
        <>
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {([
            { id: 'pendente', label: '⏳ Aguardando revisão', color: 'yellow' },
            { id: 'aprovado', label: '✅ Aprovados', color: 'green' },
            { id: 'rejeitado', label: '❌ Rejeitados', color: 'red' },
            { id: 'all', label: '📋 Todos', color: 'gray' },
          ] as const).map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                filtro === f.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-transparent bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:border-gray-200'
              }`}>
              {f.label}
              {filtro === f.id && loading && <span className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando anúncios...</p>
            </div>
          </div>
        )}

        {/* Lista de anúncios */}
        {!loading && anuncios.length === 0 ? (
          <div className="card p-12 text-center">
            <Megaphone size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-300">Nenhum anúncio neste filtro</p>
          </div>
        ) : !loading && (
          <div className="space-y-4">
            {anuncios.map(a => (
              <div key={a.id} className="card p-6">
                <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                  {/* Foto ou emoji */}
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f)' }}>
                    {a.imagem_url ? <img src={a.imagem_url} alt={a.titulo} loading="lazy" className="w-full h-full object-cover" /> : (a.empresa === 'serralheria' ? '⚙️' : '🏍️')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{a.titulo}</h3>
                        {a.clientes && (
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                            👤 {a.clientes.nome} — {a.clientes.email}
                            {a.clientes.telefone && ` — ${a.clientes.telefone}`}
                          </p>
                        )}
                      </div>
                      <span className={`badge text-xs font-semibold flex-shrink-0 ${
                        a.status === 'pendente' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                        a.status === 'aprovado' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                        'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}>
                        {a.status === 'pendente' ? '⏳ Pendente' : a.status === 'aprovado' ? '✅ Aprovado' : '❌ Rejeitado'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 text-xs">{a.empresa === 'serralheria' ? '⚙️ Serralheria' : '🏍️ Peças'}</span>
                      <span className="badge bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 text-xs">{a.categoria}</span>
                      {a.preco && <span className="badge text-xs font-bold" style={{ background: 'rgba(26,58,143,0.1)', color: '#1a3a8f' }}>R$ {a.preco}</span>}
                    </div>

                    {a.descricao && <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 line-clamp-2">{a.descricao}</p>}
                    {a.motivo_rejeicao && <p role="alert" className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">Motivo: {a.motivo_rejeicao}</p>}
                    <p className="text-xs text-gray-400 mt-2">{new Date(a.criado_em).toLocaleString('pt-BR')}</p>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-auto">
                    {a.status === 'pendente' && (
                      <>
                        <button onClick={() => aprovar(a.id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                          <CheckCircle size={15} />Aprovar
                        </button>
                        <button onClick={() => setMotivoModal({ id: a.id, titulo: a.titulo })}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all">
                          <XCircle size={15} />Rejeitar
                        </button>
                      </>
                    )}
                    {a.status === 'aprovado' && (
                      <button onClick={() => setMotivoModal({ id: a.id, titulo: a.titulo })}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 dark:text-gray-300 hover:bg-gray-50 transition-all">
                        <XCircle size={14} />Rejeitar
                      </button>
                    )}
                    <button onClick={() => excluir(a.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 size={14} />Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
        {aba === 'orcamentos' && <TabOrcamentos token={token} />}
        {aba === 'clientes' && <TabClientes token={token} />}
        {aba === 'avaliacoes' && <TabAvaliacoes token={token} />}
      </div>

      {/* Modal de rejeição */}
      {motivoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Rejeitar anúncio">
          <div className="card p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Rejeitar anúncio</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 line-clamp-1">"{motivoModal.titulo}"</p>
            <label htmlFor="rejeicao-motivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motivo da rejeição (o anunciante verá)</label>
            <textarea id="rejeicao-motivo" value={motivo} onChange={e => setMotivo(e.target.value)}
              rows={3} placeholder="Ex: Imagem ilegível, preço ausente, fora da categoria..." className="input resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => rejeitar(motivoModal.id)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors">
                Confirmar rejeição
              </button>
                <button onClick={() => { setMotivoModal(null); setMotivo('') }}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={excluirId !== null}
        title="Excluir anúncio"
        message="Excluir permanentemente este anúncio?"
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={async () => {
          if (!excluirId) return
          await fetch(`/api/anuncios?id=${excluirId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
          toast.success('Excluído'); carregar(token, filtro)
          setExcluirId(null)
        }}
        onCancel={() => setExcluirId(null)}
      />
    </div>
  )
}
