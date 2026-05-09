'use client'
import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import Link from 'next/link'

const CONSENT_KEY = 'md-moto-cookies-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'true')
    window.dispatchEvent(new Event('cookie-consent'))
    setVisible(false)
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <Cookie size={20} className="text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium mb-1">Cookies e Privacidade</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Usamos cookies para melhorar sua experiência, analisar tráfego e oferecer conteúdo relevante.
              Ao clicar em "Aceitar", você concorda com nossa{' '}
              <Link href="/privacidade" className="text-brand-400 hover:underline">Política de Privacidade</Link>.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={reject}
              className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              Recusar
            </button>
            <button onClick={accept}
              className="px-4 py-2 text-xs font-medium text-white rounded-xl transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)' }}>
              Aceitar
            </button>
            <button onClick={reject} aria-label="Fechar" className="p-2 text-gray-500 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
