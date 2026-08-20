import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChevronRight } from 'react-icons/hi';

const routeLabels = {
  dashboard: 'Dashboard',
  invoices: 'Invoices',
  create: 'Create Invoice',
  customers: 'Customers',
  suppliers: 'Suppliers',
  products: 'Products',
  bills: 'Bills',
  reports: 'Reports',
  settings: 'Settings',
};

export default function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm app-text-muted leading-none tracking-tight">
      {parts.map((part, index) => {
        const path = '/' + parts.slice(0, index + 1).join('/');
        const isLast = index === parts.length - 1;
        const label = routeLabels[part] || part;

        return (
          <span key={path} className="flex items-center gap-1">
            {index > 0 && <HiOutlineChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 shrink-0" />}
            {isLast ? (
              <span className="app-text font-semibold tracking-tight">{label}</span>
            ) : (
              <Link to={path} className="app-text-muted hover:text-primary-600 no-underline font-medium" style={{ textDecoration: 'none' }}>
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
