import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`relative w-full ${sizes[size]} app-surface rounded-t-2xl sm:rounded-2xl border app-border shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col`}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b app-border shrink-0">
                <h2 className="text-base font-semibold app-text">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover-surface app-text-muted">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && (
              <div className="px-5 py-3 border-t app-border flex justify-end gap-2 shrink-0" style={{ backgroundColor: 'var(--app-surface-hover)' }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
