/**
 * Domain API functions — one per backend endpoint.
 *
 * This is the layer the master prompt calls "API contract first": every
 * function here maps 1:1 to a route in pathgraph-backend/app/routers/*.py.
 * Nothing here invents a param, a path, or a field — see the docstring on
 * each function for the exact backend source it mirrors.
 *
 * Pages never call apiFetch() directly; they call these.
 */

import { apiFetch, buildQuery } from "./api-client";
import type {
  JobRoleBase,
  JobRoleResponse,
  SkillBase,
  SkillDetailResponse,
  CareerTrackBase,
  CareerTrackResponse,
  PersonSummary,
  PersonSkill,
  CareerPathResponse,
  SkillGapResponse,
} from "../types";

const V1 = "/api/v1";

// ── Roles — app/routers/roles.py ───────────────────────────────────────
export const rolesApi = {
  /** GET /api/v1/roles */
  list: () => apiFetch<JobRoleBase[]>(`${V1}/roles`),
  /** GET /api/v1/roles/{role_id} — role + track_name + required_skills */
  get: (roleId: string) => apiFetch<JobRoleResponse>(`${V1}/roles/${encodeURIComponent(roleId)}`),
};

// ── Skills — app/routers/skills.py ─────────────────────────────────────
export const skillsApi = {
  /** GET /api/v1/skills */
  list: () => apiFetch<SkillBase[]>(`${V1}/skills`),
  /** GET /api/v1/skills/{skill_id} — skill + prerequisite_paths (multi-hop, 1..5) */
  get: (skillId: string) => apiFetch<SkillDetailResponse>(`${V1}/skills/${encodeURIComponent(skillId)}`),
};

// ── Tracks — app/routers/tracks.py ─────────────────────────────────────
export const tracksApi = {
  /** GET /api/v1/tracks */
  list: () => apiFetch<CareerTrackBase[]>(`${V1}/tracks`),
  /** GET /api/v1/tracks/{track_id} — track + roles in that track */
  get: (trackId: string) => apiFetch<CareerTrackResponse>(`${V1}/tracks/${encodeURIComponent(trackId)}`),
};

// ── Persons — app/routers/persons.py ───────────────────────────────────
export const personsApi = {
  /** GET /api/v1/persons */
  list: () => apiFetch<PersonSummary[]>(`${V1}/persons`),
  /** GET /api/v1/persons/{person_id} */
  get: (personId: string) => apiFetch<PersonSummary>(`${V1}/persons/${encodeURIComponent(personId)}`),
  /** GET /api/v1/persons/{person_id}/skills */
  skills: (personId: string) => apiFetch<PersonSkill[]>(`${V1}/persons/${encodeURIComponent(personId)}/skills`),
};

// ── Paths — app/routers/paths.py ────────────────────────────────────────
export const pathsApi = {
  /**
   * GET /api/v1/paths/career?from_role_id=&to_role_id=
   * Multi-hop traversal: shortestPath over PROMOTES_TO (1..10 hops).
   * 404s when no path exists (different track, or unreachable).
   */
  careerPath: (fromRoleId: string, toRoleId: string) =>
    apiFetch<CareerPathResponse>(
      `${V1}/paths/career${buildQuery({ from_role_id: fromRoleId, to_role_id: toRoleId })}`,
    ),
  /**
   * GET /api/v1/paths/skill-gaps/{person_id}?target_role_id=
   * Relationally-awkward query: missing required skills for a target role,
   * plus each missing skill's own missing prerequisites, in one traversal.
   */
  skillGaps: (personId: string, targetRoleId: string) =>
    apiFetch<SkillGapResponse>(
      `${V1}/paths/skill-gaps/${encodeURIComponent(personId)}${buildQuery({ target_role_id: targetRoleId })}`,
    ),
};
