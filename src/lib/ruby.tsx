import React from 'react'

const FURIGANA_PATTERN = /\{([^|{}]+)\|([^{}]+)\}/g

/**
 * Render `{漢字|かんじ}` furigana markup into accessible `<ruby>` elements,
 * or strip readings when `showFurigana` is false.
 */
export function renderFuriganaText(
  text: string,
  showFurigana: boolean
): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  FURIGANA_PATTERN.lastIndex = 0
  while ((match = FURIGANA_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const [, base, reading] = match
    if (showFurigana) {
      parts.push(
        <ruby key={`${match.index}-${base}`} className="mx-[1px]">
          {base}
          <rt className="text-[10px] text-text-muted font-normal">{reading}</rt>
        </ruby>
      )
    } else {
      parts.push(base)
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
