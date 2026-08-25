/**
 * These types mirror the backend's Pydantic response models exactly
 * (app/models/*.py in pathgraph-backend). Where the backend uses a loose
 * `dict`, we keep the type equally loose (Record<string, unknown> or a
 * minimal shape) rather than inventing fields that aren't guaranteed.
 */

// ── Roles ────────────────────────────────────────────────────────────
export interface JobRoleBase {
  id: string;
  title: string;
  level: number;
  category: string;
  description?: string | null;
  typical_years_experience?: number | null;
}

export interface RequiredSkill {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  difficulty?: number | null;
  requirement_level?: string | null; // "required" | "preferred"
  required_proficiency?: number | null;
}

export interface JobRoleResponse extends JobRoleBase {
  track_name?: string | null;
  required_skills?: RequiredSkill[] | null;
}

// ── Skills ───────────────────────────────────────────────────────────
export interface SkillBase {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  difficulty?: number | null;
}

export interface SkillPrerequisitePath {
  path: SkillBase[]; // ordered list of nodes from root prerequisite -> target
  depth: number;
}

export interface SkillDetailResponse extends SkillBase {
  prerequisite_paths: SkillPrerequisitePath[];
}

// ── Tracks ───────────────────────────────────────────────────────────
export interface CareerTrackBase {
  id: string;
  name: string;
  description?: string | null;
}

export interface CareerTrackResponse extends CareerTrackBase {
  roles?: JobRoleBase[] | null;
}

// ── Persons (backend returns loosely-typed dicts) ───────────────────
export interface PersonSummary {
  id: string;
  name: string;
  email?: string;
  years_of_experience?: number;
  location?: string;
  bio?: string;
  current_role?: JobRoleBase | null;
  [key: string]: unknown;
}

export interface PersonSkill extends SkillBase {
  proficiency_level?: number | null;
  [key: string]: unknown;
}

// ── Paths (multi-hop) ────────────────────────────────────────────────
export interface Promotion {
  typical_years?: number;
  commonness?: number;
  [key: string]: unknown;
}

export interface CareerPathResponse {
  roles: JobRoleBase[];
  promotions: Promotion[];
  num_steps: number;
}

// ── Skill gaps (relationally awkward query) ─────────────────────────
export interface SkillGapPrerequisite {
  id: string;
  name: string;
}

export interface SkillGapItem {
  id: string;
  name: string;
  category: string;
  difficulty?: number | null;
  required_level: string;
  required_proficiency?: number | null;
  prerequisites: SkillGapPrerequisite[];
  prerequisite_depth: number;
}

export interface SkillGapResponse {
  current_role?: JobRoleBase | null;
  target_role_id: string;
  missing_skills: SkillGapItem[];
  total_missing: number;
}

// ── API error envelope ({"error": {"code","message"}}) ──────────────
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
