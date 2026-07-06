import { Link } from 'react-router-dom';
import { ArrowRight, Receipt } from 'lucide-react';
import type { DashboardRecentSale } from '@/shared/types/api.types';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDateTime } from '@/shared/utils/formatDate';

interface RecentSalesListProps {
  sales: DashboardRecentSale[];
}

export function RecentSalesList({ sales }: RecentSalesListProps) {
  return (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-brand-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Sales</h2>
        </div>
        <Link
          to="/sales"
          className="flex items-center gap-1 text-theme-sm font-medium text-brand-500 hover:text-brand-600"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Receipt size={32} className="mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">No sales yet</p>
          <Link
            to="/sales/create"
            className="mt-3 text-theme-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Create your first sale
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {sales.map((sale) => (
            <li key={sale._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {typeof sale.customer === 'object' ? sale.customer.name : 'Customer'}
                </p>
                <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                  {sale.items.length} item{sale.items.length !== 1 ? 's' : ''} &middot; {formatDateTime(sale.createdAt)}
                </p>
              </div>
              <span className="shrink-0 text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                {formatCurrency(sale.grandTotal)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
