import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Something went wrong</h1>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
            >
              Reload page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
