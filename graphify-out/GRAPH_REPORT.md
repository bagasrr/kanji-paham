# Graph Report - web belajar kanji  (2026-11-28)

## Corpus Check
- 99 files · ~966,040 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .ndjson 2, .example 1)

## Summary
- 527 nodes · 950 edges · 29 communities (19 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ec9a21f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- useLanguage
- auth
- next
- [subLevel]/quiz/page.tsx
- VocabExamPractice.tsx
- Project Task Tracker (Phases 1-16)
- compilerOptions
- db
- KanjiCard Component
- scripts
- DokkaiPractice.tsx
- POST /api/auth/register
- KanjiPaham App Icon (src/app/icon.png)
- Next.js Agent Rules
- POST /api/user/quiz-result
- Mobile-First & Strict TypeScript Standards
- postcss.config.mjs
- GET /api/quiz/jlpt
- { GET, POST }
- seed-kanji.ts
- QuestionsDashboard
- 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)
- ATTRIBUTION.md
- types.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 39 edges
2. `auth` - 27 edges
3. `lucide-react` - 24 edges
4. `useLanguage()` - 23 edges
5. `react` - 23 edges
6. `compilerOptions` - 16 edges
7. `prisma` - 15 edges
8. `QuizPage()` - 14 edges
9. `scripts` - 14 edges
10. `KanjiEntry` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Implementation & Completion Report` --references--> `MondaiInstruction()`  [INFERRED]
  log.md → src/components/MondaiInstruction.tsx
- `Proposed Plan & User Approval` --references--> `KanjiCard()`  [INFERRED]
  log.md → src/components/KanjiCard.tsx
- `Implementation & Completion Report` --references--> `KanjiNavigation()`  [INFERRED]
  log.md → src/components/KanjiNavigation.tsx
- `Implementation & Completion Report` --references--> `renderFuriganaText()`  [INFERRED]
  log.md → src/lib/ruby.tsx
- `Implementation & Completion Report` --references--> `DokkaiPassage`  [INFERRED]
  log.md → src/lib/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KanjiPaham Core Learning & Assessment Loop** — readme_kana_module, readme_kanji_curriculum, readme_kanjicard, readme_quiz_system, readme_weak_kanji_tracker [EXTRACTED 1.00]
- **KanjiPaham Authentication & Security Architecture** — docs_security_password_policy, docs_security_auth_flow, docs_security_api_protection, docs_task_oauth_password_gate, readme_multi_role_auth [INFERRED 0.95]
- **KanjiPaham Data & Localization Pipeline** — docs_architecture_kanji_data_source, docs_architecture_kanjivg_hex_convention, docs_task_jaisho_localization, docs_task_hybrid_kanji_fetching, readme_model_kanji [INFERRED 0.95]

## Communities (29 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (48): eslintConfig, dependencies, @auth/prisma-adapter@^2.11.3, lucide-react@^1.45.0, mammoth@^1.12.3, next@16.3.5, next-auth@^5.0.0-beta.32, nextjs-toploader@^3.9.17 (+40 more)

### Community 1 - "useLanguage"
Cohesion: 0.09
Nodes (27): LoginForm(), LoginPage(), RegisterPage(), GitHubIcon(), InfoPage(), InstagramIcon(), LinkedInIcon(), metadata (+19 more)

### Community 2 - "auth"
Cohesion: 0.09
Nodes (28): bcryptjs@^3.0.3, bcryptjs, DELETE(), dynamic, dynamic, GET(), POST(), dynamic (+20 more)

### Community 3 - "next"
Cohesion: 0.08
Nodes (31): nextConfig, next, dynamic, GET(), LevelPage(), KanjiDetailPage(), SubLevelPage(), dynamic (+23 more)

### Community 4 - "[subLevel]/quiz/page.tsx"
Cohesion: 0.08
Nodes (26): Implementation & Completion Report, lucide-react, dynamic, GET(), AnswerState, Mode, QuizHeader(), QuizPage() (+18 more)

### Community 5 - "VocabExamPractice.tsx"
Cohesion: 0.19
Nodes (9): dynamic, VocabExamPage(), AnswerState, isUsageDetail(), Props, QuizModeFilter, renderBracketHighlight(), VocabExamPractice() (+1 more)

### Community 6 - "Project Task Tracker (Phases 1-16)"
Cohesion: 0.08
Nodes (24): davidluzgouveia/kanji-data Source, Design System Theme & Color Palette, PRD Testing System (Flashcard Match & MCQ), Authentication & JWT Session Flow, Fisher-Yates Quiz Randomization & 5-Mode JLPT Sim (Phase 12), JaIsho Indonesian Dictionary Localization (Phase 13), Roles & Teacher/Admin Dashboard (Phase 16), Project Task Tracker (Phases 1-16) (+16 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "db"
Cohesion: 0.13
Nodes (14): container_name, environment, image, ports, restart, volumes, POSTGRES_DB, POSTGRES_PASSWORD (+6 more)

### Community 9 - "KanjiCard Component"
Cohesion: 0.17
Nodes (10): KanjiVG 5-Digit Hex SVG Convention, KanjiCard UI Specification, KanjiPaham PRD, Developer Info Page (/info), Interactive Kana Learning (/kana), Tiered Kanji Curriculum (/learn), KanjiCard Component, KanjiPaham Platform (+2 more)

### Community 10 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, lint, postinstall, seed:db, seed:exercises, seed:kanji (+6 more)

### Community 12 - "DokkaiPractice.tsx"
Cohesion: 0.08
Nodes (24): 2026-11-27 — Dokkai Kanji Reference (New Tab) & Japanese Radicals Circle Browser (`/learn/radicals`), Implementation & Completion Report, Proposed Plan & User Approval, react, AuthErrorContent(), AuthErrorPage(), SetPasswordPage(), ApplySenseiPage() (+16 more)

### Community 13 - "POST /api/auth/register"
Cohesion: 0.29
Nodes (5): Progress Engine, POST /api/auth/register, GET / POST /api/user/progress, User Model, UserProgress Model

### Community 14 - "KanjiPaham App Icon (src/app/icon.png)"
Cohesion: 0.33
Nodes (7): KanjiPaham App Icon (src/app/icon.png), Japanese Motifs (Rising Sun, Pagoda, Mount Fuji, Sakura), Open Book Displaying Kanji (漢字), KanjiPaham Brand Name, Shiba Inu Mascot Wearing Hachimaki, Indonesian Tagline: Kanji Jadi Lebih Mudah, Japanese Tagline: 学んで、もっとわかる

### Community 16 - "POST /api/user/quiz-result"
Cohesion: 0.67
Nodes (3): POST /api/user/quiz-result, QuizResult Model, WeakKanji Model

### Community 25 - "seed-kanji.ts"
Cohesion: 0.06
Nodes (35): DATA_DIR, downloadSvg(), KanjiEntry, loadEntries(), main(), sleep(), SVG_DIR, generate() (+27 more)

### Community 26 - "QuestionsDashboard"
Cohesion: 0.32
Nodes (5): QuestionPreview, QuestionsDashboard(), fetchBanks(), handleDeleteConfirm(), handleSaveBank()

### Community 27 - "2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)"
Cohesion: 0.10
Nodes (19): 2026-11-26 — Enrich Kanji/Vocab Datasets (Mnemonics, Examples) & Add Dokkai / Contextual Vocab Datasets, 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`), 2026-11-26 — Supabase DB Seed Completion & Tahap 1 UI Implementation (Dokkai, Contextual Vocab, KanjiCard Enrichment), 2026-11-27 — Add JLPT Mondai Instructions & Option Numbering (`1・2・3・4`), 2026-11-27 — Add Ponytail Skill Rule to `AGENTS.md`, 2026-11-27 — Ponytail Audit Cleanup, Decision & Implementation Log, Implementation & Completion Report (+11 more)

