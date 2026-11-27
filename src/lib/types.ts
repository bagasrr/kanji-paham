/**
 * src/lib/types.ts
 *
 * Shared TypeScript types for the KanjiPaham app.
 */

// ── Kanji ─────────────────────────────────────────────────────────────────────

export interface KanjiSoundHook {
  r: string;
  hook: string;
  emoji?: string;
}

export interface VocabExample {
  ja: string;
  furigana?: string;
  en: string;
  tatoebaId?: number;
}

export interface KanjiVocab {
  word: string;
  reading: string;
  meanings: string[];
  meanings_id?: string[];
  mnemonic?: string;
  examples?: VocabExample[];
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
  /** On'yomi (Chinese-derived) readings in katakana */
  readings_on: string[];
  /** Kun'yomi (Japanese-native) readings in hiragana */
  readings_kun: string[];
  /** KanjiVG SVG filename, e.g. "065e5.svg" */
  svgFile: string;
  /** 1-based group index within the JLPT level; 10 kanji per subLevel */
  subLevel: number;
  /** Short mnemonic keyword & story from kanji_mnemonic (CC BY-SA 4.0) */
  keyword?: string;
  mnemonic?: string;
  components?: string[];
  /** Japanese radical/component glyphs from KRADFILE/RADKFILE (CC BY-SA 4.0) */
  radicals?: string[];
  soundHooks?: KanjiSoundHook[];
  /** Vocabulary examples from OpenJLPT & kanji_mnemonic */
  vocab?: KanjiVocab[];
}

export interface RadicalEntry {
  radical: string;
  strokeCount: number;
  classicalNumber: number | null;
  meanings: string[];
  kanjiChars: string[];
}

export interface KanjiReferenceItem {
  character: string;
  jlpt: number;
  subLevel: number;
  meanings: string[];
  meanings_id?: string[];
  readings_on: string[];
  readings_kun: string[];
}

// ── Exercises (Dokkai & Contextual Vocab) ─────────────────────────────────────

export interface DokkaiQuestion {
  orderIdx: number;
  prompt: string;
  options: string[];
  optsEn: string[];
  answer: number;
  why?: string;
  wrong?: Record<string, string>;
}

export interface DokkaiPassage {
  id: string;
  kind: "short" | "medium" | "info" | "long" | string;
  title: string;
  text: string;
  en: string;
  questions: DokkaiQuestion[];
}

export interface VocabExamUsageWrongDetail {
  why: string;
  fix?: string;
  fixEn?: string;
}

export type VocabExamWrongMap = Record<string, string | VocabExamUsageWrongDetail>;

export interface VocabExamQuestion {
  targetWord: string;
  mode: "para" | "usage";
  prompt: string;
  options: string[];
  optsEn: string[];
  answer: number;
  why?: string;
  en?: string;
  wrong?: VocabExamWrongMap;
}

// ── Kana ──────────────────────────────────────────────────────────────────────

export type KanaType = "hiragana" | "katakana";

export interface KanaEntry {
  character: string;
  romaji: string;
  type: KanaType;
  svgFile: string;
}
