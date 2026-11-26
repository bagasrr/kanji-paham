# Graph Report - web belajar kanji  (2026-11-26)

## Corpus Check
- 85 files · ~930,512 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .ndjson 2, .example 1)

## Summary
- 453 nodes · 735 edges · 29 communities (19 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3316497d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- app/layout.tsx
- auth
- next
- [subLevel]/quiz/page.tsx
- download-svg.ts
- Project Task Tracker (Phases 1-16)
- compilerOptions
- db
- KanjiCard Component
- scripts
- types.ts
- QuestionsDashboard
- POST /api/auth/register
- KanjiPaham App Icon (src/app/icon.png)
- Next.js Agent Rules
- POST /api/user/quiz-result
- Mobile-First & Strict TypeScript Standards
- postcss.config.mjs
- GET /api/quiz/jlpt
- { GET, POST }
- seed-kanji.ts
- Toast.tsx
- 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)
- ATTRIBUTION.md

## God Nodes (most connected - your core abstractions)
1. `next` - 31 edges
2. `auth` - 27 edges
3. `lucide-react` - 18 edges
4. `react` - 18 edges
5. `compilerOptions` - 16 edges
6. `useLanguage()` - 15 edges
7. `QuizPage()` - 14 edges
8. `prisma` - 14 edges
9. `scripts` - 13 edges
10. `KanjiEntry` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Progress Engine` --conceptually_related_to--> `UserProgress Model`  [INFERRED]
  docs/PRD.md → README.md
- `API & Route Protection` --conceptually_related_to--> `POST /api/auth/register`  [INFERRED]
  docs/security.md → README.md
- `POST /api/auth/register` --implements--> `Password Policy & Hashing`  [INFERRED]
  README.md → docs/security.md
- `API & Route Protection` --conceptually_related_to--> `GET / POST /api/user/progress`  [INFERRED]
  docs/security.md → README.md
- `Tailwind CSS v4` --conceptually_related_to--> `Design System Theme & Color Palette`  [INFERRED]
  README.md → docs/design-system.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KanjiPaham Core Learning & Assessment Loop** — readme_kana_module, readme_kanji_curriculum, readme_kanjicard, readme_quiz_system, readme_weak_kanji_tracker [EXTRACTED 1.00]
- **KanjiPaham Authentication & Security Architecture** — docs_security_password_policy, docs_security_auth_flow, docs_security_api_protection, docs_task_oauth_password_gate, readme_multi_role_auth [INFERRED 0.95]
- **KanjiPaham Data & Localization Pipeline** — docs_architecture_kanji_data_source, docs_architecture_kanjivg_hex_convention, docs_task_jaisho_localization, docs_task_hybrid_kanji_fetching, readme_model_kanji [INFERRED 0.95]

## Communities (29 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (52): eslintConfig, dependencies, @auth/prisma-adapter@^2.11.3, lucide-react@^1.45.0, mammoth@^1.12.3, @napi-rs/canvas@^1.0.9, next@16.3.5, next-auth@^5.0.0-beta.32 (+44 more)

### Community 1 - "app/layout.tsx"
Cohesion: 0.11
Nodes (21): metadata, RootLayout(), viewport, AnswerState, getKanjiOptionFontSize(), GlobalQuizPage(), isKanji(), JLPTQuestion (+13 more)

### Community 2 - "auth"
Cohesion: 0.09
Nodes (28): bcryptjs@^3.0.3, bcryptjs, DELETE(), dynamic, dynamic, GET(), POST(), dynamic (+20 more)

### Community 3 - "next"
Cohesion: 0.07
Nodes (33): nextConfig, lucide-react, next, react, dynamic, GET(), AuthErrorContent(), AuthErrorPage() (+25 more)

### Community 4 - "[subLevel]/quiz/page.tsx"
Cohesion: 0.13
Nodes (15): dynamic, AnswerState, getKanjiOptionFontSize(), isKanjiLike(), Mode, QuizHeader(), QuizPage(), startFlashcard() (+7 more)

### Community 5 - "download-svg.ts"
Cohesion: 0.14
Nodes (14): DATA_DIR, downloadSvg(), KanjiEntry, loadEntries(), main(), sleep(), SVG_DIR, generate() (+6 more)

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
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, postinstall, seed:db, seed:exercises, seed:kanji (+5 more)

### Community 11 - "types.ts"
Cohesion: 0.07
Nodes (36): @prisma/client@^5.22.0, @prisma/client, main(), prisma, seedDokkai(), seedKanjis(), seedVocabExam(), toJsonInput() (+28 more)

### Community 12 - "QuestionsDashboard"
Cohesion: 0.47
Nodes (4): QuestionsDashboard(), fetchBanks(), handleDeleteConfirm(), handleSaveBank()

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
Cohesion: 0.11
Nodes (22): args, convertToKatakana(), fetchJson(), filterByJlpt(), JaishoKanjiLine, JaishoVocabLine, levelArg, loadJaishoDictionaries() (+14 more)

### Community 26 - "Toast.tsx"
Cohesion: 0.18
Nodes (12): LoginForm(), LoginPage(), RegisterPage(), GitHubIcon(), InfoPage(), InstagramIcon(), LinkedInIcon(), Toast (+4 more)

### Community 27 - "2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)"
Cohesion: 0.33
Nodes (5): 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`), Decision & Implementation Log, Implementation Status & Completion Report, Proposed Plan & Questions, User Approval & Rationale

## Knowledge Gaps
- **25 isolated node(s):** `{ GET, POST }`, `Progress Engine`, `User Model`, `KanjiPaham Brand Name`, `Japanese Motifs (Rising Sun, Pagoda, Mount Fuji, Sakura)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 184 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/layout.tsx`, `auth`, `[subLevel]/quiz/page.tsx`, `Toast.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Progress Engine`, `User Model` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `package.json`, `app/layout.tsx`, `[subLevel]/quiz/page.tsx`, `types.ts`, `Toast.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `next` to `package.json`, `app/layout.tsx`, `auth`, `[subLevel]/quiz/page.tsx`, `Toast.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `auth` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._