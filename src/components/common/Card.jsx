export default function Card({ children, className = '', hover = false, padding = true, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`app-surface rounded-xl border app-border ${hover ? 'card-shadow-hover cursor-pointer' : 'card-shadow'} ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-4 pb-3 border-b app-border ${className}`}>
      <div>
        {title && <h3 className="section-title m-0">{title}</h3>}
        {subtitle && <p className="text-sm app-text-muted mt-1 m-0">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function KPICard({ title, value, change, icon: Icon, trend }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="label-caps m-0">{title}</p>
          <p className="kpi-value mt-2 m-0">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-2.5 m-0 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'app-text-muted'}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
    </Card>
  );
}
