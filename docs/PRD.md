# Product Requirements Document (PRD): KanjiPaham

## 1. Overview

A mobile-first web app to learn Japanese Kana (Hiragana, Katakana) and Kanji (JLPT N5 to N1). Features include stroke animation, audio pronunciation, toggleable furigana, progress tracking, and structured testing.

## 2. Target Users

Learners of the Japanese language wanting a structured, bite-sized, and distraction-free mobile study companion.

## 3. Scope & Features

### 3.1 Learning Modules

- **Kana:** Hiragana and Katakana tables with strokes & sounds.
- **Kanji (N5 to N1):**
  - Segmented by JLPT level and sub-levels (e.g., N5 Level 1: Numbers, Level 2: Family).
  - Main Kanji Card: Big central character, stroke-order animation, On'yomi, Kun'yomi, Indonesian meaning.
  - Sentence Examples: Mini sentences with toggleable Furigana (show/hide) and clickable audio button for native pronunciation.

### 3.2 Testing System

- **Flashcard Match:** Match Kanji to Indonesian translation or vice versa.
- **Multiple Choice Quiz (MCQ):** 4 options (A, B, C, D) with 1 correct answer (testing readings, meanings, or compound words).

### 3.3 Progress & Auth

- User Authentication: Credentials (Email/Password with hashing) and Google OAuth.
- Progress Engine: Track completed characters, last visited lesson, quiz scores, and streak data.

## 4. Non-Functional Requirements

- First Contentful Paint (FCP) < 1.2s on 4G mobile.
- Audio playback latency < 150ms.
- Persistent offline-friendly cache for local JSON Kanji assets.
