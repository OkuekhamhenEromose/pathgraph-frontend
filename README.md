# PathGraph — Career Path Navigator (Frontend)

React + TypeScript + Vite client for **PathGraph**, a graph-native career path explorer backed by **CognoDB**.

🔗 **Live app:** _add your Vercel URL here_
🔗 **Backend repo:** https://github.com/OkuekhamhenEromose/pathgraph-backend — see it for the data model, "why a graph database," and full Cypher query details
🔗 **Backend API:** https://pathgraph-backend.onrender.com/docs

> Built for the Wexa AI CognoDB take-home assignment. This README covers the client only.

---

## Setup

```bash
git clone https://github.com/OkuekhamhenEromose/pathgraph-frontend.git
cd pathgraph-frontend
npm install
cp .env.example .env.local   # edit VITE_API_URL if the backend isn't on localhost:8000
npm run dev
```

The backend's CORS is restricted to a single `FRONTEND_URL`. Make sure that value (in the backend's own `.env`) matches wherever this app is actually served from (`http://localhost:5173` by default).

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve the production build locally
npm run lint
```

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- No state-management or data-fetching library — a small typed fetch hook is enough for this app's read-heavy, uncached screens (see below)

## Architecture

```
User
 ↓
React Router routes (src/App.tsx)
 ↓
AppShell (nav + DbStatusBadge) → page component
 ↓
useApiQuery hook  ──or──  manual submit handler (career-path / skill-gaps forms)
 ↓
lib/api.ts (rolesApi, skillsApi, tracksApi, personsApi, pathsApi)
 ↓
lib/api-client.ts (apiFetch → fetch, normalizes every error into ApiError)
 ↓
FastAPI (pathgraph-backend) → GraphRepository → Neo4j driver → CognoDB
```

- **`lib/api-client.ts`** — the only place that calls `fetch`. Normalizes the backend's `{error:{code,message}}` envelope, FastAPI's separate `422` validation shape, and outright network failure into one `ApiError` type with `.isDatabaseUnavailable` / `.isNotFound`.
- **`lib/api.ts`** — one typed function per backend endpoint. Pages never call `apiFetch` directly.
- **`hooks/useapiquery.ts`** — a small typed fetch hook (loading/success/empty/error + a `refetch`), used for the get-on-mount screens. Deliberately not TanStack Query: nothing in this app is cached or shared across routes, and there are no mutations to invalidate against.
- **`components/states/`** — `LoadingState`, `EmptyState`, `ErrorState`. Every screen backed by an API call renders one of these plus its data — never just the data.
- **`components/ui/`** — `RoleCard`, `SkillCard`, `PathChain` (the multi-hop visualizer, reused for both career-path promotions and skill prerequisite chains), `Badge`, `PageHeader`.

## Feature tour

| Route | Backend endpoint(s) | Demonstrates |
|---|---|---|
| `/roles`, `/roles/:id` | `GET /roles`, `/roles/{id}` | basic entity browsing |
| `/skills`, `/skills/:id` | `GET /skills`, `/skills/{id}` | **multi-hop**: `PREREQUISITE_FOR*1..5` prerequisite chains |
| `/tracks`, `/tracks/:id` | `GET /tracks`, `/tracks/{id}` | grouping roles by track |
| `/people`, `/people/:id` | `GET /persons`, `/persons/{id}`, `/persons/{id}/skills` | two endpoints composed on one page |
| `/career-path` | `GET /paths/career` | **multi-hop**: `shortestPath(PROMOTES_TO*1..10)` |
| `/skill-gaps` | `GET /paths/skill-gaps/{person_id}` | **relationally awkward query**: missing required skills + their missing prerequisites, in one traversal |

A persistent badge in the nav (`DbStatusBadge`) polls `GET /health` every 30s so database availability is visible before any query fails, not just after.

## Manual verification checklist

Backend running locally on `:8000`, frontend on `:5173`:

1. **Happy path** — open `/`, click through Roles → a role detail → a required skill → its prerequisite chain. Confirm each hop is a real navigation, not a re-render of cached data.
2. **Loading state** — throttle network (DevTools → Network → Slow 3G) and reload `/skills`; confirm the spinner renders before data.
3. **Empty state** — pick a skill with no `PREREQUISITE_FOR` edges pointing to it; confirm the "No prerequisites" empty state, not a blank list.
4. **Multi-hop traversal** — `/career-path`, pick two roles on the same track several levels apart; confirm the chain renders every intermediate role, not just the endpoints, and `num_steps` matches the number of connectors drawn.
5. **Relationally awkward query** — `/skill-gaps`, pick a person missing several required skills; confirm skills with missing prerequisites show their prerequisite chips.
6. **Not-found path** — `/career-path` with two roles on different tracks; confirm the "No path found" empty state (a 404 from the backend), not a raw error banner.
7. **Database unavailable** — stop the backend's CognoDB connection (or the backend itself) and reload any list page; confirm the "Graph data is temporarily unavailable" error state and that `DbStatusBadge` in the nav flips to degraded within one poll interval.
8. **Responsive** — check `/career-path` and `/skills/:id` at a narrow (mobile) viewport; the `PathChain` connector chain should wrap instead of overflowing.

## Environment variables

Only `VITE_API_URL` is used, and it's safe to expose to the browser — it's just the backend's public base URL, not a secret. CognoDB's own URI and password live only in the backend's `.env` and are never referenced here.

| Variable | Example | Notes |
|---|---|---|
| `VITE_API_URL` | `https://pathgraph-backend.onrender.com` | No trailing slash. Baked in at build time — changing it requires a redeploy, not just a dashboard edit. |

## Deployment

Deployed on **Vercel**:

- Framework preset: Vite (auto-detected) — build command `npm run build`, output directory `dist`.
- `VITE_API_URL` set in Vercel → Project Settings → Environment Variables, pointing at the live Render backend.
- After changing `VITE_API_URL`, a fresh deploy is required since Vite inlines env vars at build time.

## Screenshots

_Add screenshots of the home page, a role detail page, the career-path multi-hop chain, and the skill-gaps page here before submission._

---

Built by [Okuekhamhen Eromose](https://github.com/OkuekhamhenEromose) for the Wexa AI CognoDB take-home assignment.
