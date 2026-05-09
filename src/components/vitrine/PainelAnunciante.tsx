'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Clock, CheckCircle, XCircle, LogOut, Eye, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

interface Anuncio {
  id: string; titulo: string; descricao: string; preco: string
  categoria: string; empresa: string; imagem_url: string
  status: 'pendente' | 'aprovado' | 'rejeitado'; motivo_rejeicao: string; criado_em: string
}

const CATEGORIAS_PECAS = ['Transmissão','Freios','Pneus','Motor','Elétrica','Acessórios','Outro']
const CATEGORIAS_SERR  = ['Portões','Grades','Escadas','Estruturas','Cercas','Outro']

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  pendente:  { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock, label: 'Aguardando aprovação' },
  aprovado:  { bg: 'bg-green-50 dark:bg-green-900/20',  text: 'text-green-700 dark:text-green-400',   icon: CheckCircle, label: 'Publicado na vitrine' },
  rejeitado: { bg: 'bg-red-50 dark:bg-red-900/20',      text: 'text-red-700 dark:text-red-400',       icon: XCircle, label: 'Rejeitado' },
}

export function PainelAnunciante() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [aba, setAba] = useState<'lista' | 'novo'>('lista')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fotos, setFotos] = useState<{ file: File; preview: string }[]>([])
  const [form, setForm] = useState({ titulo: '', descricao: '', preco: '', categoria: '', imagem_url: '', empresa: 'pecas' })

  useEffect(() => {
    const t = localStorage.getItem('vitrine_token')
    const c = localStorage.getItem('vitrine_cliente')
    if (!t || !c) { router.push('/vitrine/entrar'); return }
    setToken(t)
    setCliente(JSON.parse(c))
    carregarAnuncios(t)
  }, [])

  async function carregarAnuncios(t: string) {
    const res = await fetch('/api/anuncios?scope=meus', { headers: { Authorization: `Bearer ${t}` } })
    const data = await res.json()
    setAnuncios(data.anuncios || [])
  }

  async function uploadFotos(): Promise<string> {
    if (fotos.length === 0) return ''
    setUploading(true)
    try {
      const formData = new FormData()
      fotos.forEach(f => formData.append('fotos', f.file))

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao enviar fotos')
        return ''
      }

      return data.csv || ''
    } catch { toast.error('Erro ao enviar fotos') }
    finally { setUploading(false) }
    return ''
  }

  async function criarAnuncio() {
    if (!form.titulo || !form.categoria) { toast.error('Título e categoria obrigatórios'); return }
    setLoading(true)
    try {
      const imagem_url = await uploadFotos()
      const res = await fetch('/api/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, imagem_url }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      toast.success('Anúncio enviado para aprovação! ⏳')
      setForm({ titulo: '', descricao: '', preco: '', categoria: '', imagem_url: '', empresa: 'pecas' })
      setFotos([])
      setAba('lista')
      carregarAnuncios(token!)
    } catch { toast.error('Erro de conexão') }
    finally { setLoading(false) }
  }

  function adicionarFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const novas = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setFotos(prev => [...prev, ...novas].slice(0, 3))
  }

  function removerFoto(i: number) {
    setFotos(prev => {
      URL.revokeObjectURL(prev[i].preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  const [excluirId, setExcluirId] = useState<string | null>(null)

  async function excluir(id: string) {
    setExcluirId(id)
  }

  function sair() {
    localStorage.removeItem('vitrine_token')
    localStorage.removeItem('vitrine_cliente')
    router.push('/vitrine')
  }

  if (!cliente) return null

  const cats = form.empresa === 'pecas' ? CATEGORIAS_PECAS : CATEGORIAS_SERR
  const counts = { pendente: anuncios.filter(a => a.status === 'pendente').length, aprovado: anuncios.filter(a => a.status === 'aprovado').length, rejeitado: anuncios.filter(a => a.status === 'rejeitado').length }

  return (
    <>
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-900">
      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>
              {cliente.nome?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{cliente.nome}</p>
              <p className="text-xs text-gray-400">Anunciante</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/vitrine" className="text-sm text-blue-500 hover:text-blue-700 transition-colors">← Vitrine</Link>
            <button onClick={sair} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors">
              <LogOut size={14} />Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Aprovados', val: counts.aprovado, color: 'text-green-600' },
            { label: 'Pendentes', val: counts.pendente, color: 'text-yellow-600' },
            { label: 'Rejeitados', val: counts.rejeitado, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-dark-700 p-1 rounded-xl w-fit">
          {[{ id: 'lista', label: 'Meus anúncios' }, { id: 'novo', label: '+ Novo anúncio' }].map(t => (
            <button key={t.id} onClick={() => setAba(t.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${aba === t.id ? 'bg-white dark:bg-dark-800 shadow-sm text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {aba === 'lista' && (
          <div className="space-y-4">
            {anuncios.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-400 mb-4">Nenhum anúncio ainda</p>
                <button onClick={() => setAba('novo')} className="btn-primary inline-flex">
                  <Plus size={16} />Criar primeiro anúncio
                </button>
              </div>
            ) : anuncios.map(a => {
              const s = STATUS_STYLE[a.status]
              const Icon = s.icon
              return (
                <div key={a.id} className="card p-5 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f)' }}>
                    {a.empresa === 'serralheria' ? '⚙️' : '🏍️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white">{a.titulo}</h3>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} flex-shrink-0`}>
                        <Icon size={12} />{s.label}
                      </span>
                    </div>
                    {a.preco && <p className="font-bold mt-1" style={{ color: '#1a3a8f' }}>R$ {a.preco}</p>}
                    {a.descricao && <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-1">{a.descricao}</p>}
                    {a.status === 'rejeitado' && a.motivo_rejeicao && (
                      <p role="alert" className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                        ⚠️ Motivo: {a.motivo_rejeicao}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-400">{new Date(a.criado_em).toLocaleDateString('pt-BR')}</span>
                      <span className="text-xs bg-gray-100 dark:bg-dark-600 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded">{a.categoria}</span>
                      {a.status === 'aprovado' && (
                        <Link href="/vitrine" className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                          <Eye size={11} />Ver na vitrine
                        </Link>
                      )}
                      <button onClick={() => excluir(a.id)} className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={11} />Excluir
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Novo anúncio */}
        {aba === 'novo' && (
          <div className="card p-8 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Novo anúncio</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Seu anúncio será revisado antes de aparecer na vitrine.</p>

            <div className="space-y-5">
              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria principal *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['pecas', 'serralheria'] as const).map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, empresa: e, categoria: '' }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form.empresa === e ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-dark-500 hover:border-gray-300'}`}>
                      <div className="text-2xl mb-1">{e === 'pecas' ? '🏍️' : '⚙️'}</div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{e === 'pecas' ? 'Moto Peças' : 'Serralheria'}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="painel-titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título *</label>
                <input id="painel-titulo" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ex: Capacete LS2 Tamanho 58 - Novo" className="input" />
              </div>

              <div>
                <label htmlFor="painel-categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria *</label>
                <select id="painel-categoria" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="input">
                  <option value="">Selecione...</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="painel-preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço (R$)</label>
                <input id="painel-preco" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
                  placeholder="Ex: 150,00 (deixe vazio para 'Consulte'" className="input" />
              </div>

              <div>
                <label htmlFor="painel-descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição</label>
                <textarea id="painel-descricao" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  rows={3} placeholder="Detalhes: estado do produto, compatibilidade, condições..." className="input resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fotos (até 3)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {fotos.map((foto, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-dark-500">
                      <img src={foto.preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removerFoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        aria-label={`Remover foto ${i + 1}`}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {fotos.length < 3 && (
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-500 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-500 transition-colors">
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-xs text-gray-400">Adicionar</span>
                      <input type="file" accept="image/*" className="hidden" onChange={adicionarFotos} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-400">Selecione fotos do seu dispositivo (max 3)</p>
              </div>

              <button onClick={criarAnuncio} disabled={loading || uploading || !form.titulo || !form.categoria}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: 'white' }}>
                {uploading ? 'Enviando fotos...' : loading ? 'Enviando...' : '📤 Enviar para aprovação'}
              </button>
              <p className="text-xs text-center text-gray-400">O administrador irá revisar e publicar seu anúncio em breve.</p>
            </div>
          </div>
        )}
      </div>
    </div>

    <ConfirmDialog
      open={excluirId !== null}
      title="Excluir anúncio"
      message="Excluir este anúncio?"
      confirmLabel="Excluir"
      variant="danger"
      onConfirm={async () => {
        if (!excluirId) return
        await fetch(`/api/anuncios?id=${excluirId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        toast.success('Excluído')
        carregarAnuncios(token!)
        setExcluirId(null)
      }}
      onCancel={() => setExcluirId(null)}
    />
    </>
  )
}
