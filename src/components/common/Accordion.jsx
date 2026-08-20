import { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Accordion({ items, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            {item.title}
            <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 pb-3 text-sm text-slate-600 dark:text-slate-400">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
