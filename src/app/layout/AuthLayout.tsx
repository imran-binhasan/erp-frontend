import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
