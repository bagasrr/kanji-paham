## 4. Open-Source Data Strategy & Sources

- **Kanji Metadata (Levels & Readings):**
  - Source: `davidluzgouveia/kanji-data` (GitHub)
  - Extracted to: `src/data/raw/kanji.json`
  - Filter rule: Group by `"jlpt"` property into `src/data/kanji/n5.json` through `n1.json`.

- **Stroke Order & Animations:**
  - Source: `KanjiVG/kanjivg` (GitHub Releases)
  - File format: SVG with stroke paths (`kvg:type`, `id="kvg:065e5-s1"`).
  - Naming convention: UTF-8 Hex code zero-padded to 5 digits (e.g., `日` -> `065e5.svg`).
  - Storage location: `public/svg/kanji/[hex].svg`

- **Audio Pronunciation (Fallback & Strategy):**
  - Phase 1 (MVP/Development): Browser Web Speech API (`SpeechSynthesisUtterance` with `lang: 'ja-JP'`).
  - Phase 2 (Production): Native MP3 files from Tatoeba project matched with sentence IDs, located in `public/audio/sentences/[id].mp3`.
