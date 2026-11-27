/**
 * scripts/seed-radicals.ts
 *
 * Fetches Japanese radicals + KRADFILE/RADKFILE mappings from
 * jkindrix/japanese-language-data (CC BY-SA 4.0), filters kanji mappings
 * to our N5-N1 corpus (src/data/kanji/n1..n5.json), injects `radicals`
 * onto each KanjiEntry, and writes src/data/kanji/radicals.json.
 *
 * Usage:
 *   npx tsx scripts/seed-radicals.ts
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { KanjiEntry, RadicalEntry } from "../src/lib/types";

const RADICALS_URL =
  "https://raw.githubusercontent.com/jkindrix/japanese-language-data/main/data/core/radicals.json";

interface RawRadicalItem {
  radical: string;
  stroke_count: number;
  classical_number?: number | null;
  meanings?: string[];
  kanji?: string[];
}

interface RawRadicalsFile {
  radicals: RawRadicalItem[];
  kanji_to_radicals: Record<string, string[]>;
}

async function main(): Promise<void> {
  console.log("⬇  Fetching radicals.json from jkindrix/japanese-language-data…");
  const res = await fetch(RADICALS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${RADICALS_URL}`);
  const raw = (await res.json()) as RawRadicalsFile;

  // Load N5-N1 kanji in JLPT order (5 -> 1) so each radical's kanjiChars is sorted N5 -> N1
  const kanjiMetaMap = new Map<string, { jlpt: number; freq: number | null }>();
  const kanjiLevels: Array<{ level: number; path: string; entries: KanjiEntry[] }> = [];

  for (const level of [5, 4, 3, 2, 1]) {
    const filePath = join(process.cwd(), "src", "data", "kanji", `n${level}.json`);
    if (!existsSync(filePath)) continue;
    const entries = JSON.parse(readFileSync(filePath, "utf-8")) as KanjiEntry[];
    for (const entry of entries) {
      kanjiMetaMap.set(entry.character, { jlpt: entry.jlpt, freq: entry.freq });
      const rads = raw.kanji_to_radicals[entry.character];
      if (rads && rads.length > 0) {
        entry.radicals = rads;
      }
    }
    kanjiLevels.push({ level, path: filePath, entries });
  }

  // Write updated kanji JSONs with `radicals` field
  for (const { level, path, entries } of kanjiLevels) {
    writeFileSync(path, JSON.stringify(entries, null, 2), "utf-8");
    const withRad = entries.filter((e) => e.radicals && e.radicals.length > 0).length;
    console.log(`✓  N${level}: ${withRad}/${entries.length} kanji mapped to Japanese radicals`);
  }

  // Build RadicalEntry[] filtered to kanji existing in our N5-N1 corpus
  const radicalsOut: RadicalEntry[] = [];
  for (const item of raw.radicals) {
    const matchedKanji = (item.kanji ?? []).filter((ch) => kanjiMetaMap.has(ch));
    if (matchedKanji.length === 0) continue;

    matchedKanji.sort((a, b) => {
      const ma = kanjiMetaMap.get(a)!;
      const mb = kanjiMetaMap.get(b)!;
      if (ma.jlpt !== mb.jlpt) return mb.jlpt - ma.jlpt; // N5 (5) first -> N1 (1)
      if (ma.freq === null && mb.freq === null) return 0;
      if (ma.freq === null) return 1;
      if (mb.freq === null) return -1;
      return ma.freq - mb.freq;
    });

    radicalsOut.push({
      radical: item.radical,
      strokeCount: item.stroke_count,
      classicalNumber: item.classical_number ?? null,
      meanings: item.meanings ?? [],
      kanjiChars: matchedKanji,
    });
  }

  radicalsOut.sort((a, b) => {
    if (a.strokeCount !== b.strokeCount) return a.strokeCount - b.strokeCount;
    return (a.classicalNumber ?? 999) - (b.classicalNumber ?? 999);
  });

  const outPath = join(process.cwd(), "src", "data", "kanji", "radicals.json");
  writeFileSync(outPath, JSON.stringify(radicalsOut, null, 2), "utf-8");
  console.log(`✓  Saved ${radicalsOut.length} Japanese radicals → src/data/kanji/radicals.json`);
}

main().catch((err) => {
  console.error("✗  Radical seed failed:", err);
  process.exit(1);
});
