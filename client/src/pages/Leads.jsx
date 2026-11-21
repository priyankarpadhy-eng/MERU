import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserPlus, Users, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { useLeads, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useStats } from '../hooks/useStats';
import { useDebounce } from '../hooks/useDebounce';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadFilters } from '../components/leads/LeadFilters';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from 'sonner';

export const Leads = ({ onOpenAdd, onOpenEdit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read params from URL
  const searchParam = searchParams.get('search') || '';
  const statusParam = searchParams.get('status') || '';
  const sourceParam = searchParams.get('source') || '';
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const orderParam = searchParams.get('order') || 'desc';
  const pageParam = Number(searchParams.get('page')) || 1;
  const limitParam = Number(searchParams.get('limit')) || 10;

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search to URL query string
  useMemo(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set('search', debouncedSearch);
        } else {
          next.delete('search');
        }
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  // Fetch leads with query parameters
  const queryArgs = useMemo(
    () => ({
      search: searchParam || undefined,
      status: statusParam || undefined,
      source: sourceParam || undefined,
      sortBy: sortByParam,
      order: orderParam,
      page: pageParam,
      limit: limitParam,
    }),
    [searchParam, statusParam, sourceParam, sortByParam, orderParam, pageParam, limitParam]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useLeads(queryArgs);
  const { data: stats } = useStats();

  // Mutations
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  // Delete modal state
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Handlers for URL query updates
  const handleStatusChange = (newStatus) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStatus) next.set('status', newStatus);
      else next.delete('status');
      next.set('page', '1');
      return next;
    });
  };

  const handleSourceChange = (newSource) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newSource) next.set('source', newSource);
      else next.delete('source');
      next.set('page', '1');
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({
      page: '1',
      limit: String(limitParam),
      sortBy: sortByParam,
      order: orderParam,
    });
  };

  const handleSort = (field) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sortByParam === field) {
        next.set('order', orderParam === 'asc' ? 'desc' : 'asc');
      } else {
        next.set('sortBy', field);
        next.set('order', 'asc');
      }
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const handleLimitChange = (newLimit) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('limit', String(newLimit));
      next.set('page', '1');
      return next;
    });
  };

  const handleInlineStatusChange = (id, newStatus) => {
    updateLeadMutation.mutate({ id, data: { status: newStatus } });
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    await deleteLeadMutation.mutateAsync(leadToDelete.id);
    setLeadToDelete(null);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error('No leads available to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created At'];
    const rows = leads.map((lead) => [
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
    link.setAttribute('download', `leads_table_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads exported to CSV successfully');
  };

  const isFiltered = Boolean(searchParam || statusParam || sourceParam);
  const leads = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: limitParam, totalPages: 1 };

  return (
    <div className="space-y-4">
      {/* Top Header: Title, count, and action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-[#F4F5F7] tracking-tight">
            Leads
          </h1>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-surface-muted dark:bg-[#181A1F] text-text-secondary dark:text-[#9BA1AE] border border-border dark:border-[#282C34]">
            {meta.total}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export CSV Pill Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border dark:border-[#282C34] bg-surface dark:bg-[#181A1F] text-text-primary dark:text-[#F4F5F7] text-xs font-semibold hover:bg-surface-muted dark:hover:bg-[#22252C] shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary dark:text-[#88948E]" />
            <span>Export CSV</span>
          </button>

          <Button
            variant="primary"
            leftIcon={UserPlus}
            className="rounded-full"
            onClick={() => (onOpenAdd ? onOpenAdd() : navigate('/leads/new'))}
          >
            Add lead
          </Button>
        </div>
      </div>

      {/* Main card containing Filters + Table + Pagination (rounded-20px Metrik design) */}
      <div className="bg-surface dark:bg-[#15171B] border border-border/80 dark:border-[#282C34] rounded-[20px] overflow-hidden shadow-xs">
        <LeadFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          status={statusParam}
          onStatusChange={handleStatusChange}
          source={sourceParam}
          onSourceChange={handleSourceChange}
          onClearFilters={handleClearFilters}
          statusCounts={stats?.byStatus || {}}
          totalCount={stats?.total || meta.total}
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-[8px] bg-[#FCE6E3] dark:bg-[#3D1B18] text-[#DC2626] flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-semibold text-text-primary mb-1">
              Failed to load leads
            </p>
            <p className="text-xs text-text-secondary mb-4 max-w-sm">
              {error?.message || 'An error occurred while fetching your leads.'}
            </p>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={RefreshCw}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State: Zero leads total */}
        {!isLoading && !isError && leads.length === 0 && !isFiltered && (
          <EmptyState
            icon={Users}
            title="No leads yet"
            description="Start building your pipeline by capturing your first sales lead."
            actionLabel="Add lead"
            actionIcon={UserPlus}
            onAction={() => (onOpenAdd ? onOpenAdd() : navigate('/leads/new'))}
            className="border-0 rounded-none py-16"
          />
        )}

        {/* Empty State: Filters produced no results */}
        {!isLoading && !isError && leads.length === 0 && isFiltered && (
          <EmptyState
            icon={Users}
            title="No matching leads"
            description="No leads matched your current search filters. Try adjusting or clearing your filters."
            actionLabel="Clear filters"
            onAction={handleClearFilters}
            className="border-0 rounded-none py-16"
          />
        )}

        {/* Table data view */}
        {!isLoading && !isError && leads.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <LeadsTable
                leads={leads}
                sortBy={sortByParam}
                order={orderParam}
                onSort={handleSort}
                onRowClick={(id) => navigate(`/leads/${id}`)}
                onEdit={(lead) => (onOpenEdit ? onOpenEdit(lead) : navigate(`/leads/${lead.id}/edit`))}
                onDelete={(lead) => setLeadToDelete(lead)}
                onChangeStatus={handleInlineStatusChange}
                isInitialLoad={!isFetching}
              />
            </div>

            <Pagination
              page={meta.page}
              limit={meta.limit}
              total={meta.total}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog requiring typed "delete" */}
      <ConfirmDialog
        isOpen={Boolean(leadToDelete)}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this lead?"
        itemName={leadToDelete?.name}
        description="This action cannot be undone. All contact details and records for this lead will be permanently deleted."
        expectedWord="delete"
        confirmLabel="Delete lead"
        isLoading={deleteLeadMutation.isPending}
      />
    </div>
  );
};
