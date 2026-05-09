import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = createServerClient()

    const { data: buckets } = await sb.storage.listBuckets()
    const names: string[] = (buckets || []).map((b: { name: string }) => b.name)
    const exists = names.includes('anuncios')

    if (exists) {
      return NextResponse.json({
        mensagem: 'Bucket "anuncios" já existe',
        buckets: names,
        proximo: 'No dashboard do Supabase > Storage > Policies, adicione INSERT público para o bucket anuncios',
      })
    }

    const { error } = await sb.storage.createBucket('anuncios', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
      fileSizeLimit: 5 * 1024 * 1024,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      mensagem: 'Bucket "anuncios" criado!',
      sqlPolicy: `CREATE POLICY "upload_publico" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'anuncios');`,
    })
  } catch (err) {
    console.error('[SETUP STORAGE]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
