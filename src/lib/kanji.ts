/**
 * src/lib/kanji.ts
 *
 * Utilities for working with kanji data in the app.
 * - SVG filename conversion (for KanjiVG stroke animations)
 * - Data loading helpers for JSON assets
 */

import type { KanjiEntry } from "@/lib/types";

// ── SVG ──────────────────────────────────────────────────────────────────────

/**
 * Convert a kanji character to its KanjiVG SVG filename.
 *
 * KanjiVG names files by the zero-padded 5-digit lowercase hex of the
 * Unicode code point.
 *
 * @example
 * kanjiToSvgFilename("日") // → "065e5.svg"
 * kanjiToSvgFilename("一") // → "04e00.svg"
 */
export function kanjiToSvgFilename(char: string): string {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) {
    throw new Error(`kanjiToSvgFilename: invalid character "${char}"`);
  }
  return codePoint.toString(16).padStart(5, "0") + ".svg";
}

/**
 * Returns the public URL path for a kanji's SVG stroke-order file.
 *
 * @example
 * kanjiSvgPath("日") // → "/svg/kanji/065e5.svg"
 */
export function kanjiSvgPath(char: string): string {
  return `/svg/kanji/${kanjiToSvgFilename(char)}`;
}

// ── Data loaders (server-side, called from Server Components / route handlers)

import { prisma } from '@/lib/prisma';

/**
 * Load all N5 kanji entries.
 */
export async function getN5Kanji(): Promise<KanjiEntry[]> {
  return getKanjiByLevel(5)
}

/**
 * Load kanji entries for any JLPT level (1–5) with Database fallback strategy.
 */
export async function getKanjiByLevel(level: 1 | 2 | 3 | 4 | 5): Promise<KanjiEntry[]> {
  try {
    const dbKanjis = await prisma.kanji.findMany({
      where: { jlpt: level },
      include: { vocab: true },
      orderBy: { freq: 'asc' }
    });

    if (dbKanjis && dbKanjis.length > 0) {
      // Map Prisma schema to KanjiEntry interface
      return dbKanjis.map((k) => ({
        character: k.character,
        strokes: k.strokes,
        grade: k.grade,
        freq: k.freq,
        jlpt: k.jlpt,
        meanings: k.meanings,
        meanings_id: k.meanings_id,
        readings_on: k.readings_on,
        readings_kun: k.readings_kun,
        svgFile: k.svgFile,
        subLevel: k.subLevel,
        vocab: k.vocab.map(v => ({
          word: v.word,
          reading: v.reading,
          meanings: v.meanings,
          meanings_id: v.meanings_id
        }))
      })) as KanjiEntry[];
    }
  } catch (error) {
    console.warn(`[kanji.ts] Database query failed for level ${level}, falling back to JSON.`, error);
  }

  // Fallback to JSON
  const data = await import(`@/data/kanji/n${level}.json`);
  return data.default as KanjiEntry[];
}

/**
 * Get all kanji entries for a specific subLevel within a JLPT level.
 *
 * @example
 * getKanjiBySubLevel(5, 1) // → first 10 N5 kanji
 */
export async function getKanjiBySubLevel(
  level: 1 | 2 | 3 | 4 | 5,
  subLevel: number
): Promise<KanjiEntry[]> {
  const all = await getKanjiByLevel(level);
  return all.filter((k) => k.subLevel === subLevel);
}

/**
 * Get all unique subLevel values for a JLPT level.
 */
export async function getSubLevels(level: 1 | 2 | 3 | 4 | 5): Promise<number[]> {
  const all = await getKanjiByLevel(level);
  const levels = [...new Set(all.map((k) => k.subLevel))].sort((a, b) => a - b);
  return levels;
}
