'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title = 'Confirmação',
  message,
  confirmLabel = 'Sim',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up border border-gray-200 dark:border-dark-600">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full flex-shrink-0 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-brand-100 dark:bg-brand-900/30'}`}>
            <AlertTriangle size={22} className={variant === 'danger' ? 'text-red-500' : 'text-brand-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message}</p>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors flex-shrink-0" aria-label="Fechar">
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-500 hover:bg-brand-600'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
