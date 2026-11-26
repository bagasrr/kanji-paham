# Graph Report - web belajar kanji  (2026-11-26)

## Corpus Check
- 92 files · ~935,768 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .ndjson 2, .example 1)

## Summary
- 493 nodes · 825 edges · 39 communities (29 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bbaf6d4`
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
- VocabExamPractice.tsx
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
- dependencies
- 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)
- ATTRIBUTION.md
- Toast.tsx
- parse/route.ts
- eslint.config.mjs
- next-auth
- types.ts
- seed-exercises.ts
- exercises.ts
- vocab/route.ts
- KanaClient.tsx
- DokkaiPractice

## God Nodes (most connected - your core abstractions)
1. `next` - 36 edges
2. `auth` - 27 edges
3. `react` - 21 edges
4. `lucide-react` - 20 edges
5. `useLanguage()` - 19 edges
6. `compilerOptions` - 16 edges
7. `QuizPage()` - 14 edges
8. `prisma` - 14 edges
9. `scripts` - 13 edges
10. `KanjiEntry` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Implementation & Completion Report` --references--> `DokkaiPassage`  [INFERRED]
  log.md → src/lib/types.ts
- `Implementation & Completion Report` --references--> `DokkaiQuestion`  [INFERRED]
  log.md → src/lib/types.ts
- `Implementation & Completion Report` --references--> `VocabExamQuestion`  [INFERRED]
  log.md → src/lib/types.ts
- `Progress Engine` --conceptually_related_to--> `UserProgress Model`  [INFERRED]
  docs/PRD.md → README.md
- `API & Route Protection` --conceptually_related_to--> `POST /api/auth/register`  [INFERRED]
  docs/security.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KanjiPaham Core Learning & Assessment Loop** — readme_kana_module, readme_kanji_curriculum, readme_kanjicard, readme_quiz_system, readme_weak_kanji_tracker [EXTRACTED 1.00]
- **KanjiPaham Authentication & Security Architecture** — docs_security_password_policy, docs_security_auth_flow, docs_security_api_protection, docs_task_oauth_password_gate, readme_multi_role_auth [INFERRED 0.95]
- **KanjiPaham Data & Localization Pipeline** — docs_architecture_kanji_data_source, docs_architecture_kanjivg_hex_convention, docs_task_jaisho_localization, docs_task_hybrid_kanji_fetching, readme_model_kanji [INFERRED 0.95]

## Communities (39 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.12
Nodes (22): devDependencies, prisma@^5.22.0, tailwindcss@^4, @tailwindcss/postcss@^4, tsx@^4.23.13, @types/bcryptjs@^2.4.6, @types/node@^20, @types/react@^19 (+14 more)

### Community 1 - "app/layout.tsx"
Cohesion: 0.10
Nodes (23): metadata, RootLayout(), viewport, AnswerState, getKanjiOptionFontSize(), GlobalQuizPage(), isKanji(), JLPTQuestion (+15 more)

### Community 2 - "auth"
Cohesion: 0.09
Nodes (28): bcryptjs@^3.0.3, bcryptjs, DELETE(), dynamic, dynamic, GET(), POST(), dynamic (+20 more)

### Community 3 - "next"
Cohesion: 0.07
Nodes (33): nextConfig, lucide-react, next, react, dynamic, GET(), AuthErrorContent(), AuthErrorPage() (+25 more)

### Community 4 - "[subLevel]/quiz/page.tsx"
Cohesion: 0.12
Nodes (16): dynamic, AnswerState, getKanjiOptionFontSize(), isKanjiLike(), Mode, QuizHeader(), QuizPage(), startFlashcard() (+8 more)

### Community 5 - "download-svg.ts"
Cohesion: 0.12
Nodes (20): DATA_DIR, downloadSvg(), KanjiEntry, loadEntries(), main(), sleep(), SVG_DIR, main() (+12 more)

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

### Community 11 - "VocabExamPractice.tsx"
Cohesion: 0.19
Nodes (8): dynamic, VocabExamPage(), AnswerState, isUsageDetail(), Props, QuizModeFilter, VocabExamPractice(), VocabExamUsageWrongDetail

### Community 12 - "QuestionsDashboard"
Cohesion: 0.32
Nodes (5): QuestionPreview, QuestionsDashboard(), fetchBanks(), handleDeleteConfirm(), handleSaveBank()

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

### Community 26 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @auth/prisma-adapter@^2.11.3, lucide-react@^1.45.0, @napi-rs/canvas@^1.0.9, next@16.3.5, next-themes@^0.4.6, nextjs-toploader@^3.9.17, @prisma/client@^5.22.0 (+8 more)

### Community 27 - "2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`)"
Cohesion: 0.22
Nodes (8): 2026-11-26 — Enrich Kanji/Vocab Datasets (Mnemonics, Examples) & Add Dokkai / Contextual Vocab Datasets, 2026-11-26 — Setup Graphify & Adapt Global Agent Rules (`AGENTS.md`), Decision & Implementation Log, Implementation Status & Completion Report, Proposed Plan & Questions, Proposed Plan & User Request, Research & Decisions, User Approval & Rationale

### Community 29 - "Toast.tsx"
Cohesion: 0.18
Nodes (12): LoginForm(), LoginPage(), RegisterPage(), GitHubIcon(), InfoPage(), InstagramIcon(), LinkedInIcon(), Toast (+4 more)

### Community 30 - "parse/route.ts"
Cohesion: 0.29
Nodes (7): mammoth@^1.12.3, pdf-parse@^2.4.5, mammoth, pdf-parse, dynamic, pdfParse, POST()

### Community 31 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.5, eslint, eslint-config-next

### Community 32 - "next-auth"
Cohesion: 0.40
Nodes (4): next-auth@^5.0.0-beta.32, next-auth, next-auth, Session

### Community 33 - "types.ts"
Cohesion: 0.17
Nodes (13): Implementation & Completion Report, FONT_SIZES, KIND_LABELS, Props, DokkaiPassage, DokkaiQuestion, KanaType, KanjiVocab (+5 more)

### Community 34 - "seed-exercises.ts"
Cohesion: 0.22
Nodes (10): fetchJson(), main(), normalizeUsageWrong(), RawDokkaiPassage, RawDokkaiQuestion, RawVocabExamEntry, RawVocabPara, RawVocabUsage (+2 more)

### Community 35 - "exercises.ts"
Cohesion: 0.31
Nodes (6): dynamic, GET(), DokkaiPage(), dynamic, getDokkaiPassages(), parseStringRecord()

### Community 36 - "vocab/route.ts"
Cohesion: 0.38
Nodes (5): dynamic, GET(), shuffleCopy(), getVocabExamQuestions(), parseVocabWrongMap()

### Community 37 - "KanaClient.tsx"
Cohesion: 0.48
Nodes (4): KanaPage(), KanaClient(), Props, KanaEntry

### Community 38 - "DokkaiPractice"
Cohesion: 0.50
Nodes (3): DokkaiPractice(), markDone(), selectAnswer()

## Knowledge Gaps
- **25 isolated node(s):** `{ GET, POST }`, `Progress Engine`, `User Model`, `KanjiPaham Brand Name`, `Japanese Motifs (Rising Sun, Pagoda, Mount Fuji, Sakura)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 200 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/layout.tsx`, `auth`, `exercises.ts`, `vocab/route.ts`, `[subLevel]/quiz/page.tsx`, `types.ts`, `VocabExamPractice.tsx`, `dependencies`, `Toast.tsx`, `parse/route.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Progress Engine`, `User Model` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `package.json`, `app/layout.tsx`, `types.ts`, `[subLevel]/quiz/page.tsx`, `KanaClient.tsx`, `VocabExamPractice.tsx`, `QuestionsDashboard`, `dependencies`, `Toast.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09747899159663866 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `next` to `package.json`, `app/layout.tsx`, `auth`, `types.ts`, `[subLevel]/quiz/page.tsx`, `VocabExamPractice.tsx`, `QuestionsDashboard`, `dependencies`, `Toast.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `auth` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._