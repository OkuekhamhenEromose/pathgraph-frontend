import { NavLink, Outlet } from "react-router-dom";
import { DbStatusBadge } from "./DbStatusBadge";

const NAV_LINKS = [
  { to: "/roles", label: "Roles" },
  { to: "/skills", label: "Skills" },
  { to: "/tracks", label: "Tracks" },
  { to: "/people", label: "People" },
  { to: "/career-path", label: "Career Path" },
  { to: "/skill-gaps", label: "Skill Gaps" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-ink-700 text-signal-teal" : "text-paper-200 hover:text-signal-teal"
  }`;
}

export function AppShell() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-ink-700 bg-ink-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-display text-base font-semibold text-paper-50">
            <span className="h-2.5 w-2.5 rounded-full bg-signal-teal" aria-hidden="true" />
            PathGraph
          </NavLink>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <DbStatusBadge />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
