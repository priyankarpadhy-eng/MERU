import { Menu, Sun, Moon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../../lib/utils';

export const Topbar = ({
  title,
  onOpenMobileSidebar,
  user,
  theme,
  onToggleTheme,
}) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-[8px] text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Global Search Hint Button (Ctrl/Cmd + K) */}
        <button
          onClick={() => navigate('/leads')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-border bg-surface-muted/50 text-text-tertiary hover:text-text-primary hover:border-text-tertiary/60 transition-colors text-xs"
          aria-label="Search leads"
        >
          <Search className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Search leads...</span>
          <kbd className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border text-text-secondary">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-[8px] text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FBBF24]" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />
          )}
        </button>

        {/* User Avatar linking to profile */}
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-accent-soft text-accent font-semibold text-xs flex items-center justify-center shrink-0 hover:ring-2 hover:ring-accent/40 transition-all"
          title={user?.name || 'Profile'}
          aria-label="View user profile"
        >
          {getInitials(user?.name)}
        </button>
      </div>
    </header>
  );
};
