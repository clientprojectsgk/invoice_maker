import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { formatPhone } from '../../utils/formatters';

export default function CustomerCard({ customer, onClick, selected }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md shadow-primary-500/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 card-shadow-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
          {customer.name?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 dark:text-white truncate">{customer.name}</h4>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <HiOutlinePhone className="w-3 h-3" />
            {formatPhone(customer.phone)}
          </div>
          {customer.email && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <HiOutlineMail className="w-3 h-3" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.gst && <p className="text-xs text-slate-400 mt-1">GST: {customer.gst}</p>}
        </div>
      </div>
    </motion.div>
  );
}
