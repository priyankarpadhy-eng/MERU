import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Download,
  Building2,
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/leads/StatusBadge';
import { STATUS_CONFIG, STATUS_LIST, SOURCE_CONFIG } from '../lib/constants';
import { formatRelativeTime, getInitials, getAvatarColor, cn } from '../lib/utils';
import { toast } from 'sonner';

export const Dashboard = ({ onOpenAddLead }) => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useStats();

  const total = stats?.total || 0;
  const byStatus = stats?.byStatus || { NEW: 0, CONTACTED: 0, QUALIFIED: 0, LOST: 0 };
  const bySource = stats?.bySource || {};
  const recent = stats?.recent || [];

  // Calculate percentages
  const getPercentage = (count) => {
    if (!total) return 0;
    return Math.round((count / total) * 100);
  };

  // Sort sources descending by count
  const sortedSources = Object.entries(bySource)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0);

  const maxSourceCount = sortedSources.length > 0 ? sortedSources[0][1] : 1;

  // CSV Export handler
  const handleExportCSV = () => {
    if (!recent || recent.length === 0) {
      toast.error('No leads available to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created At'];
    const rows = recent.map((lead) => [
      `"${lead.name || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.company || ''}"`,
      `"${lead.source || ''}"`,
      `"${lead.status || ''}"`,
      `"${lead.createdAt || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads exported to CSV successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-[16px]" />
          ))}
        </div>
        <Skeleton className="h-36 w-full rounded-[16px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 w-full rounded-[16px]" />
          <Skeleton className="h-72 w-full rounded-[16px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-[16px]">
        <p className="text-sm font-semibold text-text-primary mb-1">
          Failed to load dashboard metrics
        </p>
        <p className="text-xs text-text-secondary mb-4">
          Unable to retrieve your pipeline stats at this time.
        </p>
      </div>
    );
  }

  // Zero leads empty state
  if (total === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h2>
          <Button
            variant="primary"
            leftIcon={UserPlus}
            className="rounded-full"
            onClick={() => (onOpenAddLead ? onOpenAddLead() : navigate('/leads/new'))}
          >
            Add lead
          </Button>
        </div>

        <EmptyState
          icon={Users}
          title="No leads yet"
          description="Capture your first sales lead to unlock pipeline visualizations, attribution breakdown, and conversion metrics."
          actionLabel="Add lead"
          actionIcon={UserPlus}
          onAction={() => (onOpenAddLead ? onOpenAddLead() : navigate('/leads/new'))}
          className="border border-border/80 rounded-[16px] py-16"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Real-time pipeline performance and lead attribution overview
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-text-primary bg-surface border border-border rounded-full hover:bg-surface-muted transition-colors shadow-xs"
            title="Download leads as CSV"
          >
            <Download className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Export CSV</span>
          </button>

          <Button
            variant="primary"
            leftIcon={UserPlus}
            className="rounded-full"
            onClick={() => (onOpenAddLead ? onOpenAddLead() : navigate('/leads/new'))}
          >
            Add lead
          </Button>
        </div>
      </div>

      {/* Row of 5 StatCards (Total + 4 Statuses) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Leads"
          value={total}
          icon={Users}
          iconBgClass="bg-surface-muted text-text-primary"
          onClick={() => navigate('/leads')}
          className="rounded-[16px]"
        />
        <StatCard
          title="New"
          value={byStatus.NEW || 0}
          percentage={getPercentage(byStatus.NEW || 0)}
          icon={Sparkles}
          iconBgClass="bg-status-new-bg text-status-new-text"
          onClick={() => navigate('/leads?status=NEW')}
          className="rounded-[16px]"
        />
        <StatCard
          title="Contacted"
          value={byStatus.CONTACTED || 0}
          percentage={getPercentage(byStatus.CONTACTED || 0)}
          icon={PhoneCall}
          iconBgClass="bg-status-contacted-bg text-status-contacted-text"
          onClick={() => navigate('/leads?status=CONTACTED')}
          className="rounded-[16px]"
        />
        <StatCard
          title="Qualified"
          value={byStatus.QUALIFIED || 0}
          percentage={getPercentage(byStatus.QUALIFIED || 0)}
          icon={CheckCircle2}
          iconBgClass="bg-status-qualified-bg text-status-qualified-text"
          onClick={() => navigate('/leads?status=QUALIFIED')}
          className="rounded-[16px]"
        />
        <StatCard
          title="Lost"
          value={byStatus.LOST || 0}
          percentage={getPercentage(byStatus.LOST || 0)}
          icon={XCircle}
          iconBgClass="bg-status-lost-bg text-status-lost-text"
          onClick={() => navigate('/leads?status=LOST')}
          className="rounded-[16px]"
        />
      </div>

      {/* The Long Bar Showing Pipeline Distribution Data */}
      <div className="p-5 sm:p-6 bg-surface border border-border rounded-[16px] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <TrendingUp className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Pipeline distribution
              </h3>
              <p className="text-[11px] text-text-tertiary">
                Visual status breakdown across all tracked leads
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-text-secondary bg-surface-muted px-2.5 py-1 rounded-full border border-border">
            {total} leads total
          </span>
        </div>

        {/* Stacked Horizontal Long Bar */}
        <div className="h-5 w-full bg-surface-muted rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-border/40">
          {STATUS_LIST.map((key) => {
            const count = byStatus[key] || 0;
            const pct = getPercentage(count);
            if (pct === 0) return null;
            const config = STATUS_CONFIG[key];

            return (
              <motion.div
                key={key}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ backgroundColor: config.colorHex }}
                className="h-full rounded-full cursor-pointer hover:opacity-90 hover:brightness-105 transition-all"
                title={`${config.label}: ${count} (${pct}%)`}
                onClick={() => navigate(`/leads?status=${key}`)}
              />
            );
          })}
        </div>

        {/* Interactive Legend with click-to-filter */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 pt-3 border-t border-border text-xs">
          {STATUS_LIST.map((key) => {
            const count = byStatus[key] || 0;
            const pct = getPercentage(count);
            const config = STATUS_CONFIG[key];

            return (
              <button
                type="button"
                key={key}
                onClick={() => navigate(`/leads?status=${key}`)}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-surface-muted transition-colors text-left"
                title={`Filter leads by ${config.label}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/10"
                  style={{ backgroundColor: config.colorHex }}
                />
                <span className="text-text-secondary font-medium">
                  {config.label}
                </span>
                <span className="font-mono text-text-tertiary text-[11px]">
                  {count} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: By Source + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Source Section */}
        <div className="p-5 sm:p-6 bg-surface border border-border rounded-[16px] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  By source
                </h3>
                <p className="text-[11px] text-text-tertiary">
                  Attribution and acquisition channels
                </p>
              </div>
              <span className="text-xs text-text-tertiary font-mono">
                {sortedSources.length} active sources
              </span>
            </div>

            <div className="space-y-3.5">
              {sortedSources.length === 0 ? (
                <p className="text-xs text-text-tertiary py-6 text-center">
                  No source data recorded yet.
                </p>
              ) : (
                sortedSources.map(([srcKey, count]) => {
                  const widthPct = Math.round((count / maxSourceCount) * 100);
                  const label = SOURCE_CONFIG[srcKey]?.label || srcKey;
                  const totalPct = getPercentage(count);

                  return (
                    <div
                      key={srcKey}
                      onClick={() => navigate(`/leads?source=${srcKey}`)}
                      className="cursor-pointer group space-y-1.5 p-1.5 -mx-1.5 rounded-lg hover:bg-surface-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors font-medium">
                          {label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-text-tertiary">
                            {totalPct}%
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-text-secondary group-hover:text-text-primary">
                            {count}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPct}%` }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-accent rounded-full group-hover:bg-accent-hover transition-colors"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Leads Section */}
        <div className="p-5 sm:p-6 bg-surface border border-border rounded-[16px] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  Recent leads
                </h3>
                <p className="text-[11px] text-text-tertiary">
                  Latest activity in your pipeline
                </p>
              </div>
              <Link
                to="/leads"
                className="text-xs text-accent font-medium hover:underline flex items-center gap-1 group"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {recent.length === 0 ? (
                <p className="text-xs text-text-tertiary py-6 text-center">
                  No recent leads.
                </p>
              ) : (
                recent.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-surface-muted/40 px-2 -mx-2 rounded-[10px] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full border flex items-center justify-center shrink-0 font-mono text-[11px] font-semibold select-none',
                          getAvatarColor(lead.name)
                        )}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
                          {lead.name}
                        </p>
                        <p className="text-[11px] text-text-tertiary truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span>{lead.company}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={lead.status} interactive={false} />
                      <span className="font-mono text-[11px] text-text-tertiary hidden sm:inline">
                        {formatRelativeTime(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
