'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Zap } from 'lucide-react'

const WP_MD = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'

const links = [
  { href: '/', label: 'Início' },
  { href: '/catalogo', label: 'Peças' },
  { href: '/serralheria', label: 'Serralheria' },
  { href: '/vitrine', label: 'Vitrine' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!open) return
    const menu = menuRef.current
    if (!menu) return
    const focusable = menu.querySelectorAll<HTMLElement>('a, button')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    menu.addEventListener('keydown', trap)
    return () => menu.removeEventListener('keydown', trap)
  }, [open])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-950/95 backdrop-blur-sm shadow-lg shadow-black/30' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo real da MD Moto Peças */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.webp"
            alt="MD Moto Peças"
            width={140}
            height={69}
            className="object-contain"
            style={{ maxHeight: 52, height: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-all"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`https://wa.me/${WP_MD}?text=Olá! Vim pelo site da MD Moto Peças.`}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer-when-downgrade"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700', boxShadow: '0 4px 15px rgba(37,99,235,0.4)' }}
          >
            <Zap size={15} />
            Fale via WhatsApp
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div ref={menuRef} className="md:hidden bg-gray-950 border-t border-gray-800 px-4 py-4 space-y-1" role="dialog" aria-modal="true" aria-label="Navegação">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-all"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WP_MD}?text=Olá! Vim pelo site da MD Moto Peças.`}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer-when-downgrade"
            className="flex items-center gap-2 justify-center px-5 py-3 rounded-xl font-semibold text-sm mt-2"
            style={{ background: 'linear-gradient(135deg, #1a3a8f, #2563eb)', color: '#FFD700' }}
          >
            <Zap size={15} />
            Fale via WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
