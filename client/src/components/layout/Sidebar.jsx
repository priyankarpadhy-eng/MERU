import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  ChevronLeft,
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
        'h-full bg-surface flex flex-col justify-between transition-all duration-200 select-none overflow-hidden',
        isCollapsed ? 'w-[72px]' : 'w-56'
      )}
    >
      <div>
        {/* Top Header & Logo */}
        <div
          className={cn(
            'h-16 flex items-center border-b border-border transition-all duration-200 overflow-hidden',
            isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
          )}
        >
          {isCollapsed ? (
            /* Collapsed view: logo mark is perfectly centered, never clipped, click expands sidebar */
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-[10px] bg-accent flex items-center justify-center shrink-0 text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
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
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </button>
          ) : (
            /* Expanded view: Logo + Title on left, collapse button on right */
            <>
              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                <div className="w-8 h-8 rounded-[8px] bg-accent flex items-center justify-center shrink-0 text-white shadow-xs">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="font-bold text-text-primary text-[15px] tracking-tight truncate whitespace-nowrap">
                    Lead Manager
                  </span>
                </div>
              </div>

              {/* Desktop collapse toggle */}
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors shrink-0 cursor-pointer"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </>
          )}
        </div>

        {/* Main Navigation (Active pill: Solid black pill matching reference image) */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-150',
                  isCollapsed && 'justify-center px-0 rounded-[10px]',
                  isActive
                    ? 'bg-[#121614] text-white dark:bg-white dark:text-[#121614] shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                  {!isCollapsed && <span className="truncate whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-2 pb-1 px-3">
            <div className="h-[1px] bg-border w-full" />
          </div>

          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-150',
                  isCollapsed && 'justify-center px-0 rounded-[10px]',
                  isActive
                    ? 'bg-[#121614] text-white dark:bg-white dark:text-[#121614] shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                  {!isCollapsed && <span className="truncate whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-2.5 border-t border-border">
        <div
          className={cn(
            'flex items-center rounded-[12px] bg-surface-muted/60 transition-all',
            isCollapsed ? 'justify-center p-2' : 'justify-between p-2 gap-2'
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-full bg-accent-soft text-accent font-semibold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <div className="truncate text-left min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-text-tertiary truncate leading-tight mt-0.5">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-[6px] text-text-tertiary hover:text-[#DC2626] hover:bg-surface transition-colors shrink-0 cursor-pointer"
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
