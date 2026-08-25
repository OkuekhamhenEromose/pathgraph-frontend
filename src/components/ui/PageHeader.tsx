import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-ink-700 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-signal-teal">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl font-semibold text-paper-50 sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-paper-400">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
