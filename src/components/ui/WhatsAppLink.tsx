import type { ReactNode } from 'react'

interface WhatsAppLinkProps {
  numero?: string
  mensagem?: string
  children: ReactNode
  className?: string
  label?: string
}

const NUMERO_PECAS = process.env.NEXT_PUBLIC_WHATSAPP_PECAS || '5562992458972'
const NUMERO_SERRALHERIA = process.env.NEXT_PUBLIC_WHATSAPP_SERRALHERIA || NUMERO_PECAS

export { NUMERO_PECAS, NUMERO_SERRALHERIA }

export function WhatsAppLink({ numero = NUMERO_PECAS, mensagem = 'Olá! Vim pelo site da MD Moto Peças.', children, className, label }: WhatsAppLinkProps) {
  return (
    <a
      href={`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
      aria-label={label || `Falar pelo WhatsApp`}
    >
      {children}
    </a>
  )
}
