import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';

export default function Drawer({ isOpen, onClose, title, children, position = 'right', width = 'max-w-md' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: position === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: position === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`absolute top-0 ${position === 'right' ? 'right-0' : 'left-0'} h-full w-full ${width} bg-white dark:bg-slate-800 shadow-2xl flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
