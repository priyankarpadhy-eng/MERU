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
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/leads/StatusBadge';
import { STATUS_CONFIG, STATUS_LIST, SOURCE_CONFIG } from '../lib/constants';
import { formatRelativeTime } from '../lib/utils';

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-[12px]">
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
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
            Dashboard
          </h2>
          <Button
            variant="primary"
            leftIcon={UserPlus}
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
          className="py-20"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
          Dashboard
        </h2>
        <Button
          variant="primary"
          leftIcon={UserPlus}
          onClick={() => (onOpenAddLead ? onOpenAddLead() : navigate('/leads/new'))}
        >
          Add lead
        </Button>
      </div>

      {/* Row of 5 StatCards (Total + 4 Statuses) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Leads"
          value={total}
          icon={Users}
          iconBgClass="bg-surface-muted text-text-primary"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="New"
          value={byStatus.NEW || 0}
          percentage={getPercentage(byStatus.NEW || 0)}
          icon={Sparkles}
          iconBgClass="bg-status-new-bg text-status-new-text"
          onClick={() => navigate('/leads?status=NEW')}
        />
        <StatCard
          title="Contacted"
          value={byStatus.CONTACTED || 0}
          percentage={getPercentage(byStatus.CONTACTED || 0)}
          icon={PhoneCall}
          iconBgClass="bg-status-contacted-bg text-status-contacted-text"
          onClick={() => navigate('/leads?status=CONTACTED')}
        />
        <StatCard
          title="Qualified"
          value={byStatus.QUALIFIED || 0}
          percentage={getPercentage(byStatus.QUALIFIED || 0)}
          icon={CheckCircle2}
          iconBgClass="bg-status-qualified-bg text-status-qualified-text"
          onClick={() => navigate('/leads?status=QUALIFIED')}
        />
        <StatCard
          title="Lost"
          value={byStatus.LOST || 0}
          percentage={getPercentage(byStatus.LOST || 0)}
          icon={XCircle}
          iconBgClass="bg-status-lost-bg text-status-lost-text"
          onClick={() => navigate('/leads?status=LOST')}
        />
      </div>

      {/* Pipeline Stacked Proportion Bar Section */}
      <div className="p-5 sm:p-6 bg-surface border border-border rounded-[12px] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" strokeWidth={1.75} />
            <h3 className="text-sm font-semibold text-text-primary">
              Pipeline distribution
            </h3>
          </div>
          <span className="text-xs font-mono text-text-tertiary">
            {total} leads total
          </span>
        </div>

        {/* Stacked horizontal bar */}
        <div className="h-4 w-full bg-surface-muted rounded-full overflow-hidden flex">
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
                className="h-full first:rounded-l-full last:rounded-r-full hover:opacity-90 transition-opacity"
                title={`${config.label}: ${count} (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-border text-xs">
          {STATUS_LIST.map((key) => {
            const count = byStatus[key] || 0;
            const pct = getPercentage(count);
            const config = STATUS_CONFIG[key];

            return (
              <div
                key={key}
                onClick={() => navigate(`/leads?status=${key}`)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: config.colorHex }}
                />
                <span className="text-text-secondary font-medium">
                  {config.label}
                </span>
                <span className="font-mono text-text-tertiary text-[11px]">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: By Source + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Source Section */}
        <div className="p-5 sm:p-6 bg-surface border border-border rounded-[12px] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">
                By source
              </h3>
              <span className="text-xs text-text-tertiary">
                {sortedSources.length} active sources
              </span>
            </div>

            <div className="space-y-3">
              {sortedSources.length === 0 ? (
                <p className="text-xs text-text-tertiary py-4 text-center">
                  No source data recorded yet.
                </p>
              ) : (
                sortedSources.map(([srcKey, count]) => {
                  const widthPct = Math.round((count / maxSourceCount) * 100);
                  const label = SOURCE_CONFIG[srcKey]?.label || srcKey;

                  return (
                    <div
                      key={srcKey}
                      onClick={() => navigate(`/leads?source=${srcKey}`)}
                      className="cursor-pointer group space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors font-medium">
                          {label}
                        </span>
                        <span className="font-mono text-[11px] text-text-tertiary group-hover:text-text-primary">
                          {count}
                        </span>
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
        <div className="p-5 sm:p-6 bg-surface border border-border rounded-[12px] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Recent leads
              </h3>
              <Link
                to="/leads"
                className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {recent.length === 0 ? (
                <p className="text-xs text-text-tertiary py-4 text-center">
                  No recent leads.
                </p>
              ) : (
                recent.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-surface-muted/40 px-2 -mx-2 rounded-[8px] transition-colors cursor-pointer"
                  >
                    <div className="truncate">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {lead.name}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {lead.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={lead.status} interactive={false} />
                      <span className="font-mono text-[11px] text-text-tertiary">
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
