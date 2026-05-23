import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm animate-fade-in"
           onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl
                       border border-forest-100 animate-slide-up overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-100">
          <h3 className="text-base font-semibold text-sage-900">{title}</h3>
          <button onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-forest-50 text-sage-400 hover:text-sage-700 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
