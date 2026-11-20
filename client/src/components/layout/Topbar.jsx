import { Menu, Sun, Moon, Search, Bell, UserPlus } from 'lucide-react';
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
          className="md:hidden p-2 rounded-[8px] text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Global Pill Search Bar (From reference design) */}
        <div className="relative w-72 sm:w-80 md:w-96">
          <Search className="w-3.5 h-3.5 text-text-tertiary dark:text-[#88948E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            onClick={() => navigate('/leads')}
            placeholder="Search across your leads, pipeline..."
            readOnly
            className="w-full h-9 pl-9 pr-12 rounded-full bg-surface-muted/60 dark:bg-[#1A201E] border border-border dark:border-[#2C3833] text-xs text-text-primary dark:text-[#ECEDEA] placeholder:text-text-tertiary dark:placeholder:text-[#76837D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer hover:bg-surface-muted dark:hover:bg-[#202724] shadow-xs transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] bg-surface dark:bg-[#141816] px-1.5 py-0.5 rounded border border-border dark:border-[#2C3833] text-text-tertiary dark:text-[#88948E] pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Add Lead Pill Button (From reference design) */}
        <button
          onClick={() => navigate('/leads/new')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent hover:bg-accent-hover text-white dark:text-[#061512] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add lead</span>
        </button>

        {/* Notification Bell Button */}
        <button
          onClick={() => navigate('/leads')}
          className="relative p-2 rounded-full border border-border dark:border-[#2C3833] bg-surface dark:bg-[#1A201E] text-text-secondary dark:text-[#A0ABA5] hover:text-text-primary dark:hover:text-[#ECEDEA] hover:bg-surface-muted dark:hover:bg-[#202724] shadow-xs transition-colors cursor-pointer"
          title="Notifications & follow-up alerts"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full border border-border dark:border-[#2C3833] bg-surface dark:bg-[#1A201E] text-text-secondary dark:text-[#A0ABA5] hover:text-text-primary dark:hover:text-[#ECEDEA] hover:bg-surface-muted dark:hover:bg-[#202724] shadow-xs transition-colors cursor-pointer"
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
          className="w-8 h-8 rounded-full bg-accent-soft text-accent font-semibold text-xs flex items-center justify-center shrink-0 hover:ring-2 hover:ring-accent/40 transition-all cursor-pointer shadow-xs"
          title={user?.name || 'Profile'}
          aria-label="View user profile"
        >
          {getInitials(user?.name)}
        </button>
      </div>
    </header>
  );
};
