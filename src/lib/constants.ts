export const STATUS = ['pendente', 'aprovado', 'rejeitado'] as const
export type Status = (typeof STATUS)[number]

export const EMPRESAS = ['pecas', 'serralheria'] as const
export type Empresa = (typeof EMPRESAS)[number]

export const CATEGORIAS_PECAS = ['Transmissão', 'Freios', 'Pneus', 'Motor', 'Elétrica', 'Acessórios', 'Outros'] as const
export const CATEGORIAS_SERR = ['Portões', 'Grades', 'Escadas', 'Estruturas', 'Cercas', 'Manutenção', 'Outros'] as const

export const CATEGORIAS_CATALOGO = [
  { id: 'transmissao', nome: 'Transmissão', icone: '⚙️', desc: 'Correntes, relações, engrenagens' },
  { id: 'freios', nome: 'Freios', icone: '🛑', desc: 'Pastilhas, discos, fluido de freio' },
  { id: 'pneus', nome: 'Pneus', icone: '🔘', desc: 'Pneus, câmaras de ar, protetores' },
  { id: 'motor', nome: 'Motor', icone: '🔧', desc: 'Peças e componentes do motor' },
  { id: 'eletrica', nome: 'Elétrica', icone: '⚡', desc: 'Baterias, faróis, lanternas' },
  { id: 'acessorios', nome: 'Acessórios', icone: '🎒', desc: 'Capacetes, luvas, baús' },
] as const

export const STATUS_STYLE: Record<Status, { bg: string; text: string; label: string }> = {
  pendente: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pendente' },
  aprovado: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Aprovado' },
  rejeitado: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Rejeitado' },
}

export const WHATSAPP_PECAS = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'
export const WHATSAPP_SERRALHERIA = process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || '5562991444852'
export const CIDADE = process.env.NEXT_PUBLIC_EMPRESA_CIDADE || 'Santa Tereza de Goiás'

export const GRADIENT_DARK = 'linear-gradient(135deg, #0a1628, #1a3a8f)'
export const GRADIENT_BLUE = 'linear-gradient(135deg, #1a3a8f, #2563eb)'

export const HORARIOS = 'Seg–Sáb 8h às 18h'

export function whatsAppUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
