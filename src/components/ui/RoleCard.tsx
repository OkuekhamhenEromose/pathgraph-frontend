import { Link } from "react-router-dom";
import type { JobRoleBase } from "../../types";
import { Badge } from "./Badge";

interface RoleCardProps {
  role: JobRoleBase;
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <Link
      to={`/roles/${encodeURIComponent(role.id)}`}
      className="group flex flex-col gap-2 rounded-lg border border-ink-700 bg-ink-800/60 p-4 transition-colors hover:border-signal-teal/50"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-paper-400">L{role.level}</span>
        <Badge variant="neutral">{role.category}</Badge>
      </div>
      <h3 className="font-display text-sm font-medium text-paper-50 group-hover:text-signal-teal">
        {role.title}
      </h3>
      {role.description && <p className="line-clamp-2 text-xs text-paper-400">{role.description}</p>}
      {role.typical_years_experience !== null && role.typical_years_experience !== undefined && (
        <p className="mt-1 font-mono text-[11px] text-paper-400">
          ~{role.typical_years_experience} yrs experience
        </p>
      )}
    </Link>
  );
}
