import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`relative w-full ${sizes[size]} bg-white rounded-lg border border-gray-200 shadow-xl max-h-[90vh] flex flex-col`}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 text-gray-400">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && (
              <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-lg">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
