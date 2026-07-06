import { memo, type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  accessor?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

function DataTableInner<T>({ columns, data, keyExtractor, loading, error, emptyMessage = 'No data found' }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] px-5 py-12 text-center text-gray-400 text-theme-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15 px-5 py-8 text-center">
        <p className="text-theme-sm font-medium text-error-600 dark:text-error-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] px-5 py-12 text-center text-gray-400 text-theme-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-white/[0.02]">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-start text-theme-xs font-semibold uppercase text-gray-500 dark:text-gray-400"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                {columns.map((col) => {
                  const value = col.accessor
                    ? col.accessor(item)
                    : col.render
                      ? col.render(item)
                      : (item as Record<string, unknown>)[col.key] as ReactNode;
                  return (
                    <td key={col.key} className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {value ?? '\u2014'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