### Community 33 - "types.ts"
Cohesion: 0.07
Nodes (44): Implementation & Completion Report, @prisma/client@^5.22.0, @prisma/client, main(), prisma, runInBatches(), seedDokkai(), seedKanjis() (+36 more)

## Knowledge Gaps
- **25 isolated node(s):** `{ GET, POST }`, `Progress Engine`, `User Model`, `KanjiPaham Brand Name`, `Japanese Motifs (Rising Sun, Pagoda, Mount Fuji, Sakura)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 208 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `types.ts`, `auth`, `useLanguage`, `[subLevel]/quiz/page.tsx`, `VocabExamPractice.tsx`, `DokkaiPractice.tsx`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Progress Engine`, `User Model` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.053544494720965306 - nodes in this community are weakly interconnected._
- **Why does `react` connect `DokkaiPractice.tsx` to `package.json`, `useLanguage`, `types.ts`, `next`, `[subLevel]/quiz/page.tsx`, `VocabExamPractice.tsx`, `QuestionsDashboard`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `useLanguage` be split into smaller, more focused modules?**
  _Cohesion score 0.09102564102564102 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `[subLevel]/quiz/page.tsx` to `package.json`, `useLanguage`, `auth`, `next`, `types.ts`, `VocabExamPractice.tsx`, `DokkaiPractice.tsx`, `QuestionsDashboard`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `auth` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._