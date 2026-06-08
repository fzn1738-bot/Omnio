# Omnio

Omnio is an AI voice agent platform that handles phone calls, scheduling, follow-ups, and sales leads — backed by self-healing ops agents — with a multi-company workspace where each company can switch between solution containers/configurations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed the agent roster (9 product + 8 ops agents)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- Workspace state (companies/verticals/containers/solution packs) lives in `artifacts/voice-platform/src/lib/workspace.tsx` (React context, frontend-only for now — not yet persisted to the DB).
- Container scoping of dashboard data is derived deterministically in `src/lib/scope.ts` because the backend tables don't carry a `containerId` yet; replace with real query filters once they do.

## Product

- **Two agent layers** (Agent Monitor page): *product* agents that earn revenue (Voice, Intent Router, Scheduling, Follow-up, Inventory & Pricing, Knowledge/RAG, CRM, Notification, Escalation) and *ops* agents that watch & repair them, shown as a self-healing pipeline (Log Collector → Triage → Diagnosis → Fix Planner → Validation → **Approval Gate** (human-in-the-loop) → Executor → Verifier).
- **Multi-company workspace**: companies are organized and sorted into business **verticals** (Healthcare, Automotive, Home & Field Services, Professional Services, Hospitality & Wellness). Switch company + **container** (a deployable config of the agent stack: prod/staging/sandbox) from the top ribbon; the active scope re-scopes the dashboard.
- **Solution packs** (Solutions page): per-container toggleable capability modules — core packs (Scheduling, Follow-ups, Knowledge Base, CRM Sync) plus niche packs (Pre-screening, Prior Authorization, Inventory Sync, etc.).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
