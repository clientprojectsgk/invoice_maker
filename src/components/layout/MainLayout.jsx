import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import { useTheme } from '../../context/ThemeContext';

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="min-h-screen app-bg">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className={`flex flex-col min-h-screen transition-all duration-250 ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-60'}`}>
        <Navbar onMenuClick={() => setMobileOpen(true)} breadcrumb={<Breadcrumb />} />
        <main className="flex-1 px-4 md:px-6 py-5 md:py-7">
          <div className="max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
