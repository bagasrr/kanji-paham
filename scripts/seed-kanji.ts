/**
 * scripts/seed-kanji.ts
 *
 * Downloads raw kanji dataset from davidluzgouveia/kanji-data,
 * filters by JLPT level, assigns subLevel (10 kanji per group),
 * and writes the result to src/data/kanji/n<level>.json.
 *
 * Usage:
 *   npx tsx scripts/seed-kanji.ts          # seeds all levels
 *   npx tsx scripts/seed-kanji.ts --level=5  # seeds N5 only
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── Types ────────────────────────────────────────────────────────────────────

interface RawKanjiEntry {
  strokes: number;
  grade?: number;
  freq?: number;
  jlpt_old?: number;
  jlpt_new?: number;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
}

interface RawKanjiData {
  [character: string]: RawKanjiEntry;
}

export interface KanjiVocab {
  word: string;
  reading: string;
  meanings: string[];
  meanings_id?: string[];
}

export interface KanjiEntry {
  character: string;
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt: number;
  meanings: string[];
  meanings_id?: string[];
  readings_on: string[];
  readings_kun: string[];
  /** SVG filename derived from UTF-16 hex code, e.g. "065e5.svg" */
  svgFile: string;
  /** 1-based group index; 10 kanji per subLevel */
  subLevel: number;
  vocab?: KanjiVocab[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a kanji character to its KanjiVG SVG filename.
 * KanjiVG uses zero-padded 5-digit hex of the Unicode code point.
 * e.g. "日" (U+65E5) → "065e5.svg"
 */
function toSvgFilename(char: string): string {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) throw new Error(`Invalid character: ${char}`);
  return codePoint.toString(16).padStart(5, "0") + ".svg";
}

const RAW_URL =
  "https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json";

const KANJI_PER_SUBLEVEL = 10;

// ── Main ─────────────────────────────────────────────────────────────────────

