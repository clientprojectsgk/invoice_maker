import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePlusCircle,
  HiOutlineUserGroup, HiOutlineTruck, HiOutlineCube,
  HiOutlineChartBar, HiOutlineCog, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineShoppingCart, HiOutlineArchive, HiOutlineCash, HiOutlineCreditCard,
  HiOutlineClipboardList, HiOutlineChevronDown, HiOutlineChevronUp,
} from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { APP_NAME } from '../../utils/constants';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  {
    label: 'Purchases', icon: HiOutlineShoppingCart, children: [
      { path: '/purchases', label: 'Purchase List' },
      { path: '/purchases/create', label: 'Add Purchase' },
      { path: '/purchase-payments', label: 'Supplier Payments' },
    ],
  },
  {
    label: 'Inventory', icon: HiOutlineArchive, children: [
      { path: '/stock', label: 'Stock Overview' },
    ],
  },
  {
    label: 'Sales', icon: HiOutlineDocumentText, children: [
      { path: '/invoices', label: 'Invoice List' },
      { path: '/invoices/create', label: 'Create Invoice' },
    ],
  },
  {
    label: 'Receivables', icon: HiOutlineCash, children: [
      { path: '/receivables', label: 'Customer Outstanding' },
      { path: '/customer-payments', label: 'Receive Payment' },
    ],
  },
  {
    label: 'Payables', icon: HiOutlineCreditCard, children: [
      { path: '/payables', label: 'Supplier Outstanding' },
      { path: '/purchase-payments', label: 'Make Payment' },
    ],
  },
  {
    label: 'Masters', icon: HiOutlineClipboardList, children: [
      { path: '/customers', label: 'Customers', icon: HiOutlineUserGroup },
      { path: '/suppliers', label: 'Suppliers / Farmers', icon: HiOutlineTruck },
      { path: '/products', label: 'Products', icon: HiOutlineCube },
    ],
  },
  { path: '/reports', label: 'Reports', icon: HiOutlineChartBar },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState(() => {
    const defaults = {};
    NAV.forEach((item) => {
      if (item.children) {
        const active = item.children.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
        if (active) defaults[item.label] = true;
      }
    });
    return defaults;
  });

  const toggleGroup = (label) => setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const isChildActive = (path) => {
    if (path === '/invoices') return location.pathname === '/invoices' || (location.pathname.startsWith('/invoices/') && !location.pathname.startsWith('/invoices/create'));
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const content = (
    <aside className={`h-full flex flex-col app-surface border-r app-border sidebar-transition ${sidebarCollapsed ? 'w-[68px]' : 'w-60'}`}>
      <div className={`flex items-center h-14 min-h-14 px-4 border-b app-border shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-2.5'}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
        </div>
        {!sidebarCollapsed && (
          <h5 className="m-0 p-0 font-bold text-danger text-base truncate">{APP_NAME}</h5>
        )}
      </div>

      <nav className="sidebar-nav flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          if (item.children) {
            const isOpen = openGroups[item.label];
            const anyActive = item.children.some((c) => isChildActive(c.path));
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <button
                  onClick={() => !sidebarCollapsed && toggleGroup(item.label)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 ${anyActive ? 'sidebar-link-active' : 'app-text-muted hover-surface'} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${anyActive ? 'text-primary-600 dark:text-primary-300' : ''}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      {isOpen ? <HiOutlineChevronUp className="w-3.5 h-3.5" /> : <HiOutlineChevronDown className="w-3.5 h-3.5" />}
                    </>
                  )}
                </button>
                {!sidebarCollapsed && isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    {item.children.map((child) => {
                      const active = isChildActive(child.path);
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onMobileClose}
                          className={`flex items-center gap-2 px-2 py-2 rounded-lg text-[12px] no-underline transition-all ${active ? 'text-primary-600 font-semibold bg-primary-50 dark:bg-primary-900/20' : 'app-text-muted hover-surface'}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <span className="truncate">{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              title={sidebarCollapsed ? item.label : undefined}
              className={`sidebar-link flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-150 ${active ? 'sidebar-link-active' : 'app-text-muted hover-surface'} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
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
