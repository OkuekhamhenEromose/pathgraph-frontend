import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { rolesApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { trackVariant } from "../components/ui/badge-utils";
import { Badge } from "../components/ui/Badge";
import { SkillCard } from "../components/ui/SkillCard";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

export function RoleDetailPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const fetcher = useCallback(() => rolesApi.get(roleId!), [roleId]);
  const { data, status, error, refetch } = useApiQuery(
    fetcher,
    [roleId],
    (role) => !role.required_skills || role.required_skills.length === 0,
  );

  if (status === "loading") return <LoadingState label="Loading role…" />;
  if (status === "error") return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <PageHeader
        eyebrow={`Level ${data.level} · ${data.category}`}
        title={data.title}
        description={data.description ?? undefined}
        action={
          data.track_name ? <Badge variant={trackVariant(data.track_name)}>{data.track_name}</Badge> : undefined
        }
      />

      {data.typical_years_experience != null && (
        <p className="mb-6 font-mono text-xs text-paper-400">
          Typically reached after ~{data.typical_years_experience} years of experience.
        </p>
      )}

      <h2 className="mb-3 font-display text-sm font-medium uppercase tracking-wide text-paper-400">
        Required skills
      </h2>

      {status === "empty" ? (
        <EmptyState
          title="No skills recorded for this role"
          description="This role doesn't have any REQUIRES relationships to Skill nodes yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.required_skills?.map((skill) => (
            <SkillCard
              key={skill.id}
              id={skill.id}
              name={skill.name}
              category={skill.category}
              difficulty={skill.difficulty}
              meta={skill.requirement_level ?? undefined}
              metaVariant={skill.requirement_level === "required" ? "coral" : "teal"}
            />
          ))}
        </div>
      )}

      <Link to="/roles" className="mt-8 inline-block text-sm text-signal-teal hover:underline">
        ← Back to all roles
      </Link>
    </div>
  );
}
