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
    <div className="bg-surface dark:bg-[#161918] border-b border-border dark:border-[#28302D] py-3.5 px-4 sm:px-6 flex flex-col gap-3.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with debounced clearable control (pill style) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-text-tertiary dark:text-[#88948E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full h-9 pl-9 pr-8 bg-surface-muted/60 dark:bg-[#1A201E] text-text-primary dark:text-[#ECEDEA] text-xs rounded-full border border-border dark:border-[#2C3833] placeholder:text-text-tertiary dark:placeholder:text-[#76837D] focus:border-accent dark:focus:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent shadow-xs transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary dark:text-[#88948E] hover:text-text-primary dark:hover:text-[#ECEDEA] rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Source Dropdown and Clear Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-tertiary dark:text-[#88948E]" strokeWidth={1.75} />
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="h-9 px-3 py-1 text-xs bg-surface dark:bg-[#1A201E] border border-border dark:border-[#2C3833] rounded-full text-text-primary dark:text-[#ECEDEA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer shadow-xs dark:[&>option]:bg-[#161918] dark:[&>option]:text-[#ECEDEA] transition-colors"
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
              className="h-9 px-3 text-xs font-medium text-text-secondary dark:text-[#9DA6A0] hover:text-text-primary dark:hover:text-[#ECEDEA] hover:bg-surface-muted dark:hover:bg-[#202724] rounded-full transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Status Segmented Button Bar with counts (Dark-optimized pill style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none select-none">
        <button
          onClick={() => onStatusChange('')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 shrink-0 cursor-pointer border',
            !status
              ? 'bg-[#121614] text-white border-[#121614] dark:bg-[#ECEDEA] dark:text-[#0C1210] dark:border-[#ECEDEA] font-semibold shadow-xs'
              : 'bg-surface-muted/50 dark:bg-[#1A201E] border-border/80 dark:border-[#2C3833] text-text-secondary dark:text-[#A0ABA5] hover:bg-surface-muted dark:hover:bg-[#222B27] hover:text-text-primary dark:hover:text-[#ECEDEA]'
          )}
        >
          <span>All</span>
          <span
            className={cn(
              'text-[10px] font-mono px-1.5 py-0.2 rounded-full',
              !status
                ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#0C1210]'
                : 'bg-surface-muted dark:bg-[#252E2A] text-text-tertiary dark:text-[#88948E]'
            )}
          >
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
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 shrink-0 cursor-pointer border',
                isActive
                  ? 'bg-[#121614] text-white border-[#121614] dark:bg-[#ECEDEA] dark:text-[#0C1210] dark:border-[#ECEDEA] font-semibold shadow-xs'
                  : 'bg-surface-muted/50 dark:bg-[#1A201E] border-border/80 dark:border-[#2C3833] text-text-secondary dark:text-[#A0ABA5] hover:bg-surface-muted dark:hover:bg-[#222B27] hover:text-text-primary dark:hover:text-[#ECEDEA]'
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                style={{ backgroundColor: config.colorHex }}
              />
              <span>{config.label}</span>
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded-full',
                  isActive
                    ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#0C1210]'
                    : 'bg-surface-muted dark:bg-[#252E2A] text-text-tertiary dark:text-[#88948E]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
