import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMenu, HiOutlineBell, HiOutlineMoon, HiOutlineSun,
  HiOutlineCog, HiOutlineLogout, HiOutlineChevronDown, HiOutlineSearch,
} from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function Navbar({ onMenuClick, breadcrumb }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const { invoices, customers, products } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchResults = searchQuery.length >= 2 ? [
    ...invoices.filter((i) => i.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || i.customerName?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map((i) => ({ type: 'Invoice', label: i.invoiceNumber, sub: i.customerName, path: `/invoices/${i.id}` })),
    ...customers.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map((c) => ({ type: 'Customer', label: c.name, sub: c.email, path: '/customers' })),
    ...products.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map((p) => ({ type: 'Product', label: p.name, sub: p.sku, path: '/products' })),
  ] : [];

  return (
    <header className="sticky top-0 z-20 app-surface border-b app-border shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--app-surface) 92%, transparent)', backdropFilter: 'blur(10px)' }}>
      <div className="flex items-center justify-between h-14 min-h-14 px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
          <button type="button" onClick={onMenuClick} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover-surface app-text-muted">
            <HiOutlineMenu className="w-5 h-5" />
          </button>
          {breadcrumb && (
            <div className="hidden sm:flex items-center h-full min-w-0 app-breadcrumb app-text-muted text-sm tracking-tight">
              {breadcrumb}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 h-full">
          <div className="relative hidden md:block">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 app-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(e.target.value.length >= 2); }}
              placeholder="Search invoices, customers..."
              className="w-56 lg:w-72 pl-9 pr-3 py-2 text-sm app-text rounded-xl border app-border focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15 transition-shadow"
              style={{ backgroundColor: 'var(--app-input-bg)' }}
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 w-full app-surface rounded-xl shadow-lg border app-border py-1.5 z-50 overflow-hidden">
                {searchResults.map((r, i) => (
                  <button key={i} type="button" onClick={() => { navigate(r.path); setSearchQuery(''); setSearchOpen(false); }}
                    className="w-full px-3 py-2.5 text-left hover-surface flex items-center gap-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider app-text-muted bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">{r.type}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium app-text truncate m-0">{r.label}</p>
                      <p className="text-xs app-text-muted truncate m-0">{r.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover-surface app-text-muted transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <HiOutlineSun className="w-[18px] h-[18px] text-amber-400" /> : <HiOutlineMoon className="w-[18px] h-[18px]" />}
          </button>

          {/* <button type="button" className="relative flex items-center justify-center w-9 h-9 rounded-xl hover-surface app-text-muted transition-colors">
            <HiOutlineBell className="w-[18px] h-[18px]" />
          </button> */}

          <div className="relative ml-1" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-xl hover-surface border border-transparent hover:border-[var(--app-border)] transition-colors">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium app-text max-w-[120px] truncate leading-none tracking-tight">{user?.name}</span>
              <HiOutlineChevronDown className="w-3.5 h-3.5 app-text-muted hidden md:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 app-surface rounded-xl shadow-lg border app-border py-1.5 z-50 overflow-hidden">
                <div className="px-3.5 py-2.5 border-b app-border">
                  <p className="text-sm font-semibold font-display app-text m-0 tracking-tight">{user?.name}</p>
                  <p className="text-xs app-text-muted capitalize m-0 mt-0.5">{user?.role}</p>
                </div>
                <button type="button" onClick={() => { navigate('/settings'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium app-text-muted hover-surface">
                  <HiOutlineCog className="w-4 h-4" /> Settings
                </button>
                <button type="button" onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <HiOutlineLogout className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
