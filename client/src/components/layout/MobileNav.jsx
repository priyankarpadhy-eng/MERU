import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, User, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileNav = ({ onAddLead }) => {
  const items = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Leads', to: '/leads', icon: Users },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* Floating Add Lead Button */}
      {onAddLead && (
        <div className="flex justify-end px-5 mb-3 pointer-events-auto">
          <button
            onClick={onAddLead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-white font-medium text-sm shadow-floating active:scale-95 transition-transform"
            aria-label="Add lead"
          >
            <UserPlus className="w-4 h-4" strokeWidth={1.75} />
            <span>Add lead</span>
          </button>
        </div>
      )}

      {/* Fixed bottom tab bar */}
      <nav className="bg-surface border-t border-border px-6 py-2 flex items-center justify-around pointer-events-auto shadow-sm">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              )
            }
          >
            <item.icon className="w-5 h-5" strokeWidth={1.75} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
