import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const hiraganaMap = [
  { c: "あ", r: "a" }, { c: "い", r: "i" }, { c: "う", r: "u" }, { c: "え", r: "e" }, { c: "お", r: "o" },
  { c: "か", r: "ka" }, { c: "き", r: "ki" }, { c: "く", r: "ku" }, { c: "け", r: "ke" }, { c: "こ", r: "ko" },
  { c: "さ", r: "sa" }, { c: "し", r: "shi" }, { c: "す", r: "su" }, { c: "せ", r: "se" }, { c: "そ", r: "so" },
  { c: "た", r: "ta" }, { c: "ち", r: "chi" }, { c: "つ", r: "tsu" }, { c: "て", r: "te" }, { c: "と", r: "to" },
  { c: "な", r: "na" }, { c: "に", r: "ni" }, { c: "ぬ", r: "nu" }, { c: "ね", r: "ne" }, { c: "の", r: "no" },
  { c: "は", r: "ha" }, { c: "ひ", r: "hi" }, { c: "ふ", r: "fu" }, { c: "へ", r: "he" }, { c: "ほ", r: "ho" },
  { c: "ま", r: "ma" }, { c: "み", r: "mi" }, { c: "む", r: "mu" }, { c: "め", r: "me" }, { c: "も", r: "mo" },
  { c: "や", r: "ya" }, { c: null, r: null }, { c: "ゆ", r: "yu" }, { c: null, r: null }, { c: "よ", r: "yo" },
  { c: "ら", r: "ra" }, { c: "り", r: "ri" }, { c: "る", r: "ru" }, { c: "れ", r: "re" }, { c: "ろ", r: "ro" },
  { c: "わ", r: "wa" }, { c: null, r: null }, { c: null, r: null }, { c: null, r: null }, { c: "を", r: "wo" },
  { c: "ん", r: "n" }, { c: null, r: null }, { c: null, r: null }, { c: null, r: null }, { c: null, r: null },
];

const katakanaMap = [
  { c: "ア", r: "a" }, { c: "イ", r: "i" }, { c: "ウ", r: "u" }, { c: "エ", r: "e" }, { c: "オ", r: "o" },
  { c: "カ", r: "ka" }, { c: "キ", r: "ki" }, { c: "ク", r: "ku" }, { c: "ケ", r: "ke" }, { c: "コ", r: "ko" },
  { c: "サ", r: "sa" }, { c: "シ", r: "shi" }, { c: "ス", r: "su" }, { c: "セ", r: "se" }, { c: "ソ", r: "so" },
  { c: "タ", r: "ta" }, { c: "チ", r: "chi" }, { c: "ツ", r: "tsu" }, { c: "テ", r: "te" }, { c: "ト", r: "to" },
  { c: "ナ", r: "na" }, { c: "ニ", r: "ni" }, { c: "ヌ", r: "nu" }, { c: "ネ", r: "ne" }, { c: "ノ", r: "no" },
  { c: "ハ", r: "ha" }, { c: "ヒ", r: "hi" }, { c: "フ", r: "fu" }, { c: "ヘ", r: "he" }, { c: "ホ", r: "ho" },
  { c: "マ", r: "ma" }, { c: "ミ", r: "mi" }, { c: "ム", r: "mu" }, { c: "メ", r: "me" }, { c: "モ", r: "mo" },
  { c: "ヤ", r: "ya" }, { c: null, r: null }, { c: "ユ", r: "yu" }, { c: null, r: null }, { c: "ヨ", r: "yo" },
  { c: "ラ", r: "ra" }, { c: "リ", r: "ri" }, { c: "ル", r: "ru" }, { c: "レ", r: "re" }, { c: "ロ", r: "ro" },
  { c: "ワ", r: "wa" }, { c: null, r: null }, { c: null, r: null }, { c: null, r: null }, { c: "ヲ", r: "wo" },
  { c: "ン", r: "n" }, { c: null, r: null }, { c: null, r: null }, { c: null, r: null }, { c: null, r: null },
];

function toSvgFilename(char: string): string {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) throw new Error(`Invalid character: ${char}`);
  return codePoint.toString(16).padStart(5, "0") + ".svg";
}

function generate() {
  const entries: any[] = [];
  
  hiraganaMap.forEach((item) => {
    if (item.c) {
      entries.push({
        character: item.c,
        romaji: item.r,
        type: "hiragana",
        svgFile: toSvgFilename(item.c)
      });
    }
  });

  katakanaMap.forEach((item) => {
    if (item.c) {
      entries.push({
        character: item.c,
        romaji: item.r,
        type: "katakana",
        svgFile: toSvgFilename(item.c)
      });
    }
  });

  const dir = join(process.cwd(), "src", "data", "kana");
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, "kana.json");
  writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf-8");
  
  console.log(`✓  Seeded ${entries.length} Kana entries to src/data/kana/kana.json`);
}

generate();
