/**
 * scripts/seed-db.ts
 *
 * Injects JSON datasets (src/data/kanji/n1..n5.json, radicals.json, and
 * src/data/exercises/*.json) into PostgreSQL via Prisma using bounded concurrency.
 *
 * Usage:
 *   npx tsx scripts/seed-db.ts
 */

import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import type {
  DokkaiPassage,
  KanjiEntry,
  RadicalEntry,
  VocabExamQuestion,
} from "../src/lib/types";

const prisma = new PrismaClient();
const BATCH_SIZE = 20;

function toJsonInput(value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (value === undefined || value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

async function runInBatches<T>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    await Promise.all(items.slice(i, i + batchSize).map(fn));
  }
}

async function seedKanjis(): Promise<void> {
  for (let level = 5; level >= 1; level--) {
    const jsonPath = path.join(process.cwd(), "src", "data", "kanji", `n${level}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.log(`Skipping N${level}: JSON not found`);
      continue;
    }

    const kanjis = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as KanjiEntry[];
    console.log(`Processing N${level}: ${kanjis.length} kanji`);

    await runInBatches(kanjis, BATCH_SIZE, async (k) => {
      const kanjiData = {
        strokes: k.strokes,
        grade: k.grade,
        freq: k.freq,
        jlpt: k.jlpt,
        meanings: k.meanings ?? [],
        meanings_id: k.meanings_id ?? [],
        readings_on: k.readings_on ?? [],
        readings_kun: k.readings_kun ?? [],
        svgFile: k.svgFile,
        subLevel: k.subLevel,
        keyword: k.keyword ?? null,
        mnemonic: k.mnemonic ?? null,
        components: k.components ?? [],
        radicals: k.radicals ?? [],
        soundHooks: toJsonInput(k.soundHooks),
      };

      await prisma.kanji.upsert({
        where: { character: k.character },
        update: kanjiData,
        create: {
          character: k.character,
          ...kanjiData,
        },
      });

      if (k.vocab && k.vocab.length > 0) {
        await prisma.vocab.deleteMany({
          where: { kanjiChar: k.character },
        });

        await prisma.vocab.createMany({
          data: k.vocab.map((v) => ({
            kanjiChar: k.character,
            word: v.word,
            reading: v.reading,
            meanings: v.meanings ?? [],
            meanings_id: v.meanings_id ?? [],
            mnemonic: v.mnemonic ?? null,
            examples: toJsonInput(v.examples),
          })),
        });
      }
    });

    console.log(`✓ Completed N${level}`);
  }
}

async function seedRadicals(): Promise<void> {
  const radPath = path.join(process.cwd(), "src", "data", "kanji", "radicals.json");
  if (!fs.existsSync(radPath)) {
    console.log("Skipping Radicals: JSON not found");
    return;
  }

  const radicals = JSON.parse(fs.readFileSync(radPath, "utf8")) as RadicalEntry[];
  console.log(`Processing Radicals: ${radicals.length} entries`);

  await runInBatches(radicals, BATCH_SIZE, async (r) => {
    await prisma.radical.upsert({
      where: { radical: r.radical },
      update: {
        strokeCount: r.strokeCount,
        classicalNumber: r.classicalNumber,
        meanings: r.meanings ?? [],
        kanjiChars: r.kanjiChars ?? [],
      },
      create: {
        radical: r.radical,
        strokeCount: r.strokeCount,
        classicalNumber: r.classicalNumber,
        meanings: r.meanings ?? [],
        kanjiChars: r.kanjiChars ?? [],
      },
    });
  });

  console.log(`✓ Completed Radicals (${radicals.length} entries)`);
}

async function seedDokkai(): Promise<void> {
  const dokkaiPath = path.join(process.cwd(), "src", "data", "exercises", "dokkai.json");
  if (!fs.existsSync(dokkaiPath)) {
    console.log("Skipping Dokkai: JSON not found");
    return;
  }

  const passages = JSON.parse(fs.readFileSync(dokkaiPath, "utf8")) as DokkaiPassage[];
  console.log(`Processing Dokkai: ${passages.length} passages`);

  await runInBatches(passages, BATCH_SIZE, async (p) => {
    await prisma.dokkaiPassage.upsert({
      where: { id: p.id },
      update: {
        kind: p.kind,
        title: p.title,
        text: p.text,
        en: p.en,
      },
      create: {
        id: p.id,
        kind: p.kind,
        title: p.title,
        text: p.text,
        en: p.en,
      },
    });

    await prisma.dokkaiQuestion.deleteMany({
      where: { passageId: p.id },
    });

    if (p.questions.length > 0) {
      await prisma.dokkaiQuestion.createMany({
        data: p.questions.map((q) => ({
          passageId: p.id,
          orderIdx: q.orderIdx,
          prompt: q.prompt,
          options: q.options,
          optsEn: q.optsEn ?? [],
          answer: q.answer,
          why: q.why ?? null,
          wrong: toJsonInput(q.wrong),
        })),
      });
    }
  });

  console.log(`✓ Completed Dokkai (${passages.length} passages)`);
}

async function seedVocabExam(): Promise<void> {
  const vocabExamPath = path.join(process.cwd(), "src", "data", "exercises", "vocab-exam.json");
  if (!fs.existsSync(vocabExamPath)) {
    console.log("Skipping VocabExam: JSON not found");
    return;
  }

  const questions = JSON.parse(fs.readFileSync(vocabExamPath, "utf8")) as VocabExamQuestion[];
  console.log(`Processing VocabExam: ${questions.length} questions`);

  await runInBatches(questions, BATCH_SIZE, async (q) => {
    await prisma.vocabExamQuestion.upsert({
      where: {
        targetWord_mode: {
          targetWord: q.targetWord,
          mode: q.mode,
        },
      },
      update: {
        prompt: q.prompt,
        options: q.options,
        optsEn: q.optsEn ?? [],
        answer: q.answer,
        why: q.why ?? null,
        en: q.en ?? null,
        wrong: toJsonInput(q.wrong),
      },
      create: {
        targetWord: q.targetWord,
        mode: q.mode,
        prompt: q.prompt,
        options: q.options,
        optsEn: q.optsEn ?? [],
        answer: q.answer,
        why: q.why ?? null,
        en: q.en ?? null,
        wrong: toJsonInput(q.wrong),
      },
    });
  });

  console.log(`✓ Completed VocabExam (${questions.length} questions)`);
}

async function main(): Promise<void> {
  console.log("Seeding Database with Kanji, Radicals, Vocab, Dokkai & Exercise JSON Data...");
  await seedKanjis();
  await seedRadicals();
  await seedDokkai();
  await seedVocabExam();
  console.log("Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
