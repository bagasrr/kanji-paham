/**
 * scripts/seed-kanji.ts
 *
 * Downloads raw kanji dataset from davidluzgouveia/kanji-data,
 * vocab + Tatoeba example sentences from evanclan/OpenJLPT (CC BY-SA 4.0),
 * kanji/vocab mnemonics & fallback sentences from lczanna/kanji_mnemonic (CC BY-SA 4.0),
 * and maps Indonesian meanings from local scripts/jaisho-*.ndjson,
 * then writes enriched JSON files to src/data/kanji/n<level>.json.
 *
 * Usage:
 *   npx tsx scripts/seed-kanji.ts          # seeds all levels
 *   npx tsx scripts/seed-kanji.ts --level=5  # seeds N5 only
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  KanjiEntry,
  KanjiSoundHook,
  KanjiVocab,
  VocabExample,
} from "../src/lib/types";

// ── Remote Dataset Types ─────────────────────────────────────────────────────

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

type RawKanjiData = Record<string, RawKanjiEntry>;

interface OpenJlptExample {
  ja?: string;
  furigana?: string;
  en?: string;
  tatoeba_id?: number;
}

interface OpenJlptVocabItem {
  word?: string;
  reading?: string;
  meanings?: string[];
  examples?: OpenJlptExample[];
}

interface MnemonicKanjiCard {
  kanji: string;
  keyword?: string;
  story?: string;
  components?: string[];
  sound?: KanjiSoundHook[];
}

interface MnemonicKanjiFile {
  cards?: MnemonicKanjiCard[];
}

interface MnemonicVocabItem {
  w?: string;
  mn?: string;
}

type WordMnemonicsFile = Record<string, string>;
type MnemonicExamplesFile = Record<string, Array<[string, string, unknown?]>>;

interface JaishoKanjiLine {
  c?: string;
  id?: string[];
}

interface JaishoVocabLine {
  k?: string[];
  s?: Array<{ id?: string[] }>;
}

// ── Constants ────────────────────────────────────────────────────────────────

const RAW_URL =
  "https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json";
const MNEMONIC_BASE =
  "https://raw.githubusercontent.com/lczanna/kanji_mnemonic/main";

const KANJI_PER_SUBLEVEL = 10;
const MAX_VOCAB_PER_KANJI = 20;
const MAX_EXAMPLES_PER_VOCAB = 3;

const N5_GROUPS = [
  { id: 1, title: "Angka & Bilangan", kanji: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "百", "千", "万", "半"] },
  { id: 2, title: "Waktu & Hari", kanji: ["日", "月", "火", "水", "木", "金", "土", "年", "今", "時", "毎", "午", "後", "前", "間"] },
  { id: 3, title: "Orang & Keluarga", kanji: ["人", "子", "女", "男", "父", "母", "友", "生", "先", "名"] },
  { id: 4, title: "Arah & Posisi", kanji: ["上", "下", "左", "右", "東", "西", "南", "北", "中", "外"] },
  { id: 5, title: "Alam & Ruang", kanji: ["山", "川", "天", "雨", "電", "気", "車", "国", "校"] },
  { id: 6, title: "Kata Sifat Dasar", kanji: ["大", "小", "高", "長", "白"] },
  { id: 7, title: "Kata Kerja 1", kanji: ["行", "来", "出", "入", "休", "見", "聞", "読", "書"] },
  { id: 8, title: "Kata Kerja 2 & Lainnya", kanji: ["食", "話", "語", "学", "円", "本", "何"] },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSvgFilename(char: string): string {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) throw new Error(`Invalid character: ${char}`);
  return codePoint.toString(16).padStart(5, "0") + ".svg";
}

function convertToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  );
}

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`!  HTTP ${res.status} fetching ${url}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`!  Failed fetching ${url}:`, err);
    return fallback;
  }
}

function loadJaishoDictionaries(): {
  jaishoKanji: Record<string, string[]>;
  jaishoVocab: Record<string, string[]>;
} {
  const jaishoKanji: Record<string, string[]> = {};
  const jaishoVocab: Record<string, string[]> = {};

  const kanjiPath = join(process.cwd(), "scripts", "jaisho-kanji.ndjson");
  if (existsSync(kanjiPath)) {
    const raw = readFileSync(kanjiPath, "utf-8");
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      const parsed = JSON.parse(line) as JaishoKanjiLine;
      if (parsed.c && parsed.id) jaishoKanji[parsed.c] = parsed.id;
    }
  }

  const vocabPath = join(process.cwd(), "scripts", "jaisho-vocab.ndjson");
  if (existsSync(vocabPath)) {
    const raw = readFileSync(vocabPath, "utf-8");
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      const parsed = JSON.parse(line) as JaishoVocabLine;
      if (parsed.k?.[0] && parsed.s?.[0]?.id) {
        jaishoVocab[parsed.k[0]] = parsed.s[0].id;
      }
    }
  }

  console.log(
    `✓  Loaded JaIsho Dictionary (Kanji: ${Object.keys(jaishoKanji).length}, Vocab: ${Object.keys(jaishoVocab).length})`
  );
  return { jaishoKanji, jaishoVocab };
}

function filterByJlpt(raw: RawKanjiData, level: number): KanjiEntry[] {
  const entries: KanjiEntry[] = [];

  for (const [character, entry] of Object.entries(raw)) {
    if (entry.jlpt_new !== level) continue;

    let subLevel = 0;
    if (level === 5) {
      const group = N5_GROUPS.find((g) => g.kanji.includes(character));
      if (group) subLevel = group.id;
    }

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
    entries.forEach((e) => {
      if (e.subLevel === 0) e.subLevel = 9;
    });
    entries.sort((a, b) => {
      if (a.subLevel !== b.subLevel) return a.subLevel - b.subLevel;
      if (a.freq === null && b.freq === null) return 0;
      if (a.freq === null) return 1;
      if (b.freq === null) return -1;
      return a.freq - b.freq;
    });
  } else {
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

function mapExamples(
  openExamples: OpenJlptExample[] | undefined,
  fallbackExamples: Array<[string, string, unknown?]> | undefined
): VocabExample[] | undefined {
  const out: VocabExample[] = [];

  if (openExamples && openExamples.length > 0) {
    for (const ex of openExamples.slice(0, MAX_EXAMPLES_PER_VOCAB)) {
      if (ex.ja && ex.en) {
        out.push({
          ja: ex.ja,
          en: ex.en,
          ...(ex.furigana ? { furigana: ex.furigana } : {}),
          ...(typeof ex.tatoeba_id === "number" ? { tatoebaId: ex.tatoeba_id } : {}),
        });
      }
    }
  } else if (fallbackExamples && fallbackExamples.length > 0) {
    for (const item of fallbackExamples.slice(0, MAX_EXAMPLES_PER_VOCAB)) {
      const [ja, en] = item;
      if (typeof ja === "string" && typeof en === "string") {
        out.push({ ja, en });
      }
    }
  }

  return out.length > 0 ? out : undefined;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed(levels: number[]): Promise<void> {
  console.log("⬇  Fetching base kanji data & mnemonic datasets…");
  const [raw, mnemonicKanji, mnemonicVocabList, wordMnemonics, mnemonicExamples] =
    await Promise.all([
      fetchJson<RawKanjiData>(RAW_URL, {}),
      fetchJson<MnemonicKanjiFile>(`${MNEMONIC_BASE}/kanji.json`, {}),
      fetchJson<MnemonicVocabItem[]>(`${MNEMONIC_BASE}/vocab.json`, []),
      fetchJson<WordMnemonicsFile>(`${MNEMONIC_BASE}/data/word_mnemonics.json`, {}),
      fetchJson<MnemonicExamplesFile>(`${MNEMONIC_BASE}/examples.json`, {}),
    ]);

  if (Object.keys(raw).length === 0) {
    throw new Error("Failed to download raw kanji dataset.");
  }

  // Index kanji mnemonics by character
  const kanjiMnemonicMap = new Map<string, MnemonicKanjiCard>();
  for (const card of mnemonicKanji.cards ?? []) {
    if (card.kanji) kanjiMnemonicMap.set(card.kanji, card);
  }

  // Index vocab mnemonics by word (vocab.json + data/word_mnemonics.json)
  const vocabMnemonicMap = new Map<string, string>();
  for (const [word, mn] of Object.entries(wordMnemonics)) {
    if (word !== "_about" && typeof mn === "string" && mn.trim()) {
      vocabMnemonicMap.set(word, mn.trim());
    }
  }
  for (const item of mnemonicVocabList) {
    if (item.w && item.mn && item.mn.trim()) {
      vocabMnemonicMap.set(item.w, item.mn.trim());
    }
  }

  console.log(
    `✓  Loaded mnemonics (Kanji cards: ${kanjiMnemonicMap.size}, Vocab hooks: ${vocabMnemonicMap.size}, Fallback sentences: ${Object.keys(mnemonicExamples).length})`
  );

  // Save raw snapshot
  const rawDir = join(process.cwd(), "src", "data", "raw");
  mkdirSync(rawDir, { recursive: true });
  writeFileSync(join(rawDir, "kanji.json"), JSON.stringify(raw, null, 2), "utf-8");

  const { jaishoKanji, jaishoVocab } = loadJaishoDictionaries();
  const kanjiDir = join(process.cwd(), "src", "data", "kanji");
  mkdirSync(kanjiDir, { recursive: true });

  for (const level of levels) {
    const entries = filterByJlpt(raw, level);
    console.log(`⬇  Fetching OpenJLPT vocab + examples for N${level}…`);
    const vocabData = await fetchJson<OpenJlptVocabItem[]>(
      `https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n${level}.json`,
      []
    );

    let kanjiWithMnemonic = 0;
    let vocabWithExamples = 0;
    let vocabWithMnemonic = 0;

    for (const entry of entries) {
      if (jaishoKanji[entry.character]) {
        entry.meanings_id = jaishoKanji[entry.character];
      }

      const mnCard = kanjiMnemonicMap.get(entry.character);
      if (mnCard) {
        if (mnCard.keyword) entry.keyword = mnCard.keyword;
        if (mnCard.story) {
          entry.mnemonic = mnCard.story;
          kanjiWithMnemonic++;
        }
        if (mnCard.components && mnCard.components.length > 0) {
          entry.components = mnCard.components;
        }
        if (mnCard.sound && mnCard.sound.length > 0) {
          entry.soundHooks = mnCard.sound;
        }
      }

      if (vocabData.length > 0) {
        const matched = vocabData.filter(
          (v): v is Required<Pick<OpenJlptVocabItem, "word">> & OpenJlptVocabItem =>
            Boolean(v.word && v.word.includes(entry.character))
        );

        entry.vocab = matched.slice(0, MAX_VOCAB_PER_KANJI).map((v): KanjiVocab => {
          const mnemonic = vocabMnemonicMap.get(v.word);
          const examples = mapExamples(v.examples, mnemonicExamples[v.word]);
          if (mnemonic) vocabWithMnemonic++;
          if (examples && examples.length > 0) vocabWithExamples++;

          return {
            word: v.word,
            reading: v.reading ?? "",
            meanings: v.meanings ?? [],
            meanings_id: jaishoVocab[v.word] ?? [],
            ...(mnemonic ? { mnemonic } : {}),
            ...(examples ? { examples } : {}),
          };
        });
      }
    }

    const outPath = join(kanjiDir, `n${level}.json`);
    writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf-8");

    const subLevels = entries[entries.length - 1]?.subLevel ?? 0;
    console.log(
      `✓  N${level}: ${entries.length} kanji (${subLevels} sublevels, ${kanjiWithMnemonic} kanji mnemonics, ${vocabWithExamples} vocab w/ sentences, ${vocabWithMnemonic} vocab w/ mnemonics)`
    );
  }
}

const args = process.argv.slice(2);
const levelArg = args.find((a) => a.startsWith("--level="));
const levels = levelArg ? [parseInt(levelArg.split("=")[1], 10)] : [5, 4, 3, 2, 1];

seed(levels).catch((err) => {
  console.error("✗  Seed failed:", err);
  process.exit(1);
});
