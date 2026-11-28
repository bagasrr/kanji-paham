/**
 * src/lib/exercises.ts
 *
 * Hybrid DB-first / JSON-fallback loaders for Dokkai reading passages
 * and contextual JLPT vocabulary exam questions.
 */

import { prisma } from "@/lib/prisma";
import type {
  DokkaiPassage,
  VocabExamQuestion,
  VocabExamWrongMap,
} from "@/lib/types";
import type { Prisma } from "@prisma/client";

function parseStringRecord(value: Prisma.JsonValue | null | undefined): Record<string, string> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === "string") out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function parseVocabWrongMap(value: Prisma.JsonValue | null | undefined): VocabExamWrongMap | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const out: VocabExamWrongMap = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === "string") {
      out[k] = v;
    } else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      const rec = v as Record<string, unknown>;
      if (typeof rec.why === "string") {
        out[k] = {
          why: rec.why,
          ...(typeof rec.fix === "string" ? { fix: rec.fix } : {}),
          ...(typeof rec.fixEn === "string" ? { fixEn: rec.fixEn } : {}),
        };
      }
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export async function getDokkaiPassages(): Promise<DokkaiPassage[]> {
  try {
    const rows = await prisma.dokkaiPassage.findMany({
      include: { questions: { orderBy: { orderIdx: "asc" } } },
      orderBy: { id: "asc" },
    });

    if (rows.length > 0) {
      return rows.map((p) => ({
        id: p.id,
        kind: p.kind,
        title: p.title,
        text: p.text,
        en: p.en,
        ...(p.audioUrl ? { audioUrl: p.audioUrl } : {}),
        questions: p.questions.map((q) => ({
          orderIdx: q.orderIdx,
          prompt: q.prompt,
          options: q.options,
          optsEn: q.optsEn,
          answer: q.answer,
          ...(q.why ? { why: q.why } : {}),
          ...(parseStringRecord(q.wrong) ? { wrong: parseStringRecord(q.wrong) } : {}),
        })),
      }));
    }
  } catch (error) {
    console.warn("[exercises.ts] Database query failed for Dokkai passages, falling back to JSON.", error);
  }

  const data = await import("@/data/exercises/dokkai.json");
  return data.default as unknown as DokkaiPassage[];
}

export async function getVocabExamQuestions(): Promise<VocabExamQuestion[]> {
  try {
    const rows = await prisma.vocabExamQuestion.findMany({
      orderBy: [{ targetWord: "asc" }, { mode: "asc" }],
    });

    if (rows.length > 0) {
      return rows.map((row) => ({
        targetWord: row.targetWord,
        mode: row.mode === "usage" ? "usage" : "para",
        prompt: row.prompt,
        options: row.options,
        optsEn: row.optsEn,
        answer: row.answer,
        ...(row.why ? { why: row.why } : {}),
        ...(row.en ? { en: row.en } : {}),
        ...(row.audioUrl ? { audioUrl: row.audioUrl } : {}),
        ...(parseVocabWrongMap(row.wrong) ? { wrong: parseVocabWrongMap(row.wrong) } : {}),
      }));
    }
  } catch (error) {
    console.warn("[exercises.ts] Database query failed for VocabExam questions, falling back to JSON.", error);
  }

  const data = await import("@/data/exercises/vocab-exam.json");
  return data.default as unknown as VocabExamQuestion[];
}
