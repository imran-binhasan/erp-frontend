import { memo } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function ConfirmDialogInner({ open, title, message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-400/50 backdrop-blur-[32px] p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <X size={16} />
        </button>
        <h3 className="mb-2 text-title-sm font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        <p className="mb-6 text-theme-sm text-gray-500 dark:text-gray-400">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

export const ConfirmDialog = memo(ConfirmDialogInner);
