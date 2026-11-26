# Decision & Implementation Log

## 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)

### Proposed Plan & Questions
1. **Graphify Knowledge Graph Setup:**
   - Initial corpus detection found `11,749` files (`~4,923,334` words) because `public/` contains `11,666` SVG files.
   - Asked user whether to exclude `public/` via `.graphifyignore` and build the graph across the remaining 80 files (`src/`, `docs/`, `scripts/`, root), plus optional integrations (`.gitignore`, git hooks, agent rules).
2. **`AGENTS.md` Rule Adaptation:**
   - User shared a reference `AGENTS.md` (from a multi-tenant School Digital Platform) and asked which rules apply to `kanjipaham`, then approved implementing the applicable rules into `AGENTS.md`.

### User Approval & Rationale
- **Graphify scope:** User selected adding `.graphifyignore` to ignore `public/` and building the graph for the remaining 80 project files (no `.gitignore`, git hook, or extra agent CLI install requested at this stage).
- **`AGENTS.md` adaptation:** User approved implementing the applicable rules (`Graphify` maintenance, `Playwright` UI verification, `log.md` traceability, plan-first workflow, commit-before-new-analysis, secret/schema guardrails, and completion reporting) while omitting inapplicable multi-tenant/Go/Supabase rules.

### Implementation Status & Completion Report
- **What was implemented:**
  - Excluded `public/` (11,666 KanjiVG SVGs + 3 assets) via `.graphifyignore` and built the Graphify knowledge graph (`404` nodes, `649` edges, `25` communities) in `graphify-out/` (`graph.html`, `GRAPH_REPORT.md`, `graph.json`, `manifest.json`, `cost.json`).
  - Adapted applicable project rules into `AGENTS.md` (preserving the Next.js generated rules block): Graphify maintenance, Playwright UI verification rule, plan-first workflow, `log.md` traceability, commit-before-new-analysis, schema/secret guardrails, and completion reporting.
  - Created root `log.md` to track plans, approvals, and completion reports.
- **Files created or modified:**
  - Created `.graphifyignore`
  - Modified `AGENTS.md`
  - Created `log.md`
  - Created `graphify-out/` (`graph.html`, `GRAPH_REPORT.md`, `graph.json`, `manifest.json`, `cost.json`, `cache/`)
- **Checks / diagnostics executed:**
  - `graphify.detect`: `80` files (`70` code, `9` docs, `1` image), `682,309` words after ignoring `public/`.
  - `diagnose_extraction`: `GRAPH HEALTH WARNING: 3 dangling-endpoint edges; 1 self-loop edges; 30 collapsed (directed) edges; 30 collapsed (undirected) edges` (primarily multi-line imports to the same external package such as `next` and `next-auth` collapsing in the undirected graph).
  - Coverage check noted `AGENTS.md` was updated from `9` to `60` lines after semantic extraction began; marked partial so the next `graphify --update` re-extracts it.
  - Playwright check (`which playwright` / `npx --no-install playwright --version`): Playwright is not currently installed in this workspace.
- **Outstanding issues or blockers:**
  - `graphify-out/` is currently untracked in `git status` (`.gitignore` was not modified per user selection).
  - Playwright is not yet installed in `package.json` (needs installation when running browser UI verification).

---

## 2026-11-26 — Enrich Kanji/Vocab Datasets (Mnemonics, Examples) & Add Dokkai / Contextual Vocab Datasets

### Proposed Plan & User Request
- User requested researching AnkiDroid / public open-source Japanese datasets for kanji mnemonics, contextual vocabulary/sentences, and Dokkai (reading comprehension), injecting them into both JSON and PostgreSQL DB, and pushing changes to a `development` branch (creating it if missing, never pushing to `main`).

