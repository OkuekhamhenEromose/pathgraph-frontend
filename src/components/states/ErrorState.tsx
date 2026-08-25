import { ApiError } from "../../lib/api-client";

interface ErrorStateProps {
  error: ApiError | Error | null;
  onRetry?: () => void;
}

/**
 * Renders one of two distinct experiences:
 *
 *  - Database unavailable (ApiError.code === "DATABASE_ERROR", HTTP 503):
 *    the WEXA brief calls this scenario out by name, so it gets its own
 *    calmer, more reassuring copy plus a retry — this is an infrastructure
 *    hiccup, not something the user did wrong.
 *
 *  - Everything else (not found, validation, network, unknown): a plainer
 *    error banner. The backend's own message is safe to show as-is — the
 *    global exception handlers in main.py never let a raw stack trace or
 *    exception string reach the response body.
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isDbUnavailable = error instanceof ApiError && error.isDatabaseUnavailable;
  const message = error?.message ?? "Something went wrong.";

  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-2 rounded-lg border px-6 py-14 text-center ${
        isDbUnavailable ? "border-signal-coral/40 bg-signal-coral/5" : "border-ink-600 bg-ink-800/40"
      }`}
    >
      <svg
        className={`mb-1 h-9 w-9 ${isDbUnavailable ? "text-signal-coral" : "text-paper-400"}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.9" fill="currentColor" />
      </svg>
      <h3 className="font-display text-base font-medium text-paper-50">
        {isDbUnavailable ? "Graph data is temporarily unavailable" : "Couldn't load this"}
      </h3>
      <p className="max-w-sm text-sm text-paper-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md border border-ink-500 bg-ink-700 px-4 py-1.5 text-sm font-medium text-paper-50 transition-colors hover:border-signal-teal hover:text-signal-teal focus-visible:outline-none"
        >
          Try again
        </button>
      )}
    </div>
  );
}
