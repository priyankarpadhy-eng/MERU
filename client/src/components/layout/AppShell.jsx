import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../hooks/useAuth';

export const AppShell = ({ children, title = 'Lead Manager' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Remember sidebar collapse state in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  // Mobile sidebar overlay state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Keyboard shortcut: Ctrl+K / Cmd+K focuses search / navigates to leads
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/leads');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden antialiased">
      {/* Desktop & Laptop Stationary Sidebar: fixed height, placed permanently on left */}
      <aside className="hidden md:block shrink-0 h-screen sticky top-0 z-30 select-none">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          user={user}
          onLogout={logout}
        />
      </aside>

      {/* Tablet / Mobile Overlay Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <Sidebar
                isCollapsed={false}
                user={user}
                onLogout={logout}
                onCloseMobile={() => setIsMobileOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Topbar
          title={title}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Page body viewport */}
        <main className="flex-1 overflow-y-auto min-h-0 flex flex-col p-4 sm:p-6 lg:p-8 max-w-layout w-full mx-auto pb-20 md:pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col min-h-0"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Fixed bottom navigation on mobile */}
      <MobileNav onAddLead={() => navigate('/leads/new')} />
    </div>
  );
};
