import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import type { SalesTrendPoint } from '@/shared/types/api.types';
import { formatCurrency } from '@/shared/utils/formatCurrency';

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const maxRevenue = useMemo(
    () => Math.max(...data.map((d) => d.revenue), 1),
    [data],
  );

  const weekTotal = useMemo(
    () => data.reduce((sum, d) => sum + d.revenue, 0),
    [data],
  );

  const weekCount = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data],
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Sales Overview</h2>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">Last 7 days revenue</p>
        </div>
        <div className="flex gap-6 text-end">
          <div>
            <p className="text-theme-xs text-gray-500 dark:text-gray-400">Week revenue</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90">{formatCurrency(weekTotal)}</p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500 dark:text-gray-400">Week orders</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90">{weekCount}</p>
          </div>
        </div>
      </div>

      <div className="flex h-44 flex-1 items-end gap-2 sm:gap-3">
        {data.map((point) => {
          const height = point.revenue > 0 ? Math.max((point.revenue / maxRevenue) * 100, 8) : 4;
          const label = format(parseISO(point.date), 'EEE');

          return (
            <div key={point.date} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-brand-500/90 transition-all group-hover:bg-brand-500 dark:bg-brand-500/80"
                  style={{ height: `${height}%` }}
                  title={`${label}: ${formatCurrency(point.revenue)} (${point.count} sale${point.count !== 1 ? 's' : ''})`}
                />
              </div>
              <span className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
