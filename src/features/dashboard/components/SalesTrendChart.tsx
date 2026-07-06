import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SalesTrendPoint } from '@/shared/types/api.types';
import { formatCurrency } from '@/shared/utils/formatCurrency';

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
}

const COLORS = ['#6366f1', '#818cf8'];

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const weekTotal = useMemo(
    () => data.reduce((sum, d) => sum + d.revenue, 0),
    [data],
  );

  const weekCount = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data],
  );

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        label: format(parseISO(point.date), 'EEE'),
      })),
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

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${v}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              formatter={(value) => [formatCurrency(value as number), 'Revenue']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={entry.date} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
