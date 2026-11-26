# Graph Report - web belajar kanji  (2026-11-26)

## Corpus Check
- Large corpus: 80 files · ~682,309 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 404 nodes · 649 edges · 25 communities (16 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Packages & ESLint Configuration
- Authentication Pages & Forms
- API Routes & Auth Hashing
- Kanji Pages & Next Config
- Sublevel Quiz & Kana UI
- SVG & DB Seed Scripts
- Roadmap & Phase Documentation
- TypeScript Compiler Configuration
- Docker Compose Postgres Setup
- KanjiPaham PRD & Media Strategy
- NPM Build & Seed Scripts
- Global JLPT Quiz Page
- Teacher Question Bank UI
- Auth Security & User Progress
- KanjiPaham App Icon Brand
- Next.js 16 Agent Guidelines
- Quiz Result & Weak Kanji
- Mobile-First UI Standards
- PostCSS Tailwind Configuration
- JLPT Quiz API Endpoint
- NextAuth Route Handler Export

## God Nodes (most connected - your core abstractions)
1. `next` - 31 edges
2. `auth` - 27 edges
3. `lucide-react` - 18 edges
4. `react` - 18 edges
5. `compilerOptions` - 16 edges
6. `useLanguage()` - 15 edges
7. `QuizPage()` - 14 edges
8. `prisma` - 13 edges
9. `scripts` - 11 edges
10. `getKanjiBySubLevel()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `KanjiPaham Platform` --implements--> `KanjiPaham PRD`  [INFERRED]
  README.md → docs/PRD.md
- `KanjiCard Component` --implements--> `KanjiCard UI Specification`  [INFERRED]
  README.md → docs/design-system.md
- `Dual Quiz & JLPT Simulation (/quiz)` --implements--> `PRD Testing System (Flashcard Match & MCQ)`  [INFERRED]
  README.md → docs/PRD.md
- `Dual Quiz & JLPT Simulation (/quiz)` --references--> `Fisher-Yates Quiz Randomization & 5-Mode JLPT Sim (Phase 12)`  [INFERRED]
  README.md → docs/task.md
- `Multi-Role Authentication (GAKUSEI, SENSEI, ADMIN)` --implements--> `Authentication & JWT Session Flow`  [INFERRED]
  README.md → docs/security.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KanjiPaham Core Learning & Assessment Loop** — readme_kana_module, readme_kanji_curriculum, readme_kanjicard, readme_quiz_system, readme_weak_kanji_tracker [EXTRACTED 1.00]
- **KanjiPaham Authentication & Security Architecture** — docs_security_password_policy, docs_security_auth_flow, docs_security_api_protection, docs_task_oauth_password_gate, readme_multi_role_auth [INFERRED 0.95]
- **KanjiPaham Data & Localization Pipeline** — docs_architecture_kanji_data_source, docs_architecture_kanjivg_hex_convention, docs_task_jaisho_localization, docs_task_hybrid_kanji_fetching, readme_model_kanji [INFERRED 0.95]

## Communities (25 total, 9 thin omitted)

### Community 0 - "Packages & ESLint Configuration"
Cohesion: 0.05
Nodes (52): eslintConfig, dependencies, @auth/prisma-adapter@^2.11.3, lucide-react@^1.45.0, mammoth@^1.12.3, @napi-rs/canvas@^1.0.9, next@16.3.5, next-auth@^5.0.0-beta.32 (+44 more)

### Community 1 - "Authentication Pages & Forms"
Cohesion: 0.07
Nodes (34): nextjs-toploader@^3.9.17, nextjs-toploader, react, LoginForm(), LoginPage(), RegisterPage(), SetPasswordPage(), GitHubIcon() (+26 more)

### Community 2 - "API Routes & Auth Hashing"
Cohesion: 0.09
Nodes (28): bcryptjs@^3.0.3, bcryptjs, DELETE(), dynamic, dynamic, GET(), POST(), dynamic (+20 more)

### Community 3 - "Kanji Pages & Next Config"
Cohesion: 0.09
Nodes (24): nextConfig, lucide-react, next, dynamic, GET(), AuthErrorContent(), AuthErrorPage(), LevelPage() (+16 more)

### Community 4 - "Sublevel Quiz & Kana UI"
Cohesion: 0.08
Nodes (25): dynamic, KanaPage(), AnswerState, getKanjiOptionFontSize(), isKanjiLike(), Mode, QuizHeader(), QuizPage() (+17 more)

### Community 5 - "SVG & DB Seed Scripts"
Cohesion: 0.08
Nodes (27): DATA_DIR, downloadSvg(), KanjiEntry, loadEntries(), main(), sleep(), SVG_DIR, prisma (+19 more)

### Community 6 - "Roadmap & Phase Documentation"
Cohesion: 0.08
Nodes (24): davidluzgouveia/kanji-data Source, Design System Theme & Color Palette, PRD Testing System (Flashcard Match & MCQ), Authentication & JWT Session Flow, Fisher-Yates Quiz Randomization & 5-Mode JLPT Sim (Phase 12), JaIsho Indonesian Dictionary Localization (Phase 13), Roles & Teacher/Admin Dashboard (Phase 16), Project Task Tracker (Phases 1-16) (+16 more)

### Community 7 - "TypeScript Compiler Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "Docker Compose Postgres Setup"
Cohesion: 0.13
Nodes (14): container_name, environment, image, ports, restart, volumes, POSTGRES_DB, POSTGRES_PASSWORD (+6 more)

### Community 9 - "KanjiPaham PRD & Media Strategy"
Cohesion: 0.17
Nodes (10): KanjiVG 5-Digit Hex SVG Convention, KanjiCard UI Specification, KanjiPaham PRD, Developer Info Page (/info), Interactive Kana Learning (/kana), Tiered Kanji Curriculum (/learn), KanjiCard Component, KanjiPaham Platform (+2 more)

### Community 10 - "NPM Build & Seed Scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, postinstall, seed:kanji, seed:n5, start (+3 more)

### Community 11 - "Global JLPT Quiz Page"
Cohesion: 0.24
Nodes (6): AnswerState, getKanjiOptionFontSize(), GlobalQuizPage(), isKanji(), JLPTQuestion, LEVEL_DATA

### Community 12 - "Teacher Question Bank UI"
Cohesion: 0.32
Nodes (5): QuestionPreview, QuestionsDashboard(), fetchBanks(), handleDeleteConfirm(), handleSaveBank()

### Community 13 - "Auth Security & User Progress"
Cohesion: 0.29
Nodes (5): Progress Engine, POST /api/auth/register, GET / POST /api/user/progress, User Model, UserProgress Model

### Community 14 - "KanjiPaham App Icon Brand"
Cohesion: 0.33
Nodes (7): KanjiPaham App Icon (src/app/icon.png), Japanese Motifs (Rising Sun, Pagoda, Mount Fuji, Sakura), Open Book Displaying Kanji (漢字), KanjiPaham Brand Name, Shiba Inu Mascot Wearing Hachimaki, Indonesian Tagline: Kanji Jadi Lebih Mudah, Japanese Tagline: 学んで、もっとわかる

### Community 16 - "Quiz Result & Weak Kanji"
Cohesion: 0.67
Nodes (3): POST /api/user/quiz-result, QuizResult Model, WeakKanji Model

## Knowledge Gaps
- **25 isolated node(s):** `{ GET, POST }`, `node_modules/next/dist/docs/`, `Interactive Kana Learning (/kana)`, `Developer Info Page (/info)`, `POST /api/auth/set-password` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 164 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Kanji Pages & Next Config` to `Packages & ESLint Configuration`, `Authentication Pages & Forms`, `API Routes & Auth Hashing`, `Sublevel Quiz & Kana UI`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `node_modules/next/dist/docs/`, `Interactive Kana Learning (/kana)` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Packages & ESLint Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `Packages & ESLint Configuration` to `API Routes & Auth Hashing`, `SVG & DB Seed Scripts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `Authentication Pages & Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.07088989441930618 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Authentication Pages & Forms` to `Packages & ESLint Configuration`, `Kanji Pages & Next Config`, `Sublevel Quiz & Kana UI`, `Global JLPT Quiz Page`, `Teacher Question Bank UI`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `API Routes & Auth Hashing` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._