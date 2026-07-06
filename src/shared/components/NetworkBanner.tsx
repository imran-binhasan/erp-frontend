import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

export function NetworkBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] flex items-center justify-center gap-2 bg-error-500 px-4 py-2 text-sm font-medium text-white">
      <WifiOff size={16} />
      You are offline. Some features may be unavailable.
    </div>
  );
}
