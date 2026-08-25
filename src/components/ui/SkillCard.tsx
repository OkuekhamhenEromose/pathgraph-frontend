import { Link } from "react-router-dom";
import { Badge } from "./Badge";

interface SkillCardProps {
  id: string;
  name: string;
  category: string;
  difficulty?: number | null;
  /** e.g. "required" / "preferred" from a REQUIRES relationship, or a proficiency level */
  meta?: string | null;
  metaVariant?: "teal" | "coral" | "neutral";
}

export function SkillCard({ id, name, category, difficulty, meta, metaVariant = "neutral" }: SkillCardProps) {
  return (
    <Link
      to={`/skills/${encodeURIComponent(id)}`}
      className="group flex items-center justify-between gap-3 rounded-lg border border-ink-700 bg-ink-800/60 px-4 py-3 transition-colors hover:border-signal-teal/50"
    >
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-medium text-paper-50 group-hover:text-signal-teal">
          {name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">{category}</Badge>
          {typeof difficulty === "number" && <Badge variant="neutral">difficulty {difficulty}</Badge>}
        </div>
      </div>
      {meta && <Badge variant={metaVariant}>{meta}</Badge>}
    </Link>
  );
}
