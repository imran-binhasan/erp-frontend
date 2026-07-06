import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  limit?: number;
  total?: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
}

function PaginationInner({ page, limit, total, totalPages, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  const firstItem = total && limit ? (page - 1) * limit + 1 : 0;
  const lastItem = total && limit ? Math.min(page * limit, total) : null;
  const pages = getPageNumbers(page, safeTotalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">
        {firstItem && lastItem && total
          ? `Showing ${firstItem}-${lastItem} of ${total}`
          : total === 0
            ? 'No records found'
            : `Page ${page} of ${safeTotalPages}`}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, index) => {
          const prev = pages[index - 1];
          return (
            <span key={p} className="flex items-center gap-2">
              {prev && p - prev > 1 && (
                <span className="px-1 text-theme-sm text-gray-400">...</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={`h-9 min-w-9 rounded-lg px-3 text-theme-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-brand-500 text-white shadow-theme-xs'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5'
                }`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </span>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export const Pagination = memo(PaginationInner);
