---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
project_type: nextjs
version: 1.0.0
framework_version: "16.1"
last_updated: 2026-09-14
---

# Event Spark

Self-contained event platform (a faithful rebuild of the *eventspark* Lovable template): organizers build events, publish branded registration pages, manage attendees and check-ins, and read analytics; attendees register without an account and get a QR ticket. Runs with zero backend — all state persists in the browser.

**Tech Stack**: Next.js 16 (App Router, Turbopack), TypeScript 5 (strict), Tailwind CSS 4 (CSS-first tokens), shadcn/ui + Radix, Zustand 5 (persisted), Recharts, framer-motion 12, Bun 1.x

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** — Never make surface-level assumptions; mine explicit requirements, implicit needs, ambiguities.
2. **PLAN** — Structured roadmap; present for confirmation before coding.
3. **VALIDATE** — Explicit user approval checkpoint.
4. **IMPLEMENT** — Modular, testable increments; documentation alongside code.
5. **VERIFY** — Run `bun run lint`, typecheck, and exercise the affected golden path in a browser before declaring done.
6. **DELIVER** — Complete handoff; document challenges, solutions, and next steps.

### Project-Specific Principles

- **Fidelity to the reference design**: layout, copy, and tokens mirror the original template. Visual changes need a reason.
- **Zero-backend contract**: everything runs client-side. Introducing a server dependency is a breaking architectural change — flag it, don't just do it.
- **Local-first state**: one store, one persistence key, deterministic seed data. No component fetches; components select from the store.

## Implementation Standards

### Next.js 16 Specific

- App Router with exactly **one user route** (`src/app/page.tsx`). All "pages" are views inside the SPA — never add `src/app/*/page.tsx` files.
- In-app navigation is **hash-based** (`useHashRoute()` / `navigate()` from `src/lib/spa/router.tsx`). Deep links look like `#/register/<slug>`. Do not use `next/link`, `router.push`, or `useSearchParams`.
- Fonts load via `next/font/google` and expose CSS variables (`--font-bricolage`, `--font-dmsans`) consumed by Tailwind's `--font-display`/`--font-sans` theme keys.
- Metadata (title/OG) is owned by `src/app/layout.tsx`.

### TypeScript Strict Mode

- `strict` is on; never introduce `any` — use `unknown` and narrow.
- Domain models live only in `src/lib/spa/types.ts`; prefer `interface` for entity shapes, `type` for unions.
- Early returns over nested conditionals; hooks before any early return.

### Tailwind CSS 4 (CSS-first)

- Design tokens are defined in `src/app/globals.css` under `@theme inline` + `:root`/`.dark`. Add or change tokens **there**, not in `tailwind.config.ts` (legacy fallback only).
- Brand primary: `hsl(340 75% 58%)`. Success: `hsl(172 50% 40%)`. Radius base: `0.5rem`.
- Use semantic utilities (`bg-background`, `text-muted-foreground`, `text-primary`) — never raw hex in components except the seeded accent colors stored on events.

### React / State (Zustand)

- All app state flows through `useSparkStore` (`src/lib/spa/store.ts`) with `persist` middleware on key `eventspark-store-v1`.
- **Selectors must return stable references** — never `.filter()`/`.map()` inside a selector (causes the "getSnapshot should be cached" infinite loop). Select raw slices; derive with `useMemo`.
- Server state vs client state distinction doesn't apply here — there is no server; treat the store as the single source of truth.
- Async actions (signUp/signIn) use Web Crypto SHA-256 (`sha256Hex` in `utils.ts`) before persisting credentials.

### shadcn/ui Usage

- Use existing primitives from `src/components/ui/` — Button, Input, Label, Tabs, Switch, AlertDialog, Textarea, sonner Toaster. Wrap, don't rebuild.
- Buttons are pill-shaped by design; the default variant is ink (`bg-foreground`), brand variant is `primary`.
- Toasts: `import { toast } from "sonner"` (the Toaster is mounted in the root layout).

