import { AlertCircle, X } from 'lucide-react';

export default function PlanLimitBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{message}</p>
          <p className="mt-1 text-sm text-amber-800">
            Contact support to upgrade to a paid plan for unlimited resources and collections.
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1 text-amber-600 hover:bg-amber-100 hover:text-amber-800"
            aria-label="Dismiss plan limit notice"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
