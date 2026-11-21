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
    <div className="bg-surface dark:bg-[#15171B] border-b border-border dark:border-[#282C34] py-3.5 px-4 sm:px-6 flex flex-col gap-3.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with debounced clearable control (pill style) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-text-tertiary dark:text-[#88948E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full h-9 pl-9 pr-8 bg-surface-muted/60 dark:bg-[#181A1F] text-text-primary dark:text-[#F4F5F7] text-xs rounded-full border border-border dark:border-[#282C34] placeholder:text-text-tertiary dark:placeholder:text-[#686E7B] focus:border-accent dark:focus:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent shadow-xs transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary dark:text-[#88948E] hover:text-text-primary dark:hover:text-[#F4F5F7] rounded-full transition-colors"
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
              className="h-9 px-3 py-1 text-xs bg-surface dark:bg-[#181A1F] border border-border dark:border-[#282C34] rounded-full text-text-primary dark:text-[#F4F5F7] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer shadow-xs dark:[&>option]:bg-[#15171B] dark:[&>option]:text-[#F4F5F7] transition-colors"
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
              className="h-9 px-3 text-xs font-medium text-text-secondary dark:text-[#9BA1AE] hover:text-text-primary dark:hover:text-[#F4F5F7] hover:bg-surface-muted dark:hover:bg-[#1E2127] rounded-full transition-colors cursor-pointer"
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
              ? 'bg-[#0F1115] text-white border-[#0F1115] dark:bg-white dark:text-[#090A0D] dark:border-white font-semibold shadow-xs'
              : 'bg-surface-muted/50 dark:bg-[#181A1F] border-border/80 dark:border-[#282C34] text-text-secondary dark:text-[#9BA1AE] hover:bg-surface-muted dark:hover:bg-[#1E2127] hover:text-text-primary dark:hover:text-[#F4F5F7]'
          )}
        >
          <span>All</span>
          <span
            className={cn(
              'text-[10px] font-mono px-1.5 py-0.2 rounded-full',
              !status
                ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#090A0D]'
                : 'bg-surface-muted dark:bg-[#23262E] text-text-tertiary dark:text-[#8C93A0]'
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
                  ? 'bg-[#0F1115] text-white border-[#0F1115] dark:bg-white dark:text-[#090A0D] dark:border-white font-semibold shadow-xs'
                  : 'bg-surface-muted/50 dark:bg-[#181A1F] border-border/80 dark:border-[#282C34] text-text-secondary dark:text-[#9BA1AE] hover:bg-surface-muted dark:hover:bg-[#1E2127] hover:text-text-primary dark:hover:text-[#F4F5F7]'
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
                    ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#090A0D]'
                    : 'bg-surface-muted dark:bg-[#23262E] text-text-tertiary dark:text-[#8C93A0]'
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
