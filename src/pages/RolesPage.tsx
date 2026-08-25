import { useCallback } from "react";
import { rolesApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { RoleCard } from "../components/ui/RoleCard";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

export function RolesPage() {
  const fetcher = useCallback(() => rolesApi.list(), []);
  const { data, status, error, refetch } = useApiQuery(fetcher, []);

  return (
    <div>
      <PageHeader
        eyebrow="JobRole nodes"
        title="Roles"
        description="Every role in the graph, ordered by track level."
      />

      {status === "loading" && <LoadingState label="Loading roles…" />}
      {status === "error" && <ErrorState error={error} onRetry={refetch} />}
      {status === "empty" && (
        <EmptyState title="No roles found" description="The graph doesn't have any JobRole nodes yet." />
      )}
      {status === "success" && data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}
