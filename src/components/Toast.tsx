import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'error'
            ? AlertCircle
            : toast.variant === 'info'
              ? Info
              : CheckCircle2;

        const iconColor =
          toast.variant === 'error'
            ? 'text-red-600'
            : toast.variant === 'info'
              ? 'text-zinc-600'
              : 'text-emerald-700';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-lg transition-transform duration-150"
          >
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 truncate text-xs text-zinc-600">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
