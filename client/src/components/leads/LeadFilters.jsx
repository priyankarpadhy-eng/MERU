import { Search, X, SlidersHorizontal } from 'lucide-react';
import { STATUS_LIST, STATUS_CONFIG, SOURCE_LIST, SOURCE_CONFIG } from '../../lib/constants';
import { cn } from '../../lib/utils';

export const LeadFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  onClearFilters,
  statusCounts = {},
  totalCount = 0,
}) => {
  const isFiltered = Boolean(search || status || source);

  return (
    <div className="bg-surface border-b border-border py-3 px-4 sm:px-6 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with debounced clearable control */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full h-9 pl-9 pr-8 bg-surface-muted/60 text-text-primary text-xs rounded-[8px] border border-border placeholder:text-text-tertiary focus:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-primary rounded"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Source Dropdown and Clear Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="h-9 px-2.5 py-1 text-xs bg-surface border border-border rounded-[8px] text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
              aria-label="Filter by source"
            >
              <option value="">All sources</option>
              {SOURCE_LIST.map((key) => (
                <option key={key} value={key}>
                  {SOURCE_CONFIG[key].label}
                </option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="h-9 px-3 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-[8px] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Status Segmented Control with counts */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none select-none">
        <button
          onClick={() => onStatusChange('')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors shrink-0',
            !status
              ? 'bg-accent text-white font-semibold shadow-xs'
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          )}
        >
          <span>All</span>
          <span className={cn('text-[10px] font-mono px-1 rounded', !status ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-tertiary')}>
            {totalCount}
          </span>
        </button>

        {STATUS_LIST.map((key) => {
          const config = STATUS_CONFIG[key];
          const isActive = status === key;
          const count = statusCounts[key] ?? 0;

          return (
            <button
              key={key}
              onClick={() => onStatusChange(isActive ? '' : key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors shrink-0',
                isActive
                  ? 'bg-accent text-white font-semibold shadow-xs'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isActive ? '#FFFFFF' : config.colorHex }}
              />
              <span>{config.label}</span>
              <span className={cn('text-[10px] font-mono px-1 rounded', isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-tertiary')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
