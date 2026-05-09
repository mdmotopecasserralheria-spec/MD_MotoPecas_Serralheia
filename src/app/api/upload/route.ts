import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth-vitrine'

export async function POST(req: NextRequest) {
  try {
    const auth = await isAdmin(req.headers.get('Authorization'))
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const form = await req.formData()
    const files = form.getAll('fotos') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'Nenhuma foto enviada' }, { status: 400 })
    }

    if (files.length > 3) {
      return NextResponse.json({ error: 'Máximo de 3 fotos' }, { status: 400 })
    }

    const sb = createServerClient()
    const urls: string[] = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: `"${file.name}" excede 5MB. Escolha uma foto menor.` }, { status: 400 })
      }

      const ext = file.name.split('.').pop() || 'jpg'
      const nome = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())

      const { error: uploadError } = await sb.storage.from('anuncios').upload(nome, buffer, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      })

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          return NextResponse.json({ error: 'Bucket "anuncios" não existe. Acesse /api/setup/storage para criá-lo.' }, { status: 500 })
        }
        if (uploadError.message.includes('exceeded')) {
          return NextResponse.json({ error: `"${file.name}" é muito grande. Máximo 5MB.` }, { status: 400 })
        }
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
      }

      const { data: urlData } = sb.storage.from('anuncios').getPublicUrl(nome)
      urls.push(urlData.publicUrl)
    }

    return NextResponse.json({ urls, csv: urls.join(',') })
  } catch (e: any) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: e.message || 'Erro interno' }, { status: 500 })
  }
}
