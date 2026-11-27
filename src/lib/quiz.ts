import type { KanjiEntry } from '@/lib/types'

/**
 * Return a Fisher-Yates shuffled shallow copy without mutating the input array.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function isKanjiLike(text: string): boolean {
  return text.length <= 6 && /[\u4e00-\u9fff\u3040-\u30ff]/.test(text)
}

export function getKanjiOptionFontSize(text: string): string {
  const len = text.length
  if (len <= 1) return 'text-3xl sm:text-4xl md:text-5xl'
  if (len === 2) return 'text-xl sm:text-2xl md:text-3xl'
  if (len === 3) return 'text-base sm:text-lg md:text-xl'
  if (len === 4) return 'text-sm sm:text-base md:text-lg'
  return 'text-xs sm:text-sm md:text-base'
}

export interface FlashCard {
  character: string
  answer: string // Indonesian meaning (first meaning)
}

export interface MCQQuestion {
  character: string
  mode: 'meaning' | 'onyomi' | 'kunyomi'
  prompt: string
  options: string[] // 4 options shuffled
  correctIndex: number
}

export function buildFlashCards(entries: KanjiEntry[], lang: 'id' | 'en' = 'id'): FlashCard[] {
  return entries.map((e) => ({
    character: e.character,
    answer: lang === 'id' && e.meanings_id && e.meanings_id.length > 0 ? e.meanings_id[0] : e.meanings[0],
  }))
}

function getMeaning(entry: KanjiEntry, lang: 'id' | 'en') {
  return lang === 'id' && entry.meanings_id && entry.meanings_id.length > 0 ? entry.meanings_id[0] : entry.meanings[0];
}

export function buildMCQQuestions(entries: KanjiEntry[], lang: 'id' | 'en' = 'id'): MCQQuestion[] {
  const shuffledEntries = shuffle(entries)

  return shuffledEntries.map((entry) => {
    // 5 Variations
    const modes = [
      'meaning', 'onyomi', 'kunyomi', 
      'reverse_meaning', 'reverse_reading'
    ]
    
    // Filter valid modes for this specific kanji
    const validModes = modes.filter(m => {
      if (m === 'onyomi' && entry.readings_on.length === 0) return false;
      if (m === 'kunyomi' && entry.readings_kun.length === 0) return false;
      return true;
    })
    
    const mode = validModes[Math.floor(Math.random() * validModes.length)]

    let correctAnswer: string = ''
    let prompt: string = ''
    let pool: string[] = []
    let displayChar: string = entry.character

    const currentMeaning = getMeaning(entry, lang)

    if (mode === 'meaning') {
      // Variasi 1: Kanji -> Arti
      prompt = lang === 'id'
        ? `Apa arti dari kanji "${entry.character}"?`
        : `What is the meaning of kanji "${entry.character}"?`
      correctAnswer = currentMeaning
      pool = entries.filter((e) => e.character !== entry.character).map((e) => getMeaning(e, lang))
    } else if (mode === 'onyomi') {
      // Variasi 2: Kanji -> On'yomi
      prompt = lang === 'id'
        ? `Bagaimana cara baca On'yomi (Katakana) dari "${entry.character}"?`
        : `What is the On'yomi reading of "${entry.character}"?`
      correctAnswer = entry.readings_on[0]
      pool = entries.filter((e) => e.character !== entry.character && e.readings_on.length > 0).map((e) => e.readings_on[0])
    } else if (mode === 'kunyomi') {
      // Variasi 3: Kanji -> Kun'yomi
      prompt = lang === 'id'
        ? `Bagaimana cara baca Kun'yomi (Hiragana) dari "${entry.character}"?`
        : `What is the Kun'yomi reading of "${entry.character}"?`
      correctAnswer = entry.readings_kun[0]
      pool = entries.filter((e) => e.character !== entry.character && e.readings_kun.length > 0).map((e) => e.readings_kun[0])
    } else if (mode === 'reverse_meaning') {
      // Variasi 4: Arti -> Kanji
      displayChar = '?'
      prompt = lang === 'id'
        ? `Manakah kanji yang memiliki arti "${currentMeaning}"?`
        : `Which kanji has the meaning "${currentMeaning}"?`
      correctAnswer = entry.character
      pool = entries.filter((e) => e.character !== entry.character).map((e) => e.character)
    } else if (mode === 'reverse_reading') {
      // Variasi 5: Bacaan -> Kanji
      displayChar = '?'
      const hasOn = entry.readings_on.length > 0
      const hasKun = entry.readings_kun.length > 0
      const useOn = hasOn && (!hasKun || Math.random() > 0.5)
      const reading = useOn ? entry.readings_on[0] : entry.readings_kun[0]
      const type = useOn ? "On'yomi" : "Kun'yomi"
      
      prompt = lang === 'id'
        ? `Kanji apakah yang memiliki bacaan ${type} "${reading}"?`
        : `Which kanji has the ${type} reading "${reading}"?`
      correctAnswer = entry.character
      pool = entries.filter((e) => e.character !== entry.character).map((e) => e.character)
    }

    // Pick 3 unique wrong answers
    const wrongAnswers: string[] = []
    const shuffledPool = shuffle(pool.filter(Boolean))

    for (const wrong of shuffledPool) {
      if (!wrongAnswers.includes(wrong) && wrong !== correctAnswer) {
        wrongAnswers.push(wrong)
      }
      if (wrongAnswers.length === 3) break;
    }
    while (wrongAnswers.length < 3) wrongAnswers.push('—')

    // Shuffle all 4 options
    const allOptions = shuffle([correctAnswer, ...wrongAnswers])
    const correctIndex = allOptions.indexOf(correctAnswer)

    return { 
      character: displayChar, 
      mode: mode as MCQQuestion['mode'], 
      prompt, 
      options: allOptions, 
      correctIndex 
    }
  })
}
