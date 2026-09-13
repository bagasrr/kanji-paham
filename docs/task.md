# Project Task Tracker

## Phase 1: Setup & Data Engine

- [x] 1.1: Initialize Next.js project with Tailwind CSS v4, Lucide React, and TypeScript.
- [x] 1.2: Setup Prisma schema & configure PostgreSQL connection.
- [x] 1.3: Create data ingestion script (`scripts/seed-kanji.ts`) to fetch/parse `kanji.json` from `davidluzgouveia/kanji-data`.
- [x] 1.4: Map Unicode character to hex code to dynamically load KanjiVG SVG files from `public/svg/kanji/`.
- [x] 1.5: Implement Web Speech API audio hook as lightweight pronunciation fallback.

## Phase 2: Auth System

- [x] 2.1: Implement NextAuth with Credentials (bcrypt) & Google OAuth.
- [x] 2.2: Setup login, register, and middleware protected routes.

## Phase 3: Core Learning UI (Mobile-First)

- [x] 3.1: Build Kanji Card layout with large main Kanji & Reading grid.
- [x] 3.2: Implement Kanji stroke animation viewer.
- [x] 3.3: Implement Furigana toggle (HTML ruby/rt tag switcher).
- [x] 3.4: Integrate sentence audio player with Lucide icon controls.

## Phase 4: Progress & Levels

- [x] 4.1: Build Level and Sublevel selector screens (N5 - N1 split).
- [x] 4.2: Implement user progress tracking (save last viewed & completion to DB).

## Phase 5: Quiz & Testing

- [x] 5.1: Build Flashcard matching game (Kanji <-> Indo).
- [x] 5.2: Build 4-option MCQ Quiz with score tracking.

## Phase 6: Polish & E2E

- [x] 6.1: Theme toggle (Cream Light vs. Soft Dark Navy).
- [x] 6.2: Playwright E2E testing for auth, learning card, and quiz flow.

## Phase 7 : Add Dark & light theme work

- [x] 7.1: make the toggle theme working : use this pallete color for light theme [800020, F3E6D5, FFF9F2, D45060], for dark theme [092328, 12544F, 2A835F, 8BBB92]
- [x] 7.2: Change the ui i want the example font is bigger that the romaji (furigana) and i want the furigana position is up the word example like normally japanese place furigana, so it can reference which one pronounce that furigana

## Phase 8 : Search all the public data on github for SVG & SVG animation, Word Example Text, Word Example Voice,

- [x] 8.1 Search for data on github (public) for N5 Kanji SVG WriteFlow & Example word text & voice, if possible search for the meaning in indonesia not english, if doesnt exist you could seed the json with bahasa indonesia meaning
- [x] 8.2 for the word example, search as much as list of kun-yomi and on-yomi have, because i want every -yomi have example for it.
- [x] 8.3 After get data completed, put the data on folder that exists for that, @public/svg for svg and others you can explore in this projects
- [x] 8.4 if possible or you found the word example voice, change the ui like in left example the voice button shows up for pronounce the example, if not just show it but disable the button

## Phase 9: Kanji Navigation & UX Improvements

- [x] 9.1 Add previous/next kanji navigation buttons within a sub-level.
- [x] 9.2 Add left/right keyboard arrow event listeners for fast navigation between kanji cards.

## Phase 10: N4 & N3 Data Implementation

- [x] 10.1 Seed and generate kanji data and vocabulary for N4.
- [x] 10.2 Seed and generate kanji data and vocabulary for N3.
- [x] 10.3 Unlock N4 and N3 in the learning UI.

## Phase 11: N2 & N1 Data Implementation & Vocabulary Expansion

- [x] 11.1 Increase vocabulary limit to maximum available (cap at 20) for all levels.
- [x] 11.2 Seed and generate kanji data and massive vocabulary list for N2.
- [x] 11.3 Seed and generate kanji data and massive vocabulary list for N1.
- [x] 11.4 Unlock N2 and N1 in the learning UI.

## Phase 12: Advanced Quiz & JLPT Simulation

