import { useEffect, useState } from "react";
import { fetchHealth, type HealthResponse } from "../../routes/health";

const POLL_INTERVAL_MS = 30_000;

/**
 * Small persistent indicator in the nav so the user always knows whether
 * the graph is reachable — not just when a query happens to fail. Polls
 * on an interval rather than once, since a database can recover or drop
 * mid-session.
 */
export function DbStatusBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const result = await fetchHealth();
        if (!cancelled) setHealth(result);
      } catch {
        if (!cancelled) setHealth(null);
      }
    }

    poll();
    const id = window.setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const isHealthy = health?.status === "healthy";
  const dotClass = isHealthy ? "bg-signal-teal" : health ? "bg-signal-coral" : "bg-paper-400";
  const label = isHealthy ? "Graph connected" : health ? "Graph degraded" : "Checking…";

  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800 px-2.5 py-1 font-mono text-[11px] text-paper-200"
      title={health ? `database: ${health.database}` : undefined}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </div>
  );
}
