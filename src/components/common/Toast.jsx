import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle } from 'react-icons/hi';

const icons = {
  success: HiOutlineCheckCircle,
  error: HiOutlineXCircle,
  info: HiOutlineInformationCircle,
};

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
};

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || icons.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[toast.type]}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button onClick={() => onRemove(toast.id)} className="text-current opacity-60 hover:opacity-100">×</button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
