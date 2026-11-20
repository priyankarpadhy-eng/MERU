import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn, getInitials } from '../../lib/utils';

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  user,
  onLogout,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Leads', to: '/leads', icon: Users },
  ];

  const secondaryNavItems = [
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <aside
      className={cn(
        'h-screen bg-surface border-r border-border flex flex-col justify-between transition-all duration-200 select-none z-30',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Geometric SVG Logo Mark (no emojis) */}
            <div className="w-9 h-9 rounded-[8px] bg-accent flex items-center justify-center shrink-0 text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2}" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-text-primary text-sm tracking-tight truncate">
                Lead Manager
              </span>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            ) : (
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors',
                  isActive
                    ? 'text-accent font-semibold bg-accent-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Shared layout active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent rounded-r-full"
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-3 pb-2 px-3">
            <div className="h-[1px] bg-border w-full" />
          </div>

          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors',
                  isActive
                    ? 'text-accent font-semibold bg-accent-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent rounded-r-full"
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-border">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-[8px] bg-surface-muted/60',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-accent-soft text-accent font-semibold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-text-tertiary truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-[6px] text-text-tertiary hover:text-[#DC2626] hover:bg-surface transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