async function fetchRawData(): Promise<RawKanjiData> {
  console.log(`⬇  Fetching kanji data from GitHub…`);
  const res = await fetch(RAW_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data = (await res.json()) as RawKanjiData;
  console.log(`✓  Fetched ${Object.keys(data).length} total kanji entries.`);
  return data;
}

const N5_GROUPS = [
  { id: 1, title: 'Angka & Bilangan', kanji: ['一','二','三','四','五','六','七','八','九','十','百','千','万','半'] },
  { id: 2, title: 'Waktu & Hari', kanji: ['日','月','火','水','木','金','土','年','今','時','毎','午','後','前','間'] },
  { id: 3, title: 'Orang & Keluarga', kanji: ['人','子','女','男','父','母','友','生','先','名'] },
  { id: 4, title: 'Arah & Posisi', kanji: ['上','下','左','右','東','西','南','北','中','外'] },
  { id: 5, title: 'Alam & Ruang', kanji: ['山','川','天','雨','電','気','車','国','校'] },
  { id: 6, title: 'Kata Sifat Dasar', kanji: ['大','小','高','長','白'] },
  { id: 7, title: 'Kata Kerja 1', kanji: ['行','来','出','入','休','見','聞','読','書'] },
  { id: 8, title: 'Kata Kerja 2 & Lainnya', kanji: ['食','話','語','学','円','本','何'] }
];

function filterByJlpt(raw: RawKanjiData, level: number): KanjiEntry[] {
  const entries: KanjiEntry[] = [];

  for (const [character, entry] of Object.entries(raw)) {
    if (entry.jlpt_new !== level) continue;

    let subLevel = 0;
    if (level === 5) {
      const group = N5_GROUPS.find(g => g.kanji.includes(character));
      if (group) subLevel = group.id;
    }

    // Convert hiragana to katakana for On'yomi
    const convertToKatakana = (str: string) => {
      return str.replace(/[\u3041-\u3096]/g, (match) =>
        String.fromCharCode(match.charCodeAt(0) + 0x60)
      );
    };

    entries.push({
      character,
      strokes: entry.strokes,
      grade: entry.grade ?? null,
      freq: entry.freq ?? null,
      jlpt: level,
      meanings: entry.meanings,
      readings_on: entry.readings_on.map(convertToKatakana),
      readings_kun: entry.readings_kun,
      svgFile: toSvgFilename(character),
      subLevel,
    });
  }

  if (level === 5) {
    // Put ungrouped N5 kanji into a generic subLevel 9
    entries.forEach((e) => {
      if (e.subLevel === 0) e.subLevel = 9;
    });
    // Sort by subLevel, then frequency
    entries.sort((a, b) => {
      if (a.subLevel !== b.subLevel) return a.subLevel - b.subLevel;
      if (a.freq === null && b.freq === null) return 0;
      if (a.freq === null) return 1;
      if (b.freq === null) return -1;
      return a.freq - b.freq;
    });
  } else {
    // Other levels: sort by frequency and group by 10
    entries.sort((a, b) => {
      if (a.freq === null && b.freq === null) return 0;
      if (a.freq === null) return 1;
      if (b.freq === null) return -1;
      return a.freq - b.freq;
    });
    entries.forEach((e, i) => {
      e.subLevel = Math.floor(i / KANJI_PER_SUBLEVEL) + 1;
    });
  }

  return entries;
}

async function fetchVocabData(level: number) {
  try {
    const url = `https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n${level}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn(`!  Could not fetch vocab for N${level}:`, err);
    return [];
  }
}

async function seed(levels: number[]): Promise<void> {
  const raw = await fetchRawData();

  // Save raw snapshot for reference
  const rawDir = join(process.cwd(), "src", "data", "raw");
  mkdirSync(rawDir, { recursive: true });
  writeFileSync(
    join(rawDir, "kanji.json"),
    JSON.stringify(raw, null, 2),
    "utf-8"
  );
  console.log(`✓  Raw data saved to src/data/raw/kanji.json`);

  const kanjiDir = join(process.cwd(), "src", "data", "kanji");
  mkdirSync(kanjiDir, { recursive: true });

  for (const level of levels) {
    const entries = filterByJlpt(raw, level);
    
    // Fetch vocab and inject
    console.log(`⬇  Fetching vocab data for N${level} from OpenJLPT…`);
    const vocabData = await fetchVocabData(level);

    // Read JaIsho Dictionary files if available
    let jaishoKanji: Record<string, string[]> = {};
    let jaishoVocab: Record<string, string[]> = {};
    try {
      const fs = require('fs')
      
      const kanjiRaw = fs.readFileSync(join(process.cwd(), 'scripts', 'jaisho-kanji.ndjson'), 'utf-8')
      for (const line of kanjiRaw.split('\n')) {
        if (!line.trim()) continue;
        const parsed = JSON.parse(line)
        if (parsed.c && parsed.id) jaishoKanji[parsed.c] = parsed.id
      }
      
      const vocabRaw = fs.readFileSync(join(process.cwd(), 'scripts', 'jaisho-vocab.ndjson'), 'utf-8')
      for (const line of vocabRaw.split('\n')) {
        if (!line.trim()) continue;
        const parsed = JSON.parse(line)
        if (parsed.k && parsed.k[0] && parsed.s && parsed.s[0] && parsed.s[0].id) {
          // just taking the first kanji and first sense's ID array
          jaishoVocab[parsed.k[0]] = parsed.s[0].id
        }
      }
      console.log(`✓  Loaded JaIsho Dictionary (Kanji: ${Object.keys(jaishoKanji).length}, Vocab: ${Object.keys(jaishoVocab).length})`)
    } catch (e: any) {
      console.log('!  JaIsho dictionary files not found or failed to parse. Skipping Indonesian mapping. Error:', e.message)
    }

    if (vocabData.length > 0) {
      entries.forEach(entry => {
        // Map Kanji ID meaning
        if (jaishoKanji[entry.character]) {
          entry.meanings_id = jaishoKanji[entry.character]
        }

        // Find vocab that contains this kanji
        const matched = vocabData.filter((v: any) => v.word && v.word.includes(entry.character));
        entry.vocab = matched.slice(0, 20).map((v: any) => ({
          word: v.word,
          reading: v.reading || '',
          meanings: v.meanings || [],
          meanings_id: jaishoVocab[v.word] || []
        }));
      });
      console.log(`✓  Injected vocab examples and Indonesian meanings for N${level}.`);
    }

    const outPath = join(kanjiDir, `n${level}.json`);
    writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf-8");

    const subLevels = entries[entries.length - 1]?.subLevel ?? 0;
    console.log(
      `✓  N${level}: ${entries.length} kanji → ${subLevels} sub-levels saved to src/data/kanji/n${level}.json`
    );
  }
}

// ── CLI entry ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const levelArg = args.find((a) => a.startsWith("--level="));
const levels = levelArg
  ? [parseInt(levelArg.split("=")[1], 10)]
  : [5, 4, 3, 2, 1];

seed(levels).catch((err) => {
  console.error("✗  Seed failed:", err);
  process.exit(1);
});
