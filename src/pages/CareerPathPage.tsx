import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { rolesApi, pathsApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { ApiError } from "../lib/api-client";
import type { CareerPathResponse } from "../types";
import { PageHeader } from "../components/ui/PageHeader";
import { PathChain } from "../components/ui/PathChain";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

type SubmitStatus = "idle" | "loading" | "success" | "not-found" | "error";

export function CareerPathPage() {
  const rolesFetcher = useCallback(() => rolesApi.list(), []);
  const roles = useApiQuery(rolesFetcher, []);

  const [fromRoleId, setFromRoleId] = useState("");
  const [toRoleId, setToRoleId] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<CareerPathResponse | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | Error | null>(null);

  async function runSearch(from: string, to: string) {
    if (!from || !to) return;
    setSubmitStatus("loading");
    setSubmitError(null);
    try {
      const path = await pathsApi.careerPath(from, to);
      setResult(path);
      setSubmitStatus("success");
    } catch (err) {
      if (err instanceof ApiError && err.isNotFound) {
        setSubmitStatus("not-found");
        setResult(null);
      } else {
        setSubmitError(err instanceof Error ? err : new Error("Something went wrong."));
        setSubmitStatus("error");
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void runSearch(fromRoleId, toRoleId);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Multi-hop traversal · shortestPath(PROMOTES_TO*1..10)"
        title="Career Path Finder"
        description="Pick a starting role and a target role. PathGraph walks the promotion graph to find the shortest route between them."
      />

      {roles.status === "loading" && <LoadingState label="Loading roles…" />}
      {roles.status === "error" && <ErrorState error={roles.error} onRetry={roles.refetch} />}

      {roles.status === "success" && roles.data && (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-paper-400">
              From role
            </span>
            <select
              required
              value={fromRoleId}
              onChange={(e) => setFromRoleId(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-paper-50 focus-visible:outline-none"
            >
              <option value="" disabled>
                Select a role…
              </option>
              {roles.data.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} (L{role.level})
                </option>
              ))}
            </select>
          </label>

          <label className="flex-1 text-sm">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-paper-400">
              To role
            </span>
            <select
              required
              value={toRoleId}
              onChange={(e) => setToRoleId(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-paper-50 focus-visible:outline-none"
            >
              <option value="" disabled>
                Select a role…
              </option>
              {roles.data.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} (L{role.level})
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitStatus === "loading" || !fromRoleId || !toRoleId}
            className="rounded-md bg-signal-teal px-5 py-2 text-sm font-semibold text-ink-900 transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Find path
          </button>
        </form>
      )}

      {submitStatus === "loading" && <LoadingState label="Traversing the promotion graph…" />}
      {submitStatus === "error" && <ErrorState error={submitError} onRetry={() => runSearch(fromRoleId, toRoleId)} />}
      {submitStatus === "not-found" && (
        <EmptyState
          title="No path found"
          description="These two roles aren't connected by any chain of PROMOTES_TO relationships — they may be on different tracks."
        />
      )}
      {submitStatus === "success" && result && (
        <div className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-800/40 p-5">
          <p className="mb-4 font-mono text-xs text-paper-400">
            {result.num_steps} {result.num_steps === 1 ? "step" : "steps"}
          </p>
          <PathChain
            nodes={result.roles.map((role) => ({
              key: String(role.id),
              label: String(role.title),
              sublabel: `L${role.level}`,
              href: `/roles/${encodeURIComponent(String(role.id))}`,
            }))}
            connectorLabels={result.promotions.map((promotion) =>
              typeof promotion.typical_years === "number" ? `~${promotion.typical_years} yrs` : undefined,
            )}
          />
        </div>
      )}
    </div>
  );
}
