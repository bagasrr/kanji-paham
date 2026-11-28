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

---

## 2026-11-26 — Supabase DB Seed Completion & Tahap 1 UI Implementation (Dokkai, Contextual Vocab, KanjiCard Enrichment)

### Proposed Plan & User Approval
- User restored Supabase DB and instructed running the DB injection, asked about official JLPT sections & public dataset availability/licensing (`NOASSERTION` dual-license analysis for `gauravhq/JLPTSuccess`), reviewed the phased proposal, and approved **"gas run tahap 1 dulu"**.

### Implementation & Completion Report
- **Database Seeding:**
  - Pushed Prisma schema via Supabase session pooler (`port 5432`) and executed `npm run seed:db`.
  - Verified row counts in PostgreSQL: `kanji: 2211`, `vocab: 2741`, `dokkaiPassage: 97`, `dokkaiQuestion: 173`, `vocabExam: 772`.
- **Tahap 1 UI & API Implementation:**
  - Created `src/app/api/exercises/dokkai/route.ts` and `src/app/api/exercises/vocab/route.ts`.
  - Created `src/lib/ruby.tsx` (`renderFuriganaText`) for `{漢字|かんじ}` `<ruby>/<rt>` rendering.
  - Created `src/components/DokkaiPractice.tsx` & `src/app/quiz/dokkai/page.tsx` (category/status filters, search, font-size control, TTS audio, EN translation toggle, per-option `wrong` & `why` feedback, `localStorage` completion).
  - Created `src/components/VocabExamPractice.tsx` & `src/app/quiz/vocab/page.tsx` (`all` / `para` / `usage` modes, 20-question randomized drills, detailed `why` + `wrong` + corrected sentence `fix` feedback).
  - Updated `src/app/quiz/page.tsx` hub with links to `/quiz/dokkai` and `/quiz/vocab`.
  - Updated `src/components/KanjiCard.tsx` with collapsible **Mnemonic & Komponen** (keyword, components, mnemonic story, soundHooks) and expandable per-vocab **Tip & Contoh Kalimat** (`<ruby>` furigana + sentence audio).
  - Fixed SSR hydration mismatch (#418) in `src/hooks/useJapaneseSpeech.ts` using `useSyncExternalStore`.
  - Added Open Data Sources & Attribution section (`CC BY-SA 4.0` / `CC BY-SA 3.0` / `MIT`) in `src/app/info/page.tsx`.
- **Verification Results:**
  - `npx eslint` on all modified/created files: passed (0 errors/warnings).
  - `npx tsc --noEmit`: passed (0 errors).
  - `npx next build --webpack`: passed (exit 0).
  - Playwright real-browser verification across `/quiz`, `/quiz/dokkai`, `/quiz/vocab`, `/learn/5/1/一`, and `/info` on mobile (`390x844`) and desktop (`1280x800`): **PASS** (0 console/page errors, 0 horizontal overflow, interactive flows verified).
  - `graphify update .`: rebuilt (`493` nodes, `825` edges, `39` communities).

---

## 2026-11-27 — Add JLPT Mondai Instructions & Option Numbering (`1・2・3・4`)

### Proposed Plan & User Request
- User noted that exercise questions lacked explicit Japanese JLPT instructions (e.g., `1・2・3・4から一つ選びなさい`) and clear Indonesian/English how-to-answer guidance so learners know exactly what to do.

### Implementation & Completion Report
- **What was implemented:**
  - Created `src/components/MondaiInstruction.tsx` displaying authentic Japanese JLPT question instructions (`問題：... 1・2・3・4から一つ選びなさい`) paired with concise Indonesian/English guidance.
  - Integrated `MondaiInstruction` and JLPT `1–4` option badges across:
    - `src/components/DokkaiPractice.tsx`
    - `src/components/VocabExamPractice.tsx` (distinct rubrics for `para` and `usage` modes + visual `【...】` highlight)
    - `src/app/quiz/page.tsx` (plus clean underline rendering for `__word__` instead of raw underscores)
- **Verification Results:**
  - `npx eslint` on modified/created files: passed (0 errors/warnings).
  - `npx tsc --noEmit`: passed (0 errors).
  - `npx next build --webpack`: passed (exit 0).
  - Playwright verification on mobile (`390x844`) and desktop (`1280x800`): **PASS** (`0 console errors`, `0 horizontal overflow`, verified `1・2・3・4から一つ選びなさい` visible on `/quiz`, `/quiz/dokkai`, and `/quiz/vocab`).
  - `graphify update .`: rebuilt (`501` nodes, `845` edges, `33` communities).

---

## 2026-11-27 — Dokkai Kanji Reference (New Tab) & Japanese Radicals Circle Browser (`/learn/radicals`)

### Proposed Plan & User Approval
- User requested:
  1. A **Kanji Reference** button inside Dokkai passages listing kanji present in the passage and opening kanji details in a new tab/page so the Dokkai page stays open.
  2. A **Radicals menu/page** using the most complete open dataset, grouping N5–N1 kanji by radical with JLPT level badges on cards, and full `KanjiCard` detail view where prev/next navigation cycles through kanji inside the same radical circle.
- User confirmed: "gw mau yang lengkap aja, lu bisa pilih aja yang paling lengkap, gunakan untuk sekarang".

### Implementation & Completion Report
- **Dataset & Database:**
  - Created `scripts/seed-radicals.ts` fetching `data/core/radicals.json` from `jkindrix/japanese-language-data` (`CC BY-SA 4.0`, KRADFILE/RADKFILE + Kangxi), mapping all `2,211` N5–N1 kanji (`79/79` N5, `166/166` N4, `367/367` N3, `367/367` N2, `1232/1232` N1) and generating `src/data/kanji/radicals.json` (`240` Japanese radicals).
  - Updated `prisma/schema.prisma` (`Kanji.radicals` + `Radical` model), pushed via session port `5432`, and optimized `scripts/seed-db.ts` with batched concurrency (`BATCH_SIZE = 20`) — seeded 2,211 kanji, 240 radicals, 97 dokkai passages, and 772 vocab exam questions.
  - Created `src/lib/radicals.ts` and updated `src/lib/kanji.ts` (`getAllKanjiReferenceMap`), `src/lib/types.ts`, `src/data/ATTRIBUTION.md`, and `src/app/info/page.tsx`.
- **UI Implementation:**
  - Updated `src/app/quiz/dokkai/page.tsx` & `src/components/DokkaiPractice.tsx`: added **"Referensi Kanji (`N`)"** toggle extracting unique kanji from the active passage & questions, showing JLPT badge + meaning, linking to `/learn/[level]/[subLevel]/[character]` with `target="_blank" rel="noopener noreferrer"`.
  - Updated `src/app/learn/page.tsx` with **"Jelajahi Kanji by Radikal"** entry card.
  - Created `src/components/RadicalsBrowser.tsx` & `src/app/learn/radicals/page.tsx` (stroke-count filter chips + search across 240 radicals).
  - Created `src/components/RadicalKanjiGrid.tsx` & `src/app/learn/radicals/[radical]/page.tsx` (JLPT filter chips + `N5`–`N1` badges on every kanji card).
  - Created `src/app/learn/radicals/[radical]/[character]/page.tsx` reusing `KanjiCard` + `KanjiNavigation` cycling prev/next within the active radical circle.
- **Verification Results:**
  - `npx eslint` on all created/modified files: passed (0 errors/warnings).
  - `npx tsc --noEmit`: passed (0 errors).
  - `npx next build --webpack`: passed (exit 0).
  - Playwright verification (`390x844` mobile & `1280x800` desktop): **PASS** (`0 console errors`, `0 horizontal overflow`, verified Dokkai `Referensi Kanji` `target="_blank"` link, `/learn/radicals`, `/learn/radicals/木` `N5` badge, and prev/next navigation staying inside `/learn/radicals/木/...`).
  - `graphify update .`: rebuilt (`535` nodes, `948` edges, `34` communities).

---

## 2026-11-27 — Ponytail Audit Cleanup

### Proposed Plan & User Approval
- Ran `/ponytail:ponytail-audit` and user approved cleaning up all dead code, unused dependencies, and duplicated helpers while keeping all functionality intact.

### Implementation & Completion Report
- **What was implemented:**
  - Deleted `scripts/theme-replace.mjs` and unused API route `src/app/api/exercises/dokkai/route.ts`.
  - Extracted shared `shuffle()`, `isKanjiLike()`, and `getKanjiOptionFontSize()` into `src/lib/quiz.ts` and updated `src/app/api/quiz/jlpt/route.ts`, `src/app/api/exercises/vocab/route.ts`, `src/app/quiz/page.tsx`, and `src/app/learn/[level]/[subLevel]/quiz/page.tsx`.
  - Removed unreachable `locked` branch and `Lock` import from `src/app/learn/page.tsx`.
  - Removed unused `UserProgress`, `QuizMode`, `QuizQuestion` from `src/lib/types.ts` and unused `getN5Kanji()` from `src/lib/kanji.ts`.
  - Shared `kanjiData` payload in `scripts/seed-db.ts` across `update` and `create`.
  - Removed unused `next-themes` and redundant `@napi-rs/canvas` from `package.json`.
- **Verification Results:**
  - `npx eslint` on all touched files: 0 errors.
  - `npx tsc --noEmit`: passed (0 errors).
  - `npx next build --webpack`: passed (exit 0).
  - Playwright verification (`390x844` mobile & `1280x800` desktop): **PASS** (`0 console errors`, `0 horizontal overflow`).
  - `graphify update .`: rebuilt (`521` nodes, `941` edges, `29` communities).

---

## 2026-11-27 — Add Ponytail Skill Rule to `AGENTS.md`

### Proposed Plan & User Request
- User requested adding the `ponytail` skill discipline to `AGENTS.md` so future code stays minimal, structured, and clean.

### Implementation & Completion Report
- Added Rule 13 (**Ponytail Minimalism & Clean Code**) to `AGENTS.md` enforcing `ponytail` (`full` mode by default) across all coding tasks.
- Files modified: `AGENTS.md`, `log.md`.

---

## 2026-11-28 — Upgrade Japanese Typography to `BIZ UDPGothic`

### Proposed Plan & User Approval
- Identified that `'Noto Serif JP', serif` was never loaded in `layout.tsx` or `globals.css`, causing fallback to OS generic serif with thin, cramped strokes.
- Recommended beginner-friendly Japanese fonts and user selected **`BIZ UDPGothic`**.

### Implementation & Completion Report
- **What was implemented:**
  - Loaded Google Font `BIZ UDPGothic` (weights `400`, `700`) in `src/app/layout.tsx` and defined shared `.font-jp` utility in `src/app/globals.css` (`"BIZ UDPGothic", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif`).
  - Replaced all inline `Noto Serif JP` font styles across quiz, Dokkai, Vocab Exam, KanjiCard, Radicals, Learn, and Profile views with `.font-jp`.
- **Verification Results:**
  - `npx tsc --noEmit`: passed (0 errors).
  - `npx next build --webpack`: passed (exit 0).
  - Playwright verification (`390x844` mobile & `1280x800` desktop): **PASS** (`0 console errors`, `0 horizontal overflow`, verified computed `fontFamily` includes `"BIZ UDPGothic"`).
  - `graphify update .`: rebuilt (`527` nodes, `950` edges, `29` communities).








