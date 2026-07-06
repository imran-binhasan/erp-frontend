import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component must be rendered inside <BrowserRouter> so it can
// use React Router for SPA navigation when the axios interceptor
// detects a 401 or 403 response.
//
// It subscribes to global window events dispatched by authErrorHandler.ts,
// so it never imports from or depends on the axios layer directly.

export function AuthErrorHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle401 = () => {
      navigate('/login', { replace: true });
    };
    const handle403 = () => {
      navigate('/dashboard', { replace: true });
    };

    window.addEventListener('auth:expired', handle401);
    window.addEventListener('auth:forbidden', handle403);

    return () => {
      window.removeEventListener('auth:expired', handle401);
      window.removeEventListener('auth:forbidden', handle403);
    };
  }, [navigate]);

  return null;
}
