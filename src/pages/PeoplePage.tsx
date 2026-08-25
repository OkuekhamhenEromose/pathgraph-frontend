import { useCallback } from "react";
import { Link } from "react-router-dom";
import { personsApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

export function PeoplePage() {
  const fetcher = useCallback(() => personsApi.list(), []);
  const { data, status, error, refetch } = useApiQuery(fetcher, []);

  return (
    <div>
      <PageHeader
        eyebrow="Person nodes"
        title="People"
        description="Everyone in the graph, with the role they currently hold."
      />

      {status === "loading" && <LoadingState label="Loading people…" />}
      {status === "error" && <ErrorState error={error} onRetry={refetch} />}
      {status === "empty" && (
        <EmptyState title="No people found" description="The graph doesn't have any Person nodes yet." />
      )}
      {status === "success" && data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((person) => (
            <Link
              key={person.id}
              to={`/people/${encodeURIComponent(person.id)}`}
              className="group flex flex-col gap-1 rounded-lg border border-ink-700 bg-ink-800/60 p-4 transition-colors hover:border-signal-teal/50"
            >
              <p className="font-display text-sm font-medium text-paper-50 group-hover:text-signal-teal">
                {person.name}
              </p>
              <p className="text-xs text-paper-400">
                {person.current_role ? person.current_role.title : "No current role on file"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
