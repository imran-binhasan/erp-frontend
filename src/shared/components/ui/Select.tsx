import { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SelectProps {
  label?: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ label, error, value, onValueChange, options, placeholder = 'Select...', className, disabled }, ref) => (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs transition-colors',
            'focus:outline-hidden focus:ring-3',
            'dark:text-white/90',
            error
              ? 'border-error-500 focus:border-error-300 focus:ring-error-500/20'
              : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800',
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown size={16} className="text-gray-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-[100000] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:hover:bg-white/5 dark:focus:bg-white/5 data-[state=checked]:text-brand-500"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="mt-1 text-theme-xs text-error-500">{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
