import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-title-2xl font-bold text-gray-800 dark:text-white/90">404</h1>
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">Page not found</p>
      <Link to="/" className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition-colors">
        Go to Dashboard
      </Link>
    </div>
  );
}
