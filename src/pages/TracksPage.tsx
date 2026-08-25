import { useCallback } from "react";
import { Link } from "react-router-dom";
import { tracksApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { trackVariant } from "../components/ui/badge-utils";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

const TRACK_DOT_CLASS: Record<string, string> = {
  ic: "bg-line-ic",
  mgmt: "bg-line-mgmt",
  teal: "bg-signal-teal",
  coral: "bg-signal-coral",
  neutral: "bg-paper-400",
};

export function TracksPage() {
  const fetcher = useCallback(() => tracksApi.list(), []);
  const { data, status, error, refetch } = useApiQuery(fetcher, []);

  return (
    <div>
      <PageHeader
        eyebrow="CareerTrack nodes"
        title="Career Tracks"
        description="The ladders roles belong to — typically Individual Contributor and Management."
      />

      {status === "loading" && <LoadingState label="Loading tracks…" />}
      {status === "error" && <ErrorState error={error} onRetry={refetch} />}
      {status === "empty" && (
        <EmptyState title="No tracks found" description="The graph doesn't have any CareerTrack nodes yet." />
      )}
      {status === "success" && data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((track) => (
            <Link
              key={track.id}
              to={`/tracks/${encodeURIComponent(track.id)}`}
              className="group flex flex-col gap-2 rounded-lg border border-ink-700 bg-ink-800/60 p-5 transition-colors hover:border-signal-teal/50"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${TRACK_DOT_CLASS[trackVariant(track.name)]}`}
                  aria-hidden="true"
                />
                <h2 className="font-display text-base font-medium text-paper-50 group-hover:text-signal-teal">
                  {track.name}
                </h2>
              </div>
              {track.description && <p className="text-sm text-paper-400">{track.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
