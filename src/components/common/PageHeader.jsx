export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && (typeof subtitle === 'string' ? <p className="page-subtitle">{subtitle}</p> : <div className="mt-1">{subtitle}</div>)}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
