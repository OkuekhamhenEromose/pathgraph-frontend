import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { tracksApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { RoleCard } from "../components/ui/RoleCard";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";


export function TrackDetailPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const fetcher = useCallback(() => tracksApi.get(trackId!), [trackId]);
  const { data, status, error, refetch } = useApiQuery(
    fetcher,
    [trackId],
    (track) => !track.roles || track.roles.length === 0,
  );

  if (status === "loading") return <LoadingState label="Loading track…" />;
  if (status === "error") return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <PageHeader eyebrow="Career track" title={data.name} description={data.description ?? undefined} />

      {status === "empty" ? (
        <EmptyState
          title="No roles on this track yet"
          description="No JobRole nodes have a BELONGS_TO relationship to this track."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.roles?.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      )}

      <Link to="/tracks" className="mt-8 inline-block text-sm text-signal-teal hover:underline">
        ← Back to all tracks
      </Link>
    </div>
  );
}
