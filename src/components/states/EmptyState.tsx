import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * The graph answered — there's just nothing there. Distinct from ErrorState:
 * this is a valid, successful response (e.g. a role with no required skills
 * yet, or two roles with no promotion path between them).
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-ink-600 bg-ink-800/40 px-6 py-14 text-center">
      <svg className="mb-1 h-9 w-9 text-paper-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h3 className="font-display text-base font-medium text-paper-50">{title}</h3>
      {description && <p className="max-w-sm text-sm text-paper-400">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
