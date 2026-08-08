import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, WifiOff, Layers } from 'lucide-react';
import { useOnlineStatus } from '../context/OnlineStatusContext.jsx';
import { usePageSeo } from '../hooks/usePageSeo.js';

export default function Offline() {
  const navigate = useNavigate();
  const { isOnline } = useOnlineStatus();

  usePageSeo({
    title: 'Offline | ResourceHub',
    description: 'This page is not available offline. Return to a cached page on ResourceHub.',
    path: '/offline',
    noindex: true,
  });

  useEffect(() => {
    if (isOnline) {
      navigate('/', { replace: true });
    }
  }, [isOnline, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div
            className="text-[6rem] font-bold text-stone-200 leading-none select-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Offline
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
              <WifiOff className="w-10 h-10 text-slate-700" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-full text-sm text-stone-600 mb-4">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>ResourceHub</span>
          </div>
          <h1
            className="text-2xl font-bold text-stone-900 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Page not available offline
          </h1>
          <p className="text-stone-600 leading-relaxed">
            This page hasn&apos;t been cached yet. You can return to the home page to browse
            content that was saved during a previous visit.
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/" className="btn-primary w-full justify-center">
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <p className="text-xs text-stone-500">
            Reconnect to the internet to access pages that are not cached.
          </p>
        </div>
      </div>
    </div>
  );
}
