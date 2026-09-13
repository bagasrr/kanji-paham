import { NextRequest, NextResponse } from 'next/server'
import type { KanjiEntry } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const levelStr = searchParams.get('level') || '5'
  const lang = searchParams.get('lang') || 'id'
  const levelNum = parseInt(levelStr, 10)

  if (levelNum < 1 || levelNum > 5) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  try {
    const data = await import(`@/data/kanji/n${levelNum}.json`)
    const kanjis = data.default as KanjiEntry[]

    // Extract all vocabulary
    const allVocab: { word: string; reading: string; meaning: string, meaning_id: string }[] = []
    kanjis.forEach((k) => {
      if (k.vocab) {
        k.vocab.forEach((v) => {
          if (v.word && v.reading) {
            allVocab.push({
              word: v.word,
              reading: v.reading,
              meaning: v.meanings[0] || '',
              meaning_id: (v.meanings_id && v.meanings_id.length > 0) ? v.meanings_id[0] : (v.meanings[0] || '')
            })
          }
        })
      }
    })

    // Fisher-Yates shuffle for vocab array
    const shuffledVocab = [...allVocab]
    for (let i = shuffledVocab.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledVocab[i], shuffledVocab[j]] = [shuffledVocab[j], shuffledVocab[i]]
    }
    const selectedVocab = shuffledVocab.slice(0, 20)

    const questions = selectedVocab.map((v) => {
      // 5 Variations
      const modeIdx = Math.floor(Math.random() * 5)
      
      let prompt = ''
      let correctAnswer = ''
      let pool: string[] = []

      const getM = (voc: any) => lang === 'id' ? voc.meaning_id : voc.meaning;
      const currentMeaning = getM(v)

      if (modeIdx === 0) {
        prompt = `Bagian yang digarisbawahi pada kata 「__${v.word}__」 dibaca...`
        correctAnswer = v.reading
        pool = allVocab.map(x => x.reading)
      } else if (modeIdx === 1) {
        prompt = `Kanji yang tepat untuk menulis kata 「__${v.reading}__」 (${currentMeaning}) adalah...`
        correctAnswer = v.word
        pool = allVocab.map(x => x.word)
      } else if (modeIdx === 2) {
        prompt = `Apa makna yang tepat dari kosakata 「${v.word}」?`
        correctAnswer = currentMeaning
        pool = allVocab.map(x => getM(x))
      } else if (modeIdx === 3) {
        prompt = `Kosakata manakah yang memiliki arti "${currentMeaning}"?`
        correctAnswer = v.word
        pool = allVocab.map(x => x.word)
      } else {
        prompt = `Pilihlah kosakata yang memiliki cara baca 「${v.reading}」!`
        correctAnswer = v.word
        pool = allVocab.map(x => x.word)
      }

      // Pick 3 wrong answers with Fisher-Yates
      const wrongAnswers: string[] = []
      const shuffledPool = [...pool.filter(Boolean)]
      for (let i = shuffledPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]]
      }

      for (const wrong of shuffledPool) {
        if (!wrongAnswers.includes(wrong) && wrong !== correctAnswer) {
          wrongAnswers.push(wrong)
        }
        if (wrongAnswers.length === 3) break;
      }
      while (wrongAnswers.length < 3) wrongAnswers.push('—')

      // Shuffle options with Fisher-Yates
      const options = [correctAnswer, ...wrongAnswers]
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]]
      }
      
      const correctIndex = options.indexOf(correctAnswer)

      return {
        prompt,
        options,
        correctIndex,
        word: v.word,
        meaning: v.meaning
      }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load kanji data' }, { status: 500 })
  }
}
