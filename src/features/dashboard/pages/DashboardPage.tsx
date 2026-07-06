import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useAuth } from '@/shared/hooks/useAuth';
import { SalesTrendChart } from '@/features/dashboard/components/SalesTrendChart';
import { RecentSalesList } from '@/features/dashboard/components/RecentSalesList';
import { CardSkeleton } from '@/shared/components/ui/Skeleton';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useSocket } from '@/sockets/useSocket';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useDashboard();
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const refreshInventoryViews = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    socket.on('stock-updated', refreshInventoryViews);
    socket.on('low-stock-alert', refreshInventoryViews);

    return () => {
      socket.off('stock-updated', refreshInventoryViews);
      socket.off('low-stock-alert', refreshInventoryViews);
    };
  }, [queryClient, socket]);

  const metrics = useMemo(
    () => [
      {
        label: 'Total Products',
        value: data?.totalProducts ?? 0,
        sub: 'Active inventory',
        icon: Package,
        color: 'text-brand-500',
        bg: 'bg-brand-50 dark:bg-brand-500/10',
      },
      {
        label: 'Total Customers',
        value: data?.totalCustomers ?? 0,
        sub: 'Registered customers',
        icon: Users,
        color: 'text-theme-purple-500',
        bg: 'bg-[#f4eefe] dark:bg-theme-purple-500/10',
      },
      {
        label: 'Total Sales',
        value: data?.totalSales ?? 0,
        sub: `${data?.weekSales ?? 0} this week`,
        icon: ShoppingCart,
        color: 'text-success-500',
        bg: 'bg-success-50 dark:bg-success-500/10',
      },
      {
        label: 'Total Revenue',
        value: formatCurrency(data?.totalRevenue ?? 0),
        sub: `${formatCurrency(data?.weekRevenue ?? 0)} this week`,
        icon: DollarSign,
        color: 'text-warning-500',
        bg: 'bg-warning-50 dark:bg-warning-500/10',
        isFormatted: true,
      },
    ],
    [data],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15 px-5 py-8 text-center">
        <p className="text-theme-sm font-medium text-error-600 dark:text-error-500">
          {error instanceof Error ? error.message : 'Failed to load dashboard data'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-theme-sm font-medium text-brand-500 dark:text-brand-400">Dashboard</p>
          <h1 className="mt-1 text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            A current view of sales, customers, products, and revenue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/sales/create">
            <Button size="sm">
              <Plus size={16} />
              New Sale
            </Button>
          </Link>
          <Link to="/products">
            <Button size="sm" variant="outline">
              <Package size={16} />
              Products
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-theme-sm text-gray-500 dark:text-gray-400">{m.label}</p>
                <h3 className="mt-1 font-bold text-title-sm text-gray-800 dark:text-white/90">
                  {'isFormatted' in m && m.isFormatted
                    ? m.value
                    : Number(m.value).toLocaleString()}
                </h3>
                <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">{m.sub}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.bg}`}>
                <m.icon size={22} className={m.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="h-full lg:col-span-2">
          <SalesTrendChart data={data?.salesTrend ?? []} />
        </div>
        <RecentSalesList sales={data?.recentSales ?? []} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Low Stock Products</h2>
          </div>
          <Link to="/products" className="text-theme-sm font-medium text-brand-500 hover:text-brand-600">
            Manage products
          </Link>
        </div>

        {data?.lowStockProducts?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/[0.02]">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-start text-theme-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-start text-theme-xs font-semibold uppercase text-gray-500 dark:text-gray-400">SKU</th>
                  <th className="px-4 py-3 text-start text-theme-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Category</th>
                  <th className="px-4 py-3 text-start text-theme-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.lowStockProducts.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-4 py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">{product.name}</td>
                    <td className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                    <td className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                    <td className="px-4 py-3">
                      <Badge color="error">{product.stock}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            No products are below the stock threshold.
          </p>
        )}
      </div>
    </div>
  );
}
