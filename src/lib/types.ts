/**
 * src/lib/types.ts
 *
 * Shared TypeScript types for the KanjiPaham app.
 */

// ── Kanji ─────────────────────────────────────────────────────────────────────

export interface KanjiVocab {
  word: string;
  reading: string;
  meanings: string[];
  meanings_id?: string[];
}

export interface KanjiEntry {
  /** The kanji character itself, e.g. "日" */
  character: string;
  strokes: number;
  grade: number | null;
  /** Newspaper frequency rank (lower = more common). null if unknown. */
  freq: number | null;
  /** JLPT level: 5 = N5 (beginner) … 1 = N1 (advanced) */
  jlpt: number;
  /** English meanings from the source dataset */
  meanings: string[];
  meanings_id?: string[];
  /** On'yomi (Chinese-derived) readings in hiragana */
  readings_on: string[];
  /** Kun'yomi (Japanese-native) readings in hiragana */
  readings_kun: string[];
  /** KanjiVG SVG filename, e.g. "065e5.svg" */
  svgFile: string;
  /** 1-based group index within the JLPT level; 10 kanji per subLevel */
  subLevel: number;
  /** Vocabulary examples from OpenJLPT */
  vocab?: KanjiVocab[];
}

// ── Kana ──────────────────────────────────────────────────────────────────────

export type KanaType = "hiragana" | "katakana";

export interface KanaEntry {
  character: string;
  romaji: string;
  type: KanaType;
  svgFile: string;
}

// ── Progress ──────────────────────────────────────────────────────────────────

export interface UserProgress {
  userId: string;
  characterId: string; // kanji character or kana
  completedAt: string; // ISO date string
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

export type QuizMode = "meaning" | "reading" | "compound";

export interface QuizQuestion {
  character: string;
  mode: QuizMode;
  correctAnswer: string;
  options: string[]; // 4 options including correct answer, shuffled
}
