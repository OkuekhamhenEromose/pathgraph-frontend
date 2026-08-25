import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { skillsApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { PathChain } from "../components/ui/PathChain";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

export function SkillDetailPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const fetcher = useCallback(() => skillsApi.get(skillId!), [skillId]);
  const { data, status, error, refetch } = useApiQuery(fetcher, [skillId], () => false);

  if (status === "loading") return <LoadingState label="Loading skill…" />;
  if (status === "error") return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <PageHeader
        eyebrow={data.category}
        title={data.name}
        description={data.description ?? undefined}
        action={
          typeof data.difficulty === "number" ? (
            <Badge variant="neutral">difficulty {data.difficulty}</Badge>
          ) : undefined
        }
      />

      <h2 className="mb-3 font-display text-sm font-medium uppercase tracking-wide text-paper-400">
        Prerequisite chains
      </h2>

      {data.prerequisite_paths.length === 0 ? (
        <EmptyState
          title="No prerequisites"
          description="Nothing in the graph leads to this skill — it's a starting point on its own."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {data.prerequisite_paths.map((prereqPath, i) => (
            <div key={i} className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-800/40 p-4">
              <p className="mb-3 font-mono text-[11px] text-paper-400">
                {prereqPath.depth}-hop chain
              </p>
              <PathChain
                nodes={prereqPath.path.map((node) => ({
                  key: node.id,
                  label: node.name,
                  sublabel: node.category,
                  href: `/skills/${encodeURIComponent(node.id)}`,
                }))}
              />
            </div>
          ))}
        </div>
      )}

      <Link to="/skills" className="mt-8 inline-block text-sm text-signal-teal hover:underline">
        ← Back to all skills
      </Link>
    </div>
  );
}
