import { useCallback } from "react";
import { skillsApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { SkillCard } from "../components/ui/SkillCard";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

export function SkillsPage() {
  const fetcher = useCallback(() => skillsApi.list(), []);
  const { data, status, error, refetch } = useApiQuery(fetcher, []);

  return (
    <div>
      <PageHeader
        eyebrow="Skill nodes"
        title="Skills"
        description="Every skill in the graph, grouped by category. Open one to see its prerequisite chain."
      />

      {status === "loading" && <LoadingState label="Loading skills…" />}
      {status === "error" && <ErrorState error={error} onRetry={refetch} />}
      {status === "empty" && (
        <EmptyState title="No skills found" description="The graph doesn't have any Skill nodes yet." />
      )}
      {status === "success" && data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((skill) => (
            <SkillCard
              key={skill.id}
              id={skill.id}
              name={skill.name}
              category={skill.category}
              difficulty={skill.difficulty}
            />
          ))}
        </div>
      )}
    </div>
  );
}
