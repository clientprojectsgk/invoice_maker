export function FormField({ label, error, required, children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-[13px] font-semibold tracking-tight app-text mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

const inputClass = 'w-full px-3.5 py-2.5 text-sm app-text rounded-xl border app-border placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15 transition-all tracking-tight';

export function Input({ className = '', ...props }) {
  return <input className={`${inputClass} ${className}`} style={{ backgroundColor: 'var(--app-input-bg)' }} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${inputClass} resize-none ${className}`} style={{ backgroundColor: 'var(--app-input-bg)' }} {...props} />;
}

export function Select({ options = [], className = '', ...props }) {
  return (
    <select className={`${inputClass} ${className}`} style={{ backgroundColor: 'var(--app-input-bg)' }} {...props}>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
    sent: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    paid: 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    partial: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    overdue: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-500',
    active: 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400',
    pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    confirmed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    unpaid: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    advance: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}
