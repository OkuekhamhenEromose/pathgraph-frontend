import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { personsApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { PageHeader } from "../components/ui/PageHeader";
import { SkillCard } from "../components/ui/SkillCard";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

export function PersonDetailPage() {
  const { personId } = useParams<{ personId: string }>();

  const personFetcher = useCallback(() => personsApi.get(personId!), [personId]);
  const person = useApiQuery(personFetcher, [personId], () => false);

  const skillsFetcher = useCallback(() => personsApi.skills(personId!), [personId]);
  const skills = useApiQuery(skillsFetcher, [personId]);

  if (person.status === "loading") return <LoadingState label="Loading person…" />;
  if (person.status === "error") return <ErrorState error={person.error} onRetry={person.refetch} />;
  if (!person.data) return null;

  const currentRole = person.data.current_role;

  return (
    <div>
      <PageHeader
        eyebrow={currentRole ? String(currentRole.title) : "No current role"}
        title={String(person.data.name)}
        description={typeof person.data.bio === "string" ? person.data.bio : undefined}
        action={
          currentRole ? (
            <Link
              to={`/roles/${encodeURIComponent(String(currentRole.id))}`}
              className="rounded-md border border-ink-500 bg-ink-700 px-3 py-1.5 text-sm font-medium text-paper-50 hover:border-signal-teal hover:text-signal-teal"
            >
              View current role →
            </Link>
          ) : undefined
        }
      />

      <h2 className="mb-3 font-display text-sm font-medium uppercase tracking-wide text-paper-400">
        Skills held
      </h2>

      {skills.status === "loading" && <LoadingState label="Loading skills…" />}
      {skills.status === "error" && <ErrorState error={skills.error} onRetry={skills.refetch} />}
      {skills.status === "empty" && (
        <EmptyState
          title="No skills recorded"
          description="This person has no HAS_SKILL relationships yet."
        />
      )}
      {skills.status === "success" && skills.data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {skills.data.map((skill) => (
            <SkillCard
              key={skill.id}
              id={skill.id}
              name={skill.name}
              category={skill.category}
              difficulty={skill.difficulty}
              meta={
                typeof skill.proficiency_level === "number" ? `proficiency ${skill.proficiency_level}` : undefined
              }
              metaVariant="teal"
            />
          ))}
        </div>
      )}

      <Link to="/people" className="mt-8 inline-block text-sm text-signal-teal hover:underline">
        ← Back to all people
      </Link>
    </div>
  );
}
