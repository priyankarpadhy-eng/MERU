import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';
import { authApi } from '../api/auth.api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getInitials, formatDate } from '../lib/utils';
import { Sun, Moon, Laptop, LogOut, Check } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { data: stats } = useStats();

  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Theme selection
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    const root = document.documentElement;

    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add('dark');
      else root.classList.remove('dark');
      localStorage.setItem('theme', 'system');
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsUpdating(true);
      const updated = await authApi.updateMe({ name: name.trim() });
      updateUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update name');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-reading mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
        Profile
      </h1>

      {/* Account Overview Card */}
      <div className="p-6 bg-surface border border-border rounded-[12px] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-soft text-accent text-lg font-semibold flex items-center justify-center shrink-0 border border-accent/20">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              {user?.name}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              {user?.email}
            </p>
            <p className="text-[11px] text-text-tertiary mt-1">
              Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-surface-muted/50 rounded-[8px] border border-border shrink-0 text-center w-full sm:w-auto justify-around">
          <div>
            <span className="text-[10px] text-text-tertiary uppercase block font-semibold">
              Total Leads
            </span>
            <span className="font-mono text-lg font-semibold text-text-primary">
              {stats?.total ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Update Name Form */}
      <div className="p-6 bg-surface border border-border rounded-[12px] shadow-xs">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em] mb-4">
          General settings
        </h3>
        <form onSubmit={handleUpdateName} className="space-y-4 max-w-sm">
          <Input
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isUpdating}
            disabled={name.trim() === user?.name}
          >
            Save changes
          </Button>
        </form>
      </div>

      {/* Theme Preferences */}
      <div className="p-6 bg-surface border border-border rounded-[12px] shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]">
          Appearance
        </h3>
        <p className="text-xs text-text-secondary">
          Select your visual color preference.
        </p>

        <div className="grid grid-cols-3 gap-2.5 max-w-md pt-2">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3 rounded-[8px] border flex flex-col items-center gap-2 text-xs font-medium transition-colors ${
              currentTheme === 'light'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent/30'
                : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-3 rounded-[8px] border flex flex-col items-center gap-2 text-xs font-medium transition-colors ${
              currentTheme === 'dark'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent/30'
                : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-3 rounded-[8px] border flex flex-col items-center gap-2 text-xs font-medium transition-colors ${
              currentTheme === 'system'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent/30'
                : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 bg-surface border border-border rounded-[12px] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Sign out
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            End your active session on this device.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={LogOut}
          onClick={logout}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};
