/**
 * scripts/download-svg.ts
 *
 * Downloads KanjiVG stroke-order SVG files for kanji entries
 * and saves them to public/svg/kanji/[hex].svg.
 *
 * Source: https://github.com/KanjiVG/kanjivg (master branch, /kanji/ folder)
 *
 * Usage:
 *   npx tsx scripts/download-svg.ts              # downloads SVGs for all N5 sub-level 1 (default)
 *   npx tsx scripts/download-svg.ts --level=5    # all N5
 *   npx tsx scripts/download-svg.ts --level=5 --sublevel=1   # N5 sub-level 1 only
 *   npx tsx scripts/download-svg.ts --all        # every kanji in all available n*.json files
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── Config ───────────────────────────────────────────────────────────────────

const KANJIVG_BASE =
  "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji";

const SVG_DIR = join(process.cwd(), "public", "svg", "kanji");
const DATA_DIR = join(process.cwd(), "src", "data", "kanji");

/** ms to wait between requests to be a good GitHub citizen */
const RATE_LIMIT_MS = 80;

// ── Helpers ──────────────────────────────────────────────────────────────────

interface KanjiEntry {
  character: string;
  svgFile: string;
  subLevel: number;
  jlpt: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadSvg(svgFile: string): Promise<"ok" | "skip" | "error"> {
  const dest = join(SVG_DIR, svgFile);
  if (existsSync(dest)) return "skip";

  const url = `${KANJIVG_BASE}/${svgFile}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`  ⚠  Not found (404): ${svgFile}`);
        return "error";
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const svg = await res.text();
    writeFileSync(dest, svg, "utf-8");
    return "ok";
  } catch (err) {
    console.error(`  ✗  Failed ${svgFile}: ${err}`);
    return "error";
  }
}

function loadEntries(level: number): KanjiEntry[] {
  const path = join(DATA_DIR, `n${level}.json`);
  if (!existsSync(path)) {
    console.warn(`  ⚠  ${path} not found — run 'npm run seed:kanji' first.`);
    return [];
  }
  return require(path) as KanjiEntry[];
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(SVG_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const levelArg = args.find((a) => a.startsWith("--level="));
  const sublevelArg = args.find((a) => a.startsWith("--sublevel="));

  const level = levelArg ? parseInt(levelArg.split("=")[1], 10) : 5;
  const sublevel = sublevelArg ? parseInt(sublevelArg.split("=")[1], 10) : null;

  const levels = all ? [5, 4, 3, 2, 1] : [level];

  let total = 0, downloaded = 0, skipped = 0, errors = 0;

  for (const lvl of levels) {
    let entries = loadEntries(lvl);
    if (entries.length === 0) continue;

    if (!all && sublevel !== null) {
      entries = entries.filter((e) => e.subLevel === sublevel);
    }

    console.log(
      `\n📦 N${lvl}${sublevel !== null && !all ? ` sub-level ${sublevel}` : ""}: ${entries.length} kanji`
    );

    for (const entry of entries) {
      process.stdout.write(
        `  ${entry.character} → ${entry.svgFile} … `
      );
      const result = await downloadSvg(entry.svgFile);
      total++;
      if (result === "ok") {
        downloaded++;
        console.log("✓");
      } else if (result === "skip") {
        skipped++;
        console.log("(cached)");
      } else {
        errors++;
      }
      if (result === "ok") await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(
    `\n✅ Done — ${downloaded} downloaded, ${skipped} cached, ${errors} errors (${total} total)`
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