### Research & Decisions
- **AnkiDroid / AnkiWeb Shared Decks:** Publicly downloadable manually (`.apkg` SQLite + media), no official public REST API, and mixed copyright status (many community decks derive from copyrighted textbooks).
- **Selected Open-Source Datasets (CC BY-SA 4.0 / MIT):**
  - `lczanna/kanji_mnemonic` (`CC BY-SA 4.0` data, `MIT` code): `kanji.json` (636 N5–N3 kanji mnemonics, components, sound hooks), `vocab.json` + `data/word_mnemonics.json` (3,790 vocab mnemonics), `examples.json` (fallback sentences), `data/exam_reading.json` (97 Dokkai passages / 173 questions), and `data/exam_vocab.json` (contextual paraphrase & usage MCQs → 772 questions).
  - `evanclan/OpenJLPT` (`CC BY-SA 4.0`): `vocab/n1.json`–`n5.json` Tatoeba example sentences (`ja`, `furigana`, `en`, `tatoeba_id`).
  - Preserved `davidluzgouveia/kanji-data` + `scripts/jaisho-kanji.ndjson` + `scripts/jaisho-vocab.ndjson` for core kanji & Indonesian meanings.

### Implementation & Completion Report
- **What was implemented:**
  - Created and checked out branch `development` from `main`.
  - Extended `prisma/schema.prisma` (`Kanji`: `keyword`, `mnemonic`, `components`, `soundHooks`; `Vocab`: `mnemonic`, `examples`; new models `DokkaiPassage`, `DokkaiQuestion`, `VocabExamQuestion`).
  - Updated `src/lib/types.ts` and `src/lib/kanji.ts` to type and map the enriched Kanji/Vocab fields.
  - Created `src/lib/exercises.ts` (hybrid DB-first / JSON-fallback loaders for `DokkaiPassage` & `VocabExamQuestion`).
  - Updated `scripts/seed-kanji.ts` to inject kanji mnemonics, components, soundHooks, vocab mnemonics, and Tatoeba example sentences into `src/data/kanji/n1.json`–`n5.json`.
  - Created `scripts/seed-exercises.ts` to generate `src/data/exercises/dokkai.json` (97 passages, 173 questions) and `src/data/exercises/vocab-exam.json` (772 questions), plus `src/data/ATTRIBUTION.md`.
  - Updated `scripts/seed-db.ts` and `package.json` (`seed:exercises`, `seed:db`) to seed Kanji, Vocab, Dokkai, and VocabExam into PostgreSQL.
- **Files created or modified:**
  - `prisma/schema.prisma`, `package.json`, `src/lib/types.ts`, `src/lib/kanji.ts`, `src/lib/exercises.ts`
  - `scripts/seed-kanji.ts`, `scripts/seed-exercises.ts`, `scripts/seed-db.ts`
  - `src/data/ATTRIBUTION.md`, `src/data/kanji/n1.json`–`n5.json`, `src/data/exercises/dokkai.json`, `src/data/exercises/vocab-exam.json`
  - `graphify-out/` updated via `graphify update .` (453 nodes, 735 edges, 29 communities)
- **Checks / diagnostics executed:**
  - `npx prisma generate`: passed.
  - `npm run seed:kanji`: passed (N5: 79/79 mnemonics, 241 vocab w/ sentences; N4: 166/166 mnemonics, 215 vocab w/ sentences; N3: 367/367 mnemonics, 806 vocab w/ sentences; N2: 5 mnemonics, 393 vocab w/ sentences; N1: 12 mnemonics, 934 vocab w/ sentences).
  - `npm run seed:exercises`: passed (`97` Dokkai passages / `173` questions; `772` VocabExam questions).
  - `npx eslint src/lib/types.ts src/lib/kanji.ts src/lib/exercises.ts scripts/seed-kanji.ts scripts/seed-exercises.ts scripts/seed-db.ts`: passed (0 errors/warnings). Note: full-repo `npm run lint` still reports 10 pre-existing errors in untouched files (`scripts/download-svg.ts`, `scripts/seed-kana.ts`, etc.).
  - `npx tsc --noEmit`: passed (0 errors).
  - `npx next build --webpack`: passed (exit 0; note: default Turbopack `npm run build` panicked on Node `v24.13.0` spawning PostCSS worker for `src/app/globals.css`).
- **Outstanding issues or blockers:**
  - **PostgreSQL database injection (`prisma db push` & `npm run seed:db`) is blocked** because `.env` (`aws-0-ap-southeast-1.pooler.supabase.com:6543`) rejects startup with `CXX000 (ENOTFOUND) tenant/user ... not found` and `.env.local` (`localhost:5432`) has no active Docker/Postgres daemon running (`Connection refused`).


