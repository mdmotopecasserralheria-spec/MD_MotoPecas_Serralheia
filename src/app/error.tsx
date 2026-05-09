'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error.message || error)
  }, [error])

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Algo deu errado</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            Página inicial
          </Link>
        </div>
      </div>
    </section>
  )
}