- [x] 12.1 Convert all On'yomi readings from Hiragana to Katakana in data seeding.
- [x] 12.2 Add Floating Action Button (FAB) for Quiz on Sublevel pages.
- [x] 12.3 Randomize questions and options in Sublevel Quiz with Fisher-Yates shuffle. Include 5 modes: Kanji -> Arti, Kanji -> On'yomi, Kanji -> Kun'yomi, Arti -> Kanji, Bacaan -> Kanji.
- [x] 12.4 Build Global JLPT Vocabulary Simulation in `/quiz` with robust randomization. Include 5 vocab modes (Word->Reading, Reading->Word, Word->Meaning, Meaning->Word, Reading->Word Alt).

## Phase 13: Indonesian Localization & Language Toggle

- [x] 13.1 Download and integrate JaIsho Indonesian Dictionary (`jaisho-kanji.ndjson` and `jaisho-vocab.ndjson`).
- [x] 13.2 Map and inject Indonesian meanings (`meanings_id`) into all Kanji and Vocab arrays via `seed-kanji.ts`.
- [x] 13.3 Add global Language Context provider (`LanguageProvider.tsx`) for EN/ID switching.
- [x] 13.4 Create `TopBar.tsx` for Language and Theme toggles (moved from BottomNav to Top Right).
- [x] 13.5 Support dynamic language switching in KanjiCard, Sublevel Quiz, and JLPT Quiz Simulation.

## Phase 14: Profile & OAuth Post-Login Setup

- [x] 14.1 Update `/profile` page to display real logged-in user information (Avatar, Name, Email) dynamically based on NextAuth session.
- [x] 14.2 Modify `auth.ts` to inject `hasPassword` flag into JWT and Session object on initial login.
- [x] 14.3 Create middleware/proxy interception to detect OAuth users without a password and force redirect them to `/auth/set-password`.
- [x] 14.4 Build API route (`/api/auth/set-password`) and UI page to allow Google OAuth users to set their initial account password, integrating with `password_set` cookie for seamless redirect unblocking.

## Phase 15: Progress Tracking & Weak Kanji Detection

- [x] 15.1 Expand Prisma Schema (`Kanji`, `Vocab`, `WeakKanji`) to store kanji data in Postgres for relational querying.
- [x] 15.2 Create `seed-db.ts` script to inject all N1-N5 JSON data into the database.
- [x] 15.3 Refactor `getKanjiByLevel` to use a Hybrid approach (try Database first, fallback to JSON files if DB is empty).
- [x] 15.4 Update Sublevel UI (`/learn/[level]/page.tsx`) to show green checkmarks (Tuntas) if a user scores >= 80% on a sublevel quiz.
- [x] 15.5 Update Sublevel Quiz (`/learn/[level]/[subLevel]/quiz/page.tsx`) to track mistakes per character and save to a new `/api/user/quiz-result` endpoint.
- [x] 15.6 Add "Kanji yang Perlu Dilatih" section to `/profile` page showing top 10 kanji the user struggled with.

## Phase 16: Roles & Teacher Dashboard (Foundation)

- [x] 16.1 Extend Prisma Schema with `Role` enum (GAKUSEI, SENSEI, ADMIN) and new models `TeacherApplication`, `CustomQuestionBank`, and `CustomQuestion`.
- [x] 16.2 Update `auth.ts` NextAuth configuration to persist and expose user `role` in JWT and Session.
- [x] 16.3 Build UI and API (`/profile/apply-sensei`) for Gakusei to upload JLPT certificates and apply to become a Sensei.
- [x] 16.4 Create protected routing layout for the unified Teacher/Admin Dashboard (`/dashboard/*`).
- [ ] 16.5 Build UI/API for Admins to verify/approve Sensei applications.
- [ ] 16.6 Build CRUD interfaces for modifying Kanji/Vocab data in the dashboard.
- [x] 16.7 Build Question Bank manager to allow uploading (PDF/Word parsing), previewing, mapping to optional Kanji reference, and deleting custom multiple-choice packages.
