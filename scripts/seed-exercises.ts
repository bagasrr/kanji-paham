/**
 * scripts/seed-exercises.ts
 *
 * Fetches open-source Dokkai reading passages (exam_reading.json) and
 * contextual JLPT vocabulary exercises (exam_vocab.json) from
 * lczanna/kanji_mnemonic (CC BY-SA 4.0) and writes normalized JSON
 * files to src/data/exercises/.
 *
 * Usage:
 *   npx tsx scripts/seed-exercises.ts
 */

import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  DokkaiPassage,
  DokkaiQuestion,
  VocabExamQuestion,
  VocabExamUsageWrongDetail,
  VocabExamWrongMap,
} from "../src/lib/types";

const BASE_URL = "https://raw.githubusercontent.com/lczanna/kanji_mnemonic/main/data";

interface RawDokkaiQuestion {
  q: string;
  options: string[];
  opts_en?: string[];
  answer: number;
  why?: string;
  wrong?: Record<string, string>;
}

interface RawDokkaiPassage {
  id: string;
  kind: string;
  title: string;
  text: string;
  en: string;
  questions: RawDokkaiQuestion[];
}

interface RawVocabPara {
  s: string;
  options: string[];
  opts_en?: string[];
  answer: number;
  why?: string;
  why_en?: string;
  en?: string;
  wrong?: Record<string, string>;
}

interface RawVocabUsageWrong {
  why?: string;
  fix?: string;
  fix_en?: string;
}

interface RawVocabUsage {
  options: string[];
  opts_en?: string[];
  answer: number;
  why?: string;
  why_en?: string;
  wrong?: Record<string, RawVocabUsageWrong>;
}

interface RawVocabExamEntry {
  para?: RawVocabPara | null;
  usage?: RawVocabUsage | null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return (await res.json()) as T;
}

function normalizeUsageWrong(
  wrong: Record<string, RawVocabUsageWrong> | undefined
): VocabExamWrongMap | undefined {
  if (!wrong) return undefined;
  const out: VocabExamWrongMap = {};
  for (const [key, val] of Object.entries(wrong)) {
    if (val && typeof val.why === "string") {
      const detail: VocabExamUsageWrongDetail = {
        why: val.why,
        ...(val.fix ? { fix: val.fix } : {}),
        ...(val.fix_en ? { fixEn: val.fix_en } : {}),
      };
      out[key] = detail;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

async function main(): Promise<void> {
  console.log("⬇  Fetching Dokkai & Vocab Exam datasets from lczanna/kanji_mnemonic…");
  const [rawDokkai, rawVocabExam] = await Promise.all([
    fetchJson<RawDokkaiPassage[]>(`${BASE_URL}/exam_reading.json`),
    fetchJson<Record<string, RawVocabExamEntry>>(`${BASE_URL}/exam_vocab.json`),
  ]);

  const dokkaiPassages: DokkaiPassage[] = rawDokkai.map((p) => ({
    id: p.id,
    kind: p.kind,
    title: p.title,
    text: p.text,
    en: p.en,
    questions: p.questions.map(
      (q, idx): DokkaiQuestion => ({
        orderIdx: idx,
        prompt: q.q,
        options: q.options,
        optsEn: q.opts_en ?? [],
        answer: q.answer,
        ...(q.why ? { why: q.why } : {}),
        ...(q.wrong ? { wrong: q.wrong } : {}),
      })
    ),
  }));

  const vocabQuestions: VocabExamQuestion[] = [];
  for (const [targetWord, entry] of Object.entries(rawVocabExam)) {
    if (!entry || typeof entry !== "object") continue;
    if (entry.para && Array.isArray(entry.para.options) && entry.para.s) {
      vocabQuestions.push({
        targetWord,
        mode: "para",
        prompt: entry.para.s,
        options: entry.para.options,
        optsEn: entry.para.opts_en ?? [],
        answer: entry.para.answer,
        ...(entry.para.why || entry.para.why_en
          ? { why: entry.para.why ?? entry.para.why_en }
          : {}),
        ...(entry.para.en ? { en: entry.para.en } : {}),
        ...(entry.para.wrong ? { wrong: entry.para.wrong } : {}),
      });
    }

    if (entry.usage && Array.isArray(entry.usage.options)) {
      const normalizedWrong = normalizeUsageWrong(entry.usage.wrong);
      vocabQuestions.push({
        targetWord,
        mode: "usage",
        prompt: `「${targetWord}」の使い方に最も合う文を選びなさい。`,
        options: entry.usage.options,
        optsEn: entry.usage.opts_en ?? [],
        answer: entry.usage.answer,
        ...(entry.usage.why || entry.usage.why_en
          ? { why: entry.usage.why ?? entry.usage.why_en }
          : {}),
        ...(normalizedWrong ? { wrong: normalizedWrong } : {}),
      });
    }
  }

  const outDir = join(process.cwd(), "src", "data", "exercises");
  mkdirSync(outDir, { recursive: true });

  writeFileSync(
    join(outDir, "dokkai.json"),
    JSON.stringify(dokkaiPassages, null, 2),
    "utf-8"
  );
  writeFileSync(
    join(outDir, "vocab-exam.json"),
    JSON.stringify(vocabQuestions, null, 2),
    "utf-8"
  );

  const totalDokkaiQs = dokkaiPassages.reduce((acc, p) => acc + p.questions.length, 0);
  console.log(
    `✓  Saved ${dokkaiPassages.length} Dokkai passages (${totalDokkaiQs} questions) → src/data/exercises/dokkai.json`
  );
  console.log(
    `✓  Saved ${vocabQuestions.length} Contextual Vocab questions → src/data/exercises/vocab-exam.json`
  );
}

main().catch((err) => {
  console.error("✗  Exercise seed failed:", err);
  process.exit(1);
});
