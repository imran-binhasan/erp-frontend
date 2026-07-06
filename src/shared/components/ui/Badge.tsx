import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface BadgeProps {
  children: ReactNode;
  color?: 'success' | 'error' | 'warning' | 'primary' | 'info' | 'dark';
  variant?: 'light' | 'solid';
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap = {
  success: { light: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500', solid: 'bg-success-500 text-white' },
  error: { light: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500', solid: 'bg-error-500 text-white' },
  warning: { light: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400', solid: 'bg-warning-500 text-white' },
  primary: { light: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400', solid: 'bg-brand-500 text-white' },
  info: { light: 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15', solid: 'bg-blue-light-500 text-white' },
  dark: { light: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400', solid: 'bg-gray-900 text-white dark:bg-white/10' },
};

export function Badge({ children, color = 'primary', variant = 'light', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-theme-xs' : 'px-3 py-1 text-sm',
        colorMap[color][variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
