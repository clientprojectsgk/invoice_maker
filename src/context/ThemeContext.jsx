import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

const ThemeContext = createContext(null);

const applyDarkClass = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  document.body.classList.toggle('dark', dark);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ip_dark_mode');
    return saved === 'true';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('ip_sidebar_collapsed');
    return saved === 'true';
  });

  useLayoutEffect(() => {
    applyDarkClass(darkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('ip_dark_mode', darkMode);
    applyDarkClass(darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ip_sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar, setSidebarCollapsed }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
