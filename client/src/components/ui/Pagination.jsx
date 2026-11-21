import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export const Pagination = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  className,
}) => {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);

      if (page <= 3) {
        start = 1;
        end = 5;
      } else if (page >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 border-t border-border bg-surface text-sm',
        className
      )}
    >
      <div className="flex items-center gap-3 text-text-secondary text-xs">
        <span className="font-mono">
          Showing <span className="text-text-primary font-medium">{from}–{to}</span> of{' '}
          <span className="text-text-primary font-medium">{total}</span>
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-border">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-surface-muted dark:bg-[#181A1F] text-text-primary dark:text-[#F4F5F7] border border-border dark:border-[#282C34] rounded-[6px] px-2 py-0.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent dark:[&>option]:bg-[#15171B] dark:[&>option]:text-[#F4F5F7]"
              aria-label="Rows per page"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="h-8 px-2"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'h-8 w-8 rounded-[6px] text-xs font-mono transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                p === page
                  ? 'bg-[#0F1115] text-white dark:bg-white dark:text-[#090A0D] font-semibold shadow-xs'
                  : 'text-text-secondary dark:text-[#9BA1AE] hover:bg-surface-muted dark:hover:bg-[#1E2127] hover:text-text-primary dark:hover:text-[#F4F5F7]'
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="h-8 px-2"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
};
