import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-teal">404</p>
      <h1 className="font-display text-2xl font-semibold text-paper-50">Page not found</h1>
      <p className="max-w-sm text-sm text-paper-400">
        There's no route here. Head back to the roles, skills, or career path finder.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-md border border-ink-500 bg-ink-700 px-4 py-1.5 text-sm font-medium text-paper-50 hover:border-signal-teal hover:text-signal-teal"
      >
        Back home
      </Link>
    </div>
  );
}
