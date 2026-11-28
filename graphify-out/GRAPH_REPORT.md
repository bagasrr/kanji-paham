# Graph Report - web belajar kanji  (2026-11-28)

## Corpus Check
- 106 files · ~969,905 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .ndjson 2, .example 1)

## Summary
- 568 nodes · 1046 edges · 40 communities (30 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `616c4d4a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- useLanguage
- auth
- Toast.tsx
- [subLevel]/quiz/page.tsx
- seed-db.ts
- Project Task Tracker (Phases 1-16)
- compilerOptions
- db
- KanjiCard Component
- scripts
- dependencies
- lucide-react
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
- DokkaiPractice.tsx
- exercises.ts
- seed-exercises.ts
- DokkaiPractice
- VocabExamPractice.tsx
- parse/route.ts
- KanaClient.tsx
- eslint.config.mjs
- useJapaneseSpeech.ts
- 2026-11-26 — Enrich Kanji/Vocab Datasets (Mnemonics, Examples) & Add Dokkai / Contextual Vocab Datasets
- next-auth

## God Nodes (most connected - your core abstractions)
1. `next` - 45 edges
2. `auth` - 36 edges
3. `lucide-react` - 30 edges
4. `react` - 26 edges
5. `useLanguage()` - 23 edges
6. `prisma` - 18 edges
7. `compilerOptions` - 16 edges
8. `QuizPage()` - 15 edges
9. `scripts` - 14 edges
10. `KanjiEntry` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Implementation & Completion Report` --references--> `DokkaiPassage`  [INFERRED]
  log.md → src/lib/types.ts
- `Implementation & Completion Report` --references--> `VocabExamQuestion`  [INFERRED]
  log.md → src/lib/types.ts
- `Proposed Plan & User Approval` --references--> `KanjiCard()`  [INFERRED]
  log.md → src/components/KanjiCard.tsx
- `Implementation & Completion Report` --references--> `renderFuriganaText()`  [INFERRED]
  log.md → src/lib/ruby.tsx
- `Implementation & Completion Report` --references--> `getAllKanjiReferenceMap()`  [INFERRED]
  log.md → src/lib/kanji.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KanjiPaham Core Learning & Assessment Loop** — readme_kana_module, readme_kanji_curriculum, readme_kanjicard, readme_quiz_system, readme_weak_kanji_tracker [EXTRACTED 1.00]
- **KanjiPaham Authentication & Security Architecture** — docs_security_password_policy, docs_security_auth_flow, docs_security_api_protection, docs_task_oauth_password_gate, readme_multi_role_auth [INFERRED 0.95]
- **KanjiPaham Data & Localization Pipeline** — docs_architecture_kanji_data_source, docs_architecture_kanjivg_hex_convention, docs_task_jaisho_localization, docs_task_hybrid_kanji_fetching, readme_model_kanji [INFERRED 0.95]

## Communities (40 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.12
Nodes (22): devDependencies, prisma@^5.22.0, tailwindcss@^4, @tailwindcss/postcss@^4, tsx@^4.23.13, @types/bcryptjs@^2.4.6, @types/node@^20, @types/react@^19 (+14 more)

### Community 1 - "useLanguage"
Cohesion: 0.13
Nodes (19): DashboardLayout(), metadata, RootLayout(), viewport, AppShell(), BottomNav(), DashboardSidebar(), Props (+11 more)

### Community 2 - "auth"
Cohesion: 0.07
Nodes (43): nextConfig, bcryptjs, next, dynamic, GET(), PATCH(), DELETE(), dynamic (+35 more)

### Community 3 - "Toast.tsx"
Cohesion: 0.09
Nodes (21): LoginForm(), LoginPage(), RegisterPage(), ApplicationsDashboardPage(), fetchApps(), handleAction(), AdminKanjiPage(), handleSave() (+13 more)

### Community 4 - "[subLevel]/quiz/page.tsx"
Cohesion: 0.11
Nodes (23): Implementation & Completion Report, dynamic, GET(), AnswerState, Mode, QuizHeader(), QuizPage(), startFlashcard() (+15 more)

### Community 5 - "seed-db.ts"
Cohesion: 0.12
Nodes (21): DATA_DIR, downloadSvg(), KanjiEntry, loadEntries(), main(), sleep(), SVG_DIR, main() (+13 more)

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

### Community 11 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @auth/prisma-adapter@^2.11.3, bcryptjs@^3.0.3, lucide-react@^1.45.0, next@16.3.5, nextjs-toploader@^3.9.17, @prisma/client@^5.22.0, react@19.2.8 (+5 more)

### Community 12 - "lucide-react"
Cohesion: 0.05
Nodes (48): 2026-11-27 — Dokkai Kanji Reference (New Tab) & Japanese Radicals Circle Browser (`/learn/radicals`), Implementation & Completion Report, Proposed Plan & User Approval, lucide-react, react, dynamic, GET(), AuthErrorContent() (+40 more)

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
Nodes (23): args, convertToKatakana(), fetchJson(), filterByJlpt(), JaishoKanjiLine, JaishoVocabLine, levelArg, loadJaishoDictionaries() (+15 more)

### Community 26 - "QuestionsDashboard"
Cohesion: 0.47
Nodes (4): QuestionsDashboard(), fetchBanks(), handleDeleteConfirm(), handleSaveBank()

### Community 27 - "2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)"
Cohesion: 0.12
Nodes (16): 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`), 2026-11-26 — Supabase DB Seed Completion & Tahap 1 UI Implementation (Dokkai, Contextual Vocab, KanjiCard Enrichment), 2026-11-27 — Add Ponytail Skill Rule to `AGENTS.md`, 2026-11-27 — Ponytail Audit Cleanup, 2026-11-28 — Upgrade Japanese Typography to `BIZ UDPGothic`, Decision & Implementation Log, Implementation & Completion Report, Implementation & Completion Report (+8 more)

### Community 29 - "DokkaiPractice.tsx"
Cohesion: 0.21
Nodes (10): 2026-11-27 — Add JLPT Mondai Instructions & Option Numbering (`1・2・3・4`), Implementation & Completion Report, Proposed Plan & User Request, FONT_SIZES, KIND_LABELS, Props, MondaiInstruction(), Props (+2 more)

### Community 30 - "exercises.ts"
Cohesion: 0.24
Nodes (8): dynamic, GET(), getDokkaiPassages(), getVocabExamQuestions(), parseStringRecord(), parseVocabWrongMap(), VocabExamQuestion, VocabExamWrongMap

### Community 31 - "seed-exercises.ts"
Cohesion: 0.24
Nodes (9): fetchJson(), main(), normalizeUsageWrong(), RawDokkaiPassage, RawDokkaiQuestion, RawVocabExamEntry, RawVocabPara, RawVocabUsage (+1 more)

### Community 32 - "DokkaiPractice"
Cohesion: 0.27
Nodes (7): DokkaiPage(), dynamic, DokkaiPractice(), markDone(), selectAnswer(), extractUniqueKanji(), getAllKanjiReferenceMap()

### Community 33 - "VocabExamPractice.tsx"
Cohesion: 0.19
Nodes (9): dynamic, VocabExamPage(), AnswerState, isUsageDetail(), Props, QuizModeFilter, renderBracketHighlight(), VocabExamPractice() (+1 more)

### Community 34 - "parse/route.ts"
Cohesion: 0.29
Nodes (7): mammoth@^1.12.3, pdf-parse@^2.4.5, mammoth, pdf-parse, dynamic, pdfParse, POST()

### Community 35 - "KanaClient.tsx"
Cohesion: 0.48
Nodes (4): KanaPage(), KanaClient(), Props, KanaEntry

### Community 36 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.5, eslint, eslint-config-next

### Community 37 - "useJapaneseSpeech.ts"
Cohesion: 0.53
Nodes (5): getSpeechSupportServerSnapshot(), getSpeechSupportSnapshot(), noopSubscribe(), useJapaneseSpeech(), UseJapaneseSpeechReturn

### Community 38 - "2026-11-26 — Enrich Kanji/Vocab Datasets (Mnemonics, Examples) & Add Dokkai / Contextual Vocab Datasets"
Cohesion: 0.40
Nodes (5): 2026-11-26 — Enrich Kanji/Vocab Datasets (Mnemonics, Examples) & Add Dokkai / Contextual Vocab Datasets, Implementation & Completion Report, Proposed Plan & User Request, Research & Decisions, DokkaiQuestion

### Community 39 - "next-auth"
Cohesion: 0.40
Nodes (4): next-auth@^5.0.0-beta.32, next-auth, next-auth, Session

## Knowledge Gaps
- **25 isolated node(s):** `{ GET, POST }`, `Progress Engine`, `User Model`, `KanjiPaham Brand Name`, `Japanese Motifs (Rising Sun, Pagoda, Mount Fuji, Sakura)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 224 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `auth` to `package.json`, `useLanguage`, `parse/route.ts`, `Toast.tsx`, `[subLevel]/quiz/page.tsx`, `VocabExamPractice.tsx`, `dependencies`, `lucide-react`, `DokkaiPractice.tsx`, `exercises.ts`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Progress Engine`, `User Model` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `package.json`, `useLanguage`, `auth`, `Toast.tsx`, `[subLevel]/quiz/page.tsx`, `VocabExamPractice.tsx`, `dependencies`, `DokkaiPractice.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Should `useLanguage` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
- **Why does `react` connect `lucide-react` to `package.json`, `useLanguage`, `VocabExamPractice.tsx`, `Toast.tsx`, `[subLevel]/quiz/page.tsx`, `KanaClient.tsx`, `useJapaneseSpeech.ts`, `dependencies`, `DokkaiPractice.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `auth` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._