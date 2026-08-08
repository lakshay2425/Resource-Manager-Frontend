import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../context/OnlineStatusContext.jsx';

export default function OfflineBanner() {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[60] bg-amber-50 border-b border-amber-200 px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-start gap-2.5 text-sm text-amber-900">
        <WifiOff className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <span className="font-medium">You&apos;re offline.</span> Cached pages are available to
          browse. Create, edit, and delete actions are disabled until you reconnect.
        </p>
      </div>
    </div>
  );
}
