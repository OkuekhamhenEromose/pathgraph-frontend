interface LoadingStateProps {
  label?: string;
}

/** Generic in-flight indicator. Used by every screen that calls useApiQuery. */
export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-paper-400">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink-600 border-t-signal-teal" />
      <p className="font-body text-sm">{label}</p>
    </div>
  );
}
