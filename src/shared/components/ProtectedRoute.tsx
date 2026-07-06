import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children?: ReactNode;
  permission?: string;
}

export function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
