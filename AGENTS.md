# AGENTS.md

Guidance for AI coding agents working in this repository. Every line answers: "would an agent likely get this wrong without help?"

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Install | `bun install` | Bun 1.x is the package manager — do not mix with npm lockfiles. |
| Dev server | `bun run dev` | Port 3000, Turbopack. Runs from repo root. |
| Lint | `bun run lint` | ESLint (`eslint .`) — **must pass** before finishing any change. |
| Typecheck | `bunx tsc --noEmit` | TS 5 strict mode. |
| Production build | `bun run build` | Only when explicitly asked — dev verification uses `lint` + browser. |

There is no test suite. If a change touches store logic, verify the golden path manually in a browser (sign in → events → register → ticket).

## Architecture facts you cannot guess from filenames

- **Single-route SPA.** Everything user-visible is served from `src/app/page.tsx` → `src/components/spa/app.tsx`. There are no other Next.js routes. In-app navigation is **hash-based** (`#/dashboard/events`) via `src/lib/spa/router.tsx` — use `navigate(path)` and `useHashRoute()`, never `next/link` or `router.push`.
- **State lives in one Zustand store** (`src/lib/spa/store.ts`) persisted to `localStorage` key `eventspark-store-v1`. Actions are defined on the store; derived data uses the exported `select*` helpers or `useMemo`.
- **All domain types live in `src/lib/spa/types.ts`.** Change it first, then fix consumers — never inline duplicate shapes.
- **Design tokens are CSS-first** (Tailwind v4 `@theme inline` in `src/app/globals.css`). Do not add colors to `tailwind.config.ts`; that file is a legacy fallback. Brand pink is `--primary: hsl(340 75% 58%)`.
- `prisma/` and the `db:*` scripts are scaffold leftovers; the app does not use a database. Don't wire Prisma in unless the task says so.

## Hard rules (violations have caused real bugs here)

1. **Zustand selectors must return stable references.** `useSparkStore((s) => s.registrations.filter(...))` causes an infinite render loop ("getSnapshot should be cached"). Select the raw slice, then `useMemo` the derived value inside the component.
2. **Keep hooks unconditional.** Register all `useState`/`useMemo` before any `if (!event) return …` early exit (see `register-view.tsx` for the pattern).
3. **Buttons are pills.** The shared Button component is already styled; don't invent new button styles — use variants `default | primary | outline | ghost | destructive`.
4. **No `localStorage` access outside the store's safe-storage wrapper.** Restricted browsers throw on direct access.
5. **Passwords are hashed with `sha256Hex()` (Web Crypto) before storage.** Never persist plaintext, even for demo data.
6. **Do not edit `package.json` dependencies by hand** — use `bun add`/`bun remove` so `bun.lock` stays consistent.
7. Don't restate code in comments; comment the *why* only.

## Conventions

- Components: PascalCase files under `src/components/spa/<feature>/`; one feature per folder.
- Domain modules: `src/lib/spa/` — `types.ts` (models), `store.ts` (state+actions), `seed.ts` (demo data), `utils.ts` (pure helpers), `copy.ts` (landing copy).
- Server/client split: everything product-facing is `"use client"`; only `layout.tsx`/`page.tsx` shell is server-rendered.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`), one logical change per commit.

## Demo data (useful for testing)

- Organizer account: `demo@eventspark.app` / `SparkDemo2026!` (seeded on first load).
- Five events are seeded (4 published, 1 draft) with deterministic registrations and 30-day metrics.
- "Reset demo data" in Settings restores the seed state.
