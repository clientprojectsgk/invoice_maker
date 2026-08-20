const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 border border-primary-600 shadow-sm shadow-primary-600/20',
  secondary: 'app-surface app-text border app-border hover-surface',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm shadow-red-600/15',
  ghost: 'app-text-muted hover-surface border border-transparent',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 shadow-sm shadow-emerald-600/15',
  outline: 'app-surface text-primary-600 border border-primary-300 hover:bg-primary-50 dark:border-primary-700 dark:hover:bg-primary-900/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-xl',
};

export default function Button({
  children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight,
  loading, disabled, className = '', onClick, type = 'button', ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
      {IconRight && <IconRight className="w-4 h-4" />}
    </button>
  );
}
