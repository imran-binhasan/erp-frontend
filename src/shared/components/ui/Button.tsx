import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/shared/lib/utils';

const buttonVariants = {
  primary: 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50',
  outline: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/5',
  danger: 'bg-error-500 text-white shadow-theme-xs hover:bg-error-600 disabled:opacity-50',
  success: 'bg-success-500 text-white shadow-theme-xs hover:bg-success-600 disabled:opacity-50',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5',
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5  text-sm',
  icon: 'h-10 w-10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', asChild, loading, className, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer',
          buttonVariants[variant],
          buttonSizes[size],
          loading && 'cursor-wait',
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';
