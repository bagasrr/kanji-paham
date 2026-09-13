---

### 4. `docs/design_system.md` (Design & UI/UX Specifications)

```markdown
# Design System & UI/UX Specs

## 1. Theme & Color Palette

- **Light Theme (Default):**
  - Background: Cream `#FAF9F6` / Clean White `#FFFFFF`
  - Surface/Card: `#FFFFFF` with soft border `#E5E7EB`
  - Text Primary: `#1F2937`
  - Accent / Primary CTA: `#DC2626` (Japanese Crimson) or Indigo `#4F46E5`
- **Dark Theme:**
  - Background: Deep Soft Dark / Navy `#0F172A`
  - Surface/Card: `#1E293B`
  - Text Primary: `#F8FAFC`
  - Accent: `#F87171` or `#818CF8`

## 2. Component Specifications

### Kanji Learning Card (`/components/KanjiCard.tsx`)

- Central hero display: Kanji rendered in large mincho/gothic Japanese font (min `text-6xl` to `text-7xl`).
- Animation Container: Renders Kanji stroke SVG using animation libraries (e.g. KanjiVG path renderer).
- Reading Grid: 2-column layout (Kun'yomi vs. On'yomi badges).
- Example Section:
  - Toggle Button: "Furigana: ON / OFF".
  - Audio Button: Circular icon button with Lucide `Volume2` trigger with playback state.
  - Furigana layout: HTML `<ruby>` and `<rt>` elements for accessible rendering.

### Mobile-First Navigation

- Bottom navigation bar: `[Kana, Kanji, Quiz, Profile]` (fixed at bottom, safe-area aware for iOS/Android).
- Sticky top header showing current Level (`N5 - Sublevel 1`) and progress bar.
```
