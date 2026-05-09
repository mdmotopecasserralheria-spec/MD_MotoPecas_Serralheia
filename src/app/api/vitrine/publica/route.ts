import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
  try {
    const sb = createServerClient()

    const { data, error } = await sb
      .from('anuncios')
      .select('id, titulo, descricao, preco, categoria, imagem_url, criado_em')
      .eq('status', 'aprovado')
      .order('criado_em', { ascending: false })

    if (error) {
      // Modo demo sem Supabase
      return NextResponse.json({
        anuncios: [
          { id: '1', titulo: 'Corrente DID 428 — Honda Titan', descricao: 'Alta durabilidade, compatível com Titan 125.', preco: '45,90', categoria: 'Peças para moto', imagem_url: '', criado_em: new Date().toISOString() },
          { id: '2', titulo: 'Portão Automático Deslizante 3m', descricao: 'Com automação, motor e 2 controles remotos. Instalado.', preco: '', categoria: 'Serralheria', imagem_url: '', criado_em: new Date().toISOString() },
        ]
      })
    }

    return NextResponse.json({ anuncios: data || [] })
  } catch (err) {
    console.error('[VITRINE PUBLICA GET]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
