import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[99999] bg-gray-400/50 backdrop-blur-[32px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[99999] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-theme-xl dark:bg-gray-900',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            className,
          )}
        >
          <Dialog.Close className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10">
            <X size={16} />
          </Dialog.Close>
          <Dialog.Title className="mb-6 text-title-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
