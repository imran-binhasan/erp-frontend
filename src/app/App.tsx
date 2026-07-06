import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { Providers } from './providers';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { NetworkBanner } from '@/shared/components/NetworkBanner';
import { AuthErrorHandler } from '@/shared/components/AuthErrorHandler';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Providers>
          <AuthErrorHandler />
          <NetworkBanner />
          <AppRouter />
        </Providers>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
