import { Link } from "react-router-dom";

const FEATURES = [
  {
    to: "/roles",
    title: "Roles",
    description: "Browse job roles by track and level, and see what each one requires.",
  },
  {
    to: "/skills",
    title: "Skills",
    description: "Explore individual skills and the prerequisite chains that lead to them.",
  },
  {
    to: "/tracks",
    title: "Career Tracks",
    description: "See the Individual Contributor and Management ladders side by side.",
  },
  {
    to: "/people",
    title: "People",
    description: "Look up a person's current role and the skills they hold today.",
  },
  {
    to: "/career-path",
    title: "Career Path Finder",
    description: "Shortest promotion path between two roles — a multi-hop graph traversal.",
    highlight: "Multi-hop",
  },
  {
    to: "/skill-gaps",
    title: "Skill Gap Analyzer",
    description: "What's missing for a person to reach a target role, prerequisites included.",
    highlight: "Graph-native",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-signal-teal">
          Career Path Navigator
        </p>
        <h1 className="max-w-2xl font-display text-3xl font-semibold text-paper-50 sm:text-4xl">
          Careers aren't rows in a table. They're paths through a graph.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-paper-400 sm:text-base">
          PathGraph models roles, skills, and people as a connected graph in CognoDB. Instead of
          querying flat tables, it answers relationship questions directly: what's the shortest
          route from this role to that one, and what does a specific person still need to learn to
          get there.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Link
            key={feature.to}
            to={feature.to}
            className="group flex flex-col gap-2 rounded-lg border border-ink-700 bg-ink-800/60 p-5 transition-colors hover:border-signal-teal/50"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-medium text-paper-50 group-hover:text-signal-teal">
                {feature.title}
              </h2>
              {feature.highlight && (
                <span className="rounded-full border border-signal-teal/40 bg-signal-teal/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-signal-teal">
                  {feature.highlight}
                </span>
              )}
            </div>
            <p className="text-sm text-paper-400">{feature.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
