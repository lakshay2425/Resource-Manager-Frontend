import { RefreshCw, Loader2 } from 'lucide-react';

export default function PublicListErrorState({
  title,
  description,
  onRetry,
  isRetrying = false,
}) {
  return (
    <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-xl border border-stone-200">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <RefreshCw className="w-8 h-8 text-stone-400" />
      </div>
      <h3
        className="text-lg font-semibold text-stone-900 mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <p className="text-stone-600 max-w-md mx-auto mb-6">{description}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="btn-primary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isRetrying && <Loader2 className="w-4 h-4 animate-spin" />}
        Try again
      </button>
    </div>
  );
}
