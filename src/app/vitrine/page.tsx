import type { Metadata } from 'next'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase'
import { ArrowRight, Tag, PlusCircle, Star } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { QueroEsseButton } from '@/components/vitrine/QueroEsseButton'

const AvaliacoesCard = dynamic(() => import('@/components/vitrine/AvaliacoesCard').then(m => m.AvaliacoesCard), { ssr: false })

export const metadata: Metadata = {
  title: 'Vitrine — Anúncios de Peças e Serralheria',
  description: 'Compre e venda peças de moto e serviços de serralheria em Santa Tereza de Goiás. Anuncie grátis!',
  openGraph: {
    title: 'Vitrine — Anúncios de Peças e Serralheria | MD Moto Peças',
    description: 'Compre e venda peças de moto e serviços de serralheria em Santa Tereza de Goiás. Anuncie grátis!',
    url: 'https://mdmotopecas.com.br/vitrine',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

interface Avaliacao {
  id: string; nome: string; nota: number; comentario: string | null; criado_em: string
}

interface AnuncioVitrine {
  id: string; titulo: string; descricao: string; preco: string
  categoria: string; empresa: string; imagem_url: string; aprovado_em: string
}

async function getAnuncios(): Promise<AnuncioVitrine[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return [
        { id: '1', titulo: 'Capacete LS2 Preto Fosco', descricao: 'Capacete integral LS2, tamanho 58, excelente estado.', preco: '280,00', categoria: 'Acessórios', empresa: 'pecas', imagem_url: '', aprovado_em: new Date().toISOString() },
        { id: '2', titulo: 'Corrente e Relação Honda Titan', descricao: 'Kit completo original para Titan 150. Sem uso.', preco: '150,00', categoria: 'Transmissão', empresa: 'pecas', imagem_url: '', aprovado_em: new Date().toISOString() },
        { id: '3', titulo: 'Grade de Ferro para Janela', descricao: 'Grade artesanal 80x120cm, já pintada. Retirar local.', preco: '350,00', categoria: 'Grades', empresa: 'serralheria', imagem_url: '', aprovado_em: new Date().toISOString() },
      ]
    }
    const sb = createServerClient()
    const { data } = await sb.rpc('anuncios_vitrine')
    return (data || []) as AnuncioVitrine[]
  } catch { return [] }
}

async function getAvaliacoes(): Promise<Avaliacao[]> {
  try {
    const sb = createServerClient()
    const { data } = await sb.rpc('avaliacoes_aprovadas')
    return (data || []) as Avaliacao[]
  } catch (e) { console.error('[AVALIACOES] exception:', e); return [] }
}

const WP_MD = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'

function formatParcelamento(preco: string): string {
  const valor = parseFloat(preco.replace(',', '.'))
  if (!valor || valor <= 0) return ''
  return `ou 3x de R$ ${(valor / 3).toFixed(2).replace('.', ',')}`
}

export default async function VitrinePage() {
  const anuncios = await getAnuncios()
  const avaliacoes = await getAvaliacoes()

  return (
    <main>
      {/* Hero azul/dourado no estilo MD */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f, #0a1628)' }}>
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}>
                🏪 Vitrine de Anúncios
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                Vitrine <span style={{ color: '#FFD700' }}>MD Moto Peças</span>
              </h1>
              <p className="text-blue-200 text-lg max-w-xl">
                Anúncios de clientes aprovados pelo administrador. Viu algo interessante? Contate direto pelo WhatsApp!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="/vitrine/anunciar"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: '#FFD700', color: '#0a1628' }}>
                <PlusCircle size={18} />
                Anunciar grátis
              </Link>
              <Link href="/vitrine/entrar"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                Meus anúncios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Anúncios */}
      <section className="section">
        {anuncios.length === 0 ? (
          <div className="text-center py-20 card">
            <Tag size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum anúncio aprovado ainda</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Seja o primeiro a anunciar nesta vitrine!</p>
            <Link href="/vitrine/anunciar" className="btn-primary inline-flex">
              <PlusCircle size={16} />Criar meu anúncio
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
            {anuncios.map((a: AnuncioVitrine) => {
              const msg = `Olá! Vi o anúncio "${a.titulo}" na Vitrine MD Moto Peças e tenho interesse!`
              return (
                <div key={a.id} className="card flex flex-col group hover:-translate-y-1 transition-all duration-300 relative">
                  {/* Imagem */}
                  <div className="w-full h-44 rounded-t-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative"
                    style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f)' }}>
                    {a.imagem_url ? (
                      <Image src={a.imagem_url} alt={a.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    ) : (
                      <span className="text-5xl">{a.empresa === 'serralheria' ? '⚙️' : '🏍️'}</span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="badge text-xs font-semibold"
                        style={{ background: 'rgba(26,58,143,0.1)', color: '#1a3a8f' }}>
                        {a.empresa === 'serralheria' ? '⚙️ Serralheria' : '🏍️ Peças'}
                      </span>
                      <span className="badge bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 text-xs">
                        {a.categoria}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white leading-snug mb-1">{a.titulo}</h3>
                    {a.descricao && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{a.descricao}</p>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-dark-600 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg" style={{ color: '#FFD700', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                          {a.preco ? `R$ ${a.preco}` : 'Consulte'}
                        </p>
                        {a.preco && formatParcelamento(a.preco) && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatParcelamento(a.preco)}</p>
                        )}
                      </div>
                      <a
                        href={`https://wa.me/${WP_MD}?text=${encodeURIComponent(msg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}
                      >
                        Quero esse <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                  <QueroEsseButton anuncioId={a.id} />
                </div>
              )
            })}
          </div>
        )}

        {/* Banner anunciar */}
        <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a8f)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Tem peça ou serviço para vender?</h3>
          <p className="text-blue-200 mb-5 text-sm">Cadastre-se e anuncie gratuitamente. Seus anúncios ficam na vitrine após aprovação.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/vitrine/anunciar"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: '#FFD700', color: '#0a1628' }}>
              <PlusCircle size={18} />Anunciar grátis
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}>
              🔑 Painel Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-600" />
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              Avaliações
            </div>
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-600" />
          </div>

          {avaliacoes.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {avaliacoes.map(av => (
                <div key={av.id} className="flex-shrink-0 w-72 bg-white dark:bg-dark-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-600">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={14} className={n <= av.nota ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
                    ))}
                  </div>
                  {av.comentario && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                      &ldquo;{av.comentario}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-dark-600">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-xs font-bold text-white">
                      {av.nome?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{av.nome}</p>
                      <time className="text-[11px] text-gray-400">{new Date(av.criado_em + 'Z').toLocaleDateString('pt-BR')}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AvaliacoesCard />
        </div>
      </section>
    </main>
  )
}
