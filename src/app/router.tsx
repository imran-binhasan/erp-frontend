import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { AuthLayout } from './layout/AuthLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

const LoginPage = lazy(() => import('@/features/auth').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })));
const ProductsPage = lazy(() => import('@/features/products').then((m) => ({ default: m.ProductsPage })));
const ProductEditPage = lazy(() => import('@/features/products').then((m) => ({ default: m.ProductEditPage })));
const CustomersPage = lazy(() => import('@/features/customers').then((m) => ({ default: m.CustomersPage })));
const CustomerEditPage = lazy(() => import('@/features/customers').then((m) => ({ default: m.CustomerEditPage })));
const CreateSalePage = lazy(() => import('@/features/sales').then((m) => ({ default: m.CreateSalePage })));
const SalesPage = lazy(() => import('@/features/sales').then((m) => ({ default: m.SalesPage })));
const RolesPage = lazy(() => import('@/features/roles').then((m) => ({ default: m.RolesPage })));
const RoleEditPage = lazy(() => import('@/features/roles').then((m) => ({ default: m.RoleEditPage })));
const UsersPage = lazy(() => import('@/features/users').then((m) => ({ default: m.UsersPage })));
const UserEditPage = lazy(() => import('@/features/users').then((m) => ({ default: m.UserEditPage })));
const ProfilePage = lazy(() => import('@/features/profile').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="text-theme-sm text-gray-400">Loading...</div>
  </div>
);

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/products"
              element={
                <ProtectedRoute permission="product:read">
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute permission="product:update">
                  <ProductEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute permission="customer:read">
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:id/edit"
              element={
                <ProtectedRoute permission="customer:manage">
                  <CustomerEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/create"
              element={
                <ProtectedRoute permission="sale:create">
                  <CreateSalePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute permission="sale:read">
                  <SalesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute permission="role:manage">
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/:id/edit"
              element={
                <ProtectedRoute permission="role:manage">
                  <RoleEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute permission="user:manage">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute permission="user:manage">
                  <UserEditPage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
