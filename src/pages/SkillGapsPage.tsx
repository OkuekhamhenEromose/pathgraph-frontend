import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { rolesApi, personsApi, pathsApi } from "../lib/api";
import { useApiQuery } from "../hooks/useapiquery";
import { ApiError } from "../lib/api-client";
import type { SkillGapResponse } from "../types";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import { ErrorState } from "../components/states/ErrorState";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function SkillGapsPage() {
  const personsFetcher = useCallback(() => personsApi.list(), []);
  const persons = useApiQuery(personsFetcher, []);

  const rolesFetcher = useCallback(() => rolesApi.list(), []);
  const roles = useApiQuery(rolesFetcher, []);

  const [personId, setPersonId] = useState("");
  const [targetRoleId, setTargetRoleId] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<SkillGapResponse | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | Error | null>(null);

  async function runAnalysis(person: string, role: string) {
    if (!person || !role) return;
    setSubmitStatus("loading");
    setSubmitError(null);
    try {
      const gaps = await pathsApi.skillGaps(person, role);
      setResult(gaps);
      setSubmitStatus("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error("Something went wrong."));
      setSubmitStatus("error");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void runAnalysis(personId, targetRoleId);
  }

  const ready = persons.status === "success" && roles.status === "success" && persons.data && roles.data;

  return (
    <div>
      <PageHeader
        eyebrow="Relationally awkward query"
        title="Skill Gap Analyzer"
        description="What does this person still need for a target role — including prerequisites they're missing for skills they don't have yet. One graph traversal; in SQL this is nested recursive CTEs and anti-joins."
      />

      {(persons.status === "loading" || roles.status === "loading") && <LoadingState label="Loading people and roles…" />}
      {persons.status === "error" && <ErrorState error={persons.error} onRetry={persons.refetch} />}
      {roles.status === "error" && <ErrorState error={roles.error} onRetry={roles.refetch} />}

      {ready && (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-paper-400">
              Person
            </span>
            <select
              required
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-paper-50 focus-visible:outline-none"
            >
              <option value="" disabled>
                Select a person…
              </option>
              {persons.data!.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex-1 text-sm">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-paper-400">
              Target role
            </span>
            <select
              required
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-paper-50 focus-visible:outline-none"
            >
              <option value="" disabled>
                Select a role…
              </option>
              {roles.data!.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} (L{role.level})
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitStatus === "loading" || !personId || !targetRoleId}
            className="rounded-md bg-signal-teal px-5 py-2 text-sm font-semibold text-ink-900 transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Analyze gaps
          </button>
        </form>
      )}

      {submitStatus === "loading" && <LoadingState label="Walking required skills and prerequisites…" />}
      {submitStatus === "error" && (
        <ErrorState error={submitError} onRetry={() => runAnalysis(personId, targetRoleId)} />
      )}

      {submitStatus === "success" && result && (
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-ink-700 bg-ink-800/40 px-4 py-3">
            <span className="text-sm text-paper-200">
              Current role:{" "}
              <span className="font-medium text-paper-50">
                {result.current_role ? result.current_role.title : "None on file"}
              </span>
            </span>
            <span className="text-paper-400">·</span>
            <span className="text-sm text-paper-200">
              <span className="font-medium text-paper-50">{result.total_missing}</span> skill
              {result.total_missing === 1 ? "" : "s"} missing
            </span>
          </div>

          {result.missing_skills.length === 0 ? (
            <EmptyState
              title="No gaps found"
              description="This person already has every required skill for the target role."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {result.missing_skills.map((skill) => (
                <li key={skill.id} className="rounded-lg border border-ink-700 bg-ink-800/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={`/skills/${encodeURIComponent(skill.id)}`}
                      className="font-display text-sm font-medium text-paper-50 hover:text-signal-teal"
                    >
                      {skill.name}
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="neutral">{skill.category}</Badge>
                      <Badge variant={skill.required_level === "required" ? "coral" : "teal"}>
                        {skill.required_level}
                      </Badge>
                    </div>
                  </div>

                  {skill.prerequisites.length > 0 && (
                    <div className="mt-3 border-t border-ink-700 pt-3">
                      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-paper-400">
                        Also missing {skill.prerequisite_depth} prerequisite
                        {skill.prerequisite_depth === 1 ? "" : "s"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.prerequisites.map((prereq) => (
                          <Link key={prereq.id} to={`/skills/${encodeURIComponent(prereq.id)}`}>
                            <Badge variant="neutral">{prereq.name}</Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
