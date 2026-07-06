import { useState, useCallback, type ReactNode, useEffect } from 'react';
import type { User } from '@/shared/types/api.types';
import { AuthContext } from './authContext';

function parseStoredUser(): User | null {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(parseStoredUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Watch for 401 from axios interceptor and clear auth state.
  // Actual navigation is handled by <AuthErrorHandler /> inside the router.
  useEffect(() => {
    const handler = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      return user.role.permissions.includes('*') || user.role.permissions.includes(permission);
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
