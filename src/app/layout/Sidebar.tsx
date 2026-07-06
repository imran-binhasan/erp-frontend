import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Receipt,
  Shield,
  UserCog,
  X,
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard:view' },
  { to: '/products', label: 'Products', icon: Package, permission: 'product:read' },
  { to: '/customers', label: 'Customers', icon: Users, permission: 'customer:read' },
  { to: '/sales/create', label: 'New Sale', icon: ShoppingCart, permission: 'sale:create' },
  { to: '/sales', label: 'Sales History', icon: Receipt, permission: 'sale:read' },
  { to: '/roles', label: 'Roles', icon: Shield, permission: 'role:manage' },
  { to: '/users', label: 'Users', icon: UserCog, permission: 'user:manage' },
];

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const { hasPermission } = useAuth();
  const visibleItems = navItems.filter((item) => hasPermission(item.permission));

  const content = (
    <div className="flex flex-col h-full px-5 py-6">
      <div className="flex items-center justify-between mb-8">
        {collapsed ? (
          <span className="text-xl font-bold text-brand-500">M</span>
        ) : (
          <span className="text-xl font-bold text-gray-800 dark:text-white/90">Mini ERP</span>
        )}
        <button onClick={onCloseMobile} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/sales'}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
              }`
            }
          >
            <item.icon size={22} className={collapsed ? 'mx-auto' : ''} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[90px]' : 'w-[290px]'
        } hidden lg:block`}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="relative w-[290px] h-full bg-white dark:bg-gray-900 shadow-theme-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
