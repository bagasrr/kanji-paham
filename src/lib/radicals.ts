/**
 * src/lib/radicals.ts
 *
 * Hybrid DB-first / JSON-fallback loaders for Japanese radicals and
 * radical-grouped Kanji circles.
 */

import { prisma } from "@/lib/prisma";
import { getKanjiByLevel } from "@/lib/kanji";
import type { KanjiEntry, RadicalEntry } from "@/lib/types";

export async function getRadicals(): Promise<RadicalEntry[]> {
  try {
    const rows = await prisma.radical.findMany({
      orderBy: [{ strokeCount: "asc" }, { classicalNumber: "asc" }],
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        radical: r.radical,
        strokeCount: r.strokeCount,
        classicalNumber: r.classicalNumber,
        meanings: r.meanings,
        kanjiChars: r.kanjiChars,
      }));
    }
  } catch (error) {
    console.warn("[radicals.ts] Database query failed, falling back to JSON.", error);
  }

  const data = await import("@/data/kanji/radicals.json");
  return data.default as RadicalEntry[];
}

export async function getKanjiCircleByRadical(radicalChar: string): Promise<{
  radical: RadicalEntry | null;
  kanjis: KanjiEntry[];
}> {
  const radicals = await getRadicals();
  const radical = radicals.find((r) => r.radical === radicalChar) ?? null;
  if (!radical) return { radical: null, kanjis: [] };

  const allLevels = await Promise.all(
    ([5, 4, 3, 2, 1] as const).map((lvl) => getKanjiByLevel(lvl))
  );
  const kanjiMap = new Map<string, KanjiEntry>();
  for (const list of allLevels) {
    for (const k of list) {
      kanjiMap.set(k.character, k);
    }
  }

  const kanjis: KanjiEntry[] = [];
  for (const ch of radical.kanjiChars) {
    const entry = kanjiMap.get(ch);
    if (entry) kanjis.push(entry);
  }

  return { radical, kanjis };
}
