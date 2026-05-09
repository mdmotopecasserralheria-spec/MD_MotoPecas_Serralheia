import type { Metadata } from 'next'
import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 - Página não encontrada | MD Moto Peças',
  description: 'A página que você procura não existe ou foi movida. Volte para a página inicial da MD Moto Peças.',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-gray-200 dark:text-dark-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Página não encontrada</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          A página que você procura não existe ou foi movida para outro endereço.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium">
            <Home size={16} />
            Página inicial
          </Link>
          <Link href="/catalogo" className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-dark-500 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors font-medium">
            <Search size={16} />
            Ver catálogo
          </Link>
        </div>
      </div>
    </section>
  )
}
