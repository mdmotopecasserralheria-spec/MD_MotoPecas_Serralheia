import type { Status, Empresa } from '@/lib/constants'

export interface Anuncio {
  id: number
  created_at: string
  cliente_id: string
  titulo: string
  descricao: string
  preco: number | null
  imagem_url: string | null
  categoria: string
  empresa: Empresa
  status: Status
  nome_contato: string | null
  telefone_contato: string | null
  whatsapp_contato: string | null
}

export interface Cliente {
  id: string
  email: string
  nome: string
  telefone: string | null
}
