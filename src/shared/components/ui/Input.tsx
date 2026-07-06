import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs',
          'placeholder:text-gray-400 focus:outline-hidden focus:ring-3 transition-colors',
          'dark:text-white/90 dark:placeholder:text-white/30',
          error
            ? 'border-error-500 focus:border-error-300 focus:ring-error-500/20'
            : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-theme-xs text-error-500">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