## Development Workflow

### Environment Setup

```bash
bun install
bun run dev        # http://localhost:3000
```

Optional database scaffold (unused by the app): `bun run db:push`.

### Build Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Dev server (port 3000, Turbopack) |
| `bun run lint` | ESLint — required to pass before delivery |
| `bunx tsc --noEmit` | Type check |
| `bun run build` | Production build (only on request) |
| `bun run start` | Serve production build |

### Demo credentials

`demo@eventspark.app` / `SparkDemo2026!` — seeded automatically on first load; "Reset demo data" lives in Settings.

## Testing Strategy

- **No automated test suite exists yet** (documented gap — see `Project_Architecture_Document.md` §11).
- Until one lands: after any change, run `bun run lint` + `bunx tsc --noEmit`, then manually exercise the affected flow in a browser:
  1. Landing renders with rotating headline and 4 event cards.
  2. Demo sign-in → Overview stats and event list.
  3. Create event (4 steps) → publish → appears in Events.
  4. Open a public registration page → register → ticket with QR renders.
  5. Check-in scanner accepts the ticket ID.
- When adding tests: co-locate as `*.test.ts(x)` and prefer Vitest + Testing Library; pure functions in `src/lib/spa/utils.ts` and store reducers are the first candidates.

## Code Quality Standards

```bash
bun run lint      # zero errors required
bunx tsc --noEmit # zero errors required
```

- Comments explain *why*, not *what*. No commented-out code, no placeholder values, no `TODO` without a linked issue.
- Dead dependencies and speculative abstractions are removed, not parked.

## Git & Version Control

- Branches: short-lived `feat/*`, `fix/*`, `chore/*` merged into `main`.
- Conventional Commits, atomic units (`feat: tickets tier editor`, not "updates").
- Never force-push `main`. The remote has push protection — **no secrets in history, ever** (a leaked SSH key once required a `git filter-repo` rewrite; if a push is rejected with GH013, rewrite history rather than unblocking the secret).

## Error Handling & Debugging

- User-facing errors render inline with `role="alert"`; transient feedback uses sonner toasts.
- Store actions return typed results (`{ ok: false; error }`) instead of throwing.
- If the page whitescreens with "Application error", check the browser console for the Zustand selector loop (see Implementation Standards) — it is the most common crash source.
- If styles regress after CSS edits, clear the Turbopack cache: `rm -rf .next && bun run dev`.

## Project-Specific Standards

### Architecture

Layered: `app shell (Next.js) → SPA router (hash) → feature views → shared UI (shadcn) → domain layer (types/store/seed/utils)`. Dependencies point downward only.

### API / Routing

No REST API. Routes (hash paths): `#/`, `#/auth`, `#/dashboard[/events|attendees|analytics|integrations|settings]`, `#/dashboard/events/create`, `#/dashboard/events/:id`, `#/register/:slug`, `#/ticket/:registrationId`. Unknown paths render the 404 view.

### Data Layer

- Entities: `AppUser`, `EventItem` (+ `TicketTier`, `RegistrationFormField`), `Registration`, `IntegrationState`, `DailyMetric`.
- Persistence: `persist` middleware → `safeStorage()` (localStorage with memory fallback), `partialize` excludes transient flags, store versioned (`eventspark-store-v1`) with migration hook.
- Seed data is deterministic (seeded PRNG) to keep SSR/CSR hydration consistent.

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | Prisma SQLite path (scaffold only, unused) | No — defaults into `db/` |

## Anti-Patterns to Avoid

- New Next.js routes/pages for app views (breaks the single-route contract).
- `.filter()` inside Zustand selectors (infinite render loop).
- Raw `localStorage` access outside `safeStorage`.
- Hand-editing `package.json` dependencies or lockfiles.
- Plaintext password storage, even in demo code.
- Bypassing the typed domain models with ad-hoc object literals.
