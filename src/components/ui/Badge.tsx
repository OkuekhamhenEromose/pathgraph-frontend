import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "teal" | "coral" | "ic" | "mgmt";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "border-ink-500 bg-ink-700 text-paper-200",
  teal: "border-signal-teal/40 bg-signal-teal/10 text-signal-teal",
  coral: "border-signal-coral/40 bg-signal-coral/10 text-signal-coral",
  ic: "border-line-ic/40 bg-line-ic/10 text-line-ic",
  mgmt: "border-line-mgmt/40 bg-line-mgmt/10 text-line-mgmt",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}

/** A track name like "Individual Contributor" / "Engineering Management" maps to a line color. */
export function trackVariant(trackName?: string | null): BadgeVariant {
  if (!trackName) return "neutral";
  return /manage|management|leadership/i.test(trackName) ? "mgmt" : "ic";
}
