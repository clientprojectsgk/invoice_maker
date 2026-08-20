import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePlusCircle,
  HiOutlineUserGroup, HiOutlineTruck, HiOutlineCube, HiOutlineReceiptRefund,
  HiOutlineChartBar, HiOutlineCog, HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { APP_NAME } from '../../utils/constants';

const iconMap = {
  HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePlusCircle,
  HiOutlineUserGroup, HiOutlineTruck, HiOutlineCube, HiOutlineReceiptRefund,
  HiOutlineChartBar, HiOutlineCog,
};

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'HiOutlineViewGrid' },
  { path: '/invoices', label: 'Invoices', icon: 'HiOutlineDocumentText' },
  { path: '/invoices/create', label: 'Create Invoice', icon: 'HiOutlinePlusCircle' },
  { path: '/customers', label: 'Customers', icon: 'HiOutlineUserGroup' },
  { path: '/suppliers', label: 'Suppliers', icon: 'HiOutlineTruck' },
  { path: '/products', label: 'Products', icon: 'HiOutlineCube' },
  { path: '/bills', label: 'Bills', icon: 'HiOutlineReceiptRefund' },
  { path: '/reports', label: 'Reports', icon: 'HiOutlineChartBar' },
  { path: '/settings', label: 'Settings', icon: 'HiOutlineCog' },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const location = useLocation();

  const isActive = (item) => {
    if (item.path === '/invoices') {
      return location.pathname === '/invoices'
        || (location.pathname.startsWith('/invoices/') && !location.pathname.startsWith('/invoices/create'));
    }
    return location.pathname === item.path
      || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
  };

  const content = (
    <aside className={`h-full flex flex-col app-surface border-r app-border sidebar-transition ${sidebarCollapsed ? 'w-[68px]' : 'w-60'}`}>
      <div className={`flex items-center h-14 min-h-14 px-4 border-b app-border shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-2.5'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary-600/30">
          <HiOutlineDocumentText className="w-[18px] h-[18px] text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <h6 className="m-0 p-0 font-display font-bold app-text text-[13px] leading-snug tracking-tight truncate">{APP_NAME}</h6>
            <p className="m-0 text-[10px] app-text-muted font-medium tracking-wide uppercase">Billing Suite</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav flex-1 py-3 px-2.5 space-y-1 overflow-y-auto">
        {!sidebarCollapsed && (
          <p className="label-caps px-3 mb-2 mt-1">Menu</p>
        )}
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              title={sidebarCollapsed ? item.label : undefined}
              className={`sidebar-link flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-150 ${
                active
                  ? 'sidebar-link-active'
                  : 'app-text-muted hover-surface'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-300' : ''}`} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2.5 border-t app-border hidden lg:block shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium app-text-muted hover-surface transition-colors"
        >
          {sidebarCollapsed ? <HiOutlineChevronRight className="w-4 h-4" /> : <><HiOutlineChevronLeft className="w-4 h-4" /> Collapse</>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-30">{content}</div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 h-full z-50 shadow-xl">{content}</div>
        </div>
      )}
    </>
  );
}
