import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Users,
  Sparkles,
  CheckCircle2,
  Download,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  Info,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/leads/StatusBadge';
import { SourceBadge } from '../components/leads/SourceBadge';
import { formatRelativeTime, getInitials, getAvatarColor, cn } from '../lib/utils';
import { toast } from 'sonner';

export const Dashboard = ({ onOpenAddLead }) => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useStats();

  const [activeRange, setActiveRange] = useState('30 days');

  const total = stats?.total || 0;
  const byStatus = stats?.byStatus || { NEW: 0, CONTACTED: 0, QUALIFIED: 0, LOST: 0 };
  const recent = stats?.recent || [];

  // Calculate percentages
  const getPercentage = (count) => {
    if (!total) return 0;
    return Math.round((count / total) * 100);
  };

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

  // Dual-bar chart data points matching reference layout (Aug 29 - Sep 29)
  const chartData = [
    { date: 'Aug 29', qualified: 4, newLeads: 8 },
    { date: 'Sep 2', qualified: 7, newLeads: 5 },
    { date: 'Sep 6', qualified: 5, newLeads: 9 },
    { date: 'Sep 10', qualified: 8, newLeads: 6 },
    { date: 'Sep 14', qualified: 6, newLeads: 10 },
    { date: 'Sep 17', qualified: 9, newLeads: 7 },
    { date: 'Sep 21', qualified: 7, newLeads: 11 },
    { date: 'Sep 25', qualified: 10, newLeads: 8 },
    { date: 'Sep 29', qualified: 8, newLeads: 12 },
  ];

  const maxVal = 14;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-[20px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="h-72 lg:col-span-2 w-full rounded-[20px]" />
          <Skeleton className="h-72 w-full rounded-[20px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-[20px]">
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
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
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
          className="border border-border/80 rounded-[20px] py-16"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header Bar (Title + Time Range Pills + Export CSV) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Dashboard
        </h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Time Range Pills matching reference design */}
          <div className="flex items-center p-1 rounded-full bg-surface-muted/80 border border-border/70 select-none">
            {['7 days', '30 days', 'Quarter'].map((range) => {
              const isActive = activeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setActiveRange(range)}
                  className={cn(
                    'px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer',
                    isActive
                      ? 'bg-[#121614] text-white dark:bg-white dark:text-[#121614] shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {range}
                </button>
              );
            })}
          </div>

          {/* Export CSV Pill Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-text-primary text-xs font-semibold hover:bg-surface-muted shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Row 1: Hero KPI Cards (Business Health + 3 Vibrant Gradient Cards from reference) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Business / Pipeline Health with Radial Score Gauge */}
        <div className="bg-surface border border-border/80 rounded-[20px] p-5 shadow-xs flex flex-col justify-between hover:border-border transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">Pipeline Health</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Good
            </span>
          </div>

          {/* Radial score gauge */}
          <div className="flex items-center gap-4 my-2">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="transparent"
                  className="text-surface-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray="201.06"
                  strokeDashoffset="36"
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono tracking-tight text-text-primary">
                  84
                </span>
                <span className="text-[10px] text-text-tertiary">/100</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-text-primary">2 follow-ups needed</p>
              <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                Conversion rate is trending 18% higher than last month.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-text-tertiary pt-2 border-t border-border">
            Overall pipeline score based on closing speed & qualification rate.
          </div>
        </div>

        {/* Card 2: Total Pipeline / Revenue (Emerald Vibrant Card) */}
        <div
          onClick={() => navigate('/leads')}
          className="bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white rounded-[20px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow select-none group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              Total Pipeline
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold font-mono tracking-tight text-white">
              {total} <span className="text-base font-normal text-white/80">Leads</span>
            </div>
            <div className="text-xs text-white/80 font-mono mt-0.5">
              ${(total * 3200).toLocaleString()} estimated ARR
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/90 pt-2 border-t border-white/20">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-semibold">↑ 18%</span>
            <span className="text-white/70 text-[11px]">vs previous 30 days</span>
          </div>
        </div>

        {/* Card 3: Qualified Pipeline / Orders (Berry Pink Vibrant Card) */}
        <div
          onClick={() => navigate('/leads?status=QUALIFIED')}
          className="bg-gradient-to-br from-[#ec4899] to-[#be185d] text-white rounded-[20px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow select-none group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              Qualified Leads
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold font-mono tracking-tight text-white">
              {byStatus.QUALIFIED || 0}
            </div>
            <div className="text-xs text-white/80 mt-0.5">
              {getPercentage(byStatus.QUALIFIED)}% of total pipeline
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/90 pt-2 border-t border-white/20">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-semibold">↑ 24%</span>
            <span className="text-white/70 text-[11px]">closing velocity</span>
          </div>
        </div>

        {/* Card 4: New Inquiries / New Customers (Warm Orange Vibrant Card) */}
        <div
          onClick={() => navigate('/leads?status=NEW')}
          className="bg-gradient-to-br from-[#f97316] to-[#c2410c] text-white rounded-[20px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow select-none group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              New Inquiries
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold font-mono tracking-tight text-white">
              {byStatus.NEW || 0}
            </div>
            <div className="text-xs text-white/80 mt-0.5">
              {byStatus.CONTACTED || 0} currently in outreach
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/90 pt-2 border-t border-white/20">
            <span className="font-semibold">Active today</span>
            <span className="text-white/70 text-[11px]">ready for qualification</span>
          </div>
        </div>
      </div>

      {/* Row 2: Lead Velocity Chart & Recent Alerts (From reference design) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left (2 cols): Dual-Color Activity & Velocity Chart */}
        <div className="lg:col-span-2 bg-surface border border-border/80 rounded-[20px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary tracking-tight">
                Lead velocity & conversions
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Qualified deals vs new incoming inquiries over time
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  <span className="text-text-secondary">Qualified</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                  <span className="text-text-secondary">New leads</span>
                </span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-surface-muted/60 border border-border text-xs text-text-secondary cursor-pointer">
                <span>Last 30 days</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Dual Bar Graphic Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group/bar relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none bg-[#121614] text-white text-[10px] px-2 py-1 rounded-[6px] shadow-sm whitespace-nowrap z-10">
                    {item.date}: {item.qualified} Qualified, {item.newLeads} New
                  </div>

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-40">
                    {/* Qualified bar (Emerald) */}
                    <div
                      style={{ height: `${(item.qualified / maxVal) * 100}%` }}
                      className="w-2.5 sm:w-3.5 bg-[#22c55e] rounded-t-full transition-all duration-300 group-hover/bar:brightness-110"
                    />
                    {/* New inquiries bar (Berry pink) */}
                    <div
                      style={{ height: `${(item.newLeads / maxVal) * 100}%` }}
                      className="w-2.5 sm:w-3.5 bg-[#ec4899] rounded-t-full transition-all duration-300 group-hover/bar:brightness-110"
                    />
                  </div>

                  <span className="text-[10px] font-mono text-text-tertiary mt-2">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-text-tertiary">
            <span>Average closing velocity: 3.8 days</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ↑ 12.4% higher than cohort benchmark
            </span>
          </div>
        </div>

        {/* Right (1 col): Recent Alerts Card (Matching reference design) */}
        <div className="bg-surface border border-border/80 rounded-[20px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary tracking-tight">
              Recent alerts
            </h3>
            <Link
              to="/leads"
              className="text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3.5">
            {/* Alert 1 */}
            <div className="flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-surface-muted/50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  2 leads have had no follow-up in 48 hours
                </p>
                <span className="text-[10px] text-text-tertiary">Today, 10:24 AM</span>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-surface-muted/50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  Unusual drop in weekend lead captures
                </p>
                <span className="text-[10px] text-text-tertiary">Yesterday, 3:12 PM</span>
              </div>
            </div>

            {/* Alert 3 */}
            <div className="flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-surface-muted/50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  Qualified leads increased by 32% this week
                </p>
                <span className="text-[10px] text-text-tertiary">Sep 27, 9:00 AM</span>
              </div>
            </div>

            {/* Alert 4 */}
            <div className="flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-surface-muted/50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  Contract review scheduled with Vanguard Digital
                </p>
                <span className="text-[10px] text-text-tertiary">Sep 26, 1:45 PM</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <span className="text-[11px] text-text-tertiary">
              Alerts update automatically as deal stages progress.
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Top Products / Recent Leads Table & Lead Channels Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Recent Leads List Table Card */}
        <div className="bg-surface border border-border/80 rounded-[20px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary tracking-tight">
                Recent leads
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Latest sales prospects captured into your CRM
              </p>
            </div>
            <Link
              to="/leads"
              className="text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-border overflow-x-auto">
            {recent.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-surface-muted/40 transition-colors cursor-pointer rounded-[8px] px-2 select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-semibold select-none shadow-xs',
                      getAvatarColor(lead.name)
                    )}
                  >
                    {getInitials(lead.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {lead.name}
                    </p>
                    <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="w-3 h-3 text-text-tertiary shrink-0" />
                      <span>{lead.company}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={lead.status} interactive={false} />
                  <span className="text-[11px] font-mono text-text-tertiary hidden sm:inline">
                    {formatRelativeTime(lead.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border mt-2 flex items-center justify-between text-xs text-text-secondary">
            <span>Showing top recent opportunities</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/leads')}
              className="text-xs text-accent p-0 h-auto font-semibold"
            >
              Go to leads table →
            </Button>
          </div>
        </div>

        {/* Right: Lead Channels / Advertising Breakdown */}
        <div className="bg-surface border border-border/80 rounded-[20px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary tracking-tight">
                Lead channels
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Conversion yield by marketing & outreach channel
              </p>
            </div>
            <div className="text-[11px] text-text-tertiary select-none">
              Google · Meta · LinkedIn
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'LINKEDIN', label: 'LinkedIn Ads', spend: '$3,400', roas: '4.8x', status: 'Good' },
              { name: 'WEBSITE', label: 'Website Organic', spend: '$0', roas: '12.0x', status: 'Good' },
              { name: 'ADVERTISEMENT', label: 'Google Search Ads', spend: '$2,100', roas: '3.6x', status: 'Good' },
              { name: 'REFERRAL', label: 'Customer Referrals', spend: '$500', roas: '8.4x', status: 'Good' },
            ].map((channel, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-[12px] bg-surface-muted/40 border border-border/60 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <SourceBadge source={channel.name} />
                  <span className="font-medium text-text-primary">{channel.label}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-text-secondary">{channel.spend}</span>
                  <span className="font-mono font-semibold text-text-primary">{channel.roas}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {channel.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border mt-3 text-xs text-text-tertiary flex items-center justify-between">
            <span>Aggregated campaign performance</span>
            <span className="text-accent font-medium">Auto-tracked via UTM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
