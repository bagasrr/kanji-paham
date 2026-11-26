<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Global AI Agent Instructions (KanjiPaham)

## Project Architecture

This project (**KanjiPaham**) is a Japanese Kanji learning web platform comprising:

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict mode)
- **Styling:** Tailwind CSS v4, Lucide React icons (mobile-first `360px–430px` design)
- **Authentication:** NextAuth.js / Auth.js v5 (Credentials with bcrypt + Google OAuth)
- **Database & ORM:** PostgreSQL with Prisma ORM (`prisma/schema.prisma`)
- **Static & Seed Data:** Kanji/Vocab JSON datasets and KanjiVG SVGs (`public/svg/`), seeded via `scripts/`

## Repository Structure

- `src/`: Next.js App Router pages, UI components, API routes, and hooks/lib helpers
- `prisma/`: Prisma schema (`schema.prisma`) and database configuration
- `scripts/`: Data ingestion and asset download scripts (`seed-kanji.ts`, `download-svg.ts`, etc.)
- `public/`: Static assets including KanjiVG stroke SVGs (`public/svg/`) — excluded from Graphify via `.graphifyignore`
- `docs/`: Project documentation and operational specs
  - `docs/PRD.md`: Product Requirements Document
  - `docs/architecture.md`: Data strategy and technical architecture
  - `docs/design-system.md`: UI & theme specifications
  - `docs/security.md`: Authentication, password, and route protection rules
  - `docs/antigrafity.md`: Operational coding standards and commit format
  - `docs/task.md`: Master project checklist
- `log.md`: Traceability log for proposed plans, user approvals, decisions, and completion reports

## General Operating Rules

1. Read this file (`AGENTS.md`), `docs/antigrafity.md`, `docs/task.md`, and relevant documents in `docs/` before implementing changes.
2. Follow `docs/antigrafity.md` coding standards: mobile-first (`360px–430px` before `md:`/`lg:`), strict TypeScript (no `any`), modular components/hooks, and DRY code.
3. Do not invent API endpoints, request fields, response fields, or database columns outside `prisma/schema.prisma` and existing route contracts.
4. Never expose secrets, database credentials, password hashes, OAuth client secrets, or JWT/session tokens.
5. Do not claim a task is complete (`[x]`) in `docs/task.md` unless implementation and relevant checks/tests (`npm run lint`, `npm run build`, and Playwright/automated tests where applicable) have been executed and verified.
6. Update the relevant task checklist in `docs/task.md` when work is completed.
7. ALWAYS explain your plan, ask the user, and wait for user feedback before implementing changes.
8. Always record every proposed plan, question to the user, user response/approval (and rationale), and post-coding completion report in root `log.md` so all decisions and implementations are traceable.
9. **Graphify Token Maintenance (Every Session & Task):** At the start of every new session or before searching/reading the codebase, ALWAYS consult the Graphify knowledge graph (`graphify-out/GRAPH_REPORT.md` and `graphify query "<question>"` / `graphify explain "<concept>"` / `graphify path "<A>" "<B>"` against `graphify-out/graph.json`) first instead of brute-force grepping or reading raw files. After modifying any code files, run `graphify update .` (AST-only, zero API token cost) to keep the graph current.
10. **Playwright Real-Browser UI Verification:** Whenever implementing or debugging Frontend UI, layout (e.g., sticky/fixed sidebars, modals, responsive `360px–430px` views), or routing behavior, ALWAYS open and verify the live web page using **Playwright** (inspecting actual DOM bounding boxes, scroll behavior, and screenshots) in addition to running automated checks.
11. **Commit Before New Analysis:** Whenever previous completed/verified changes are still uncommitted in the working tree, commit them cleanly to Git (using `type(scope): concise description` per `docs/antigrafity.md`) **before** analyzing or starting a new task/request from the user.
12. Never run destructive Git, database, or filesystem operations without explicit user confirmation.

## Completion Report

At the conclusion of each task, report:

- What was implemented
- Files created or modified
- Automated tests / checks executed and their results
- Outstanding issues or blockers
