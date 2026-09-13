import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database with Kanji JSON Data...')
  
  for (let level = 5; level >= 1; level--) {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'kanji', `n${level}.json`)
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`Skipping N${level}: JSON not found`)
      continue
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8')
    const kanjis = JSON.parse(rawData)
    
    console.log(`Processing N${level}: ${kanjis.length} kanji`)

    for (const k of kanjis) {
      await prisma.kanji.upsert({
        where: { character: k.character },
        update: {
          strokes: k.strokes,
          grade: k.grade,
          freq: k.freq,
          jlpt: k.jlpt,
          meanings: k.meanings || [],
          meanings_id: k.meanings_id || [],
          readings_on: k.readings_on || [],
          readings_kun: k.readings_kun || [],
          svgFile: k.svgFile,
          subLevel: k.subLevel,
        },
        create: {
          character: k.character,
          strokes: k.strokes,
          grade: k.grade,
          freq: k.freq,
          jlpt: k.jlpt,
          meanings: k.meanings || [],
          meanings_id: k.meanings_id || [],
          readings_on: k.readings_on || [],
          readings_kun: k.readings_kun || [],
          svgFile: k.svgFile,
          subLevel: k.subLevel,
        }
      })

      // Clean up old vocab and insert new ones
      if (k.vocab && k.vocab.length > 0) {
        await prisma.vocab.deleteMany({
          where: { kanjiChar: k.character }
        })

        const vocabData = k.vocab.map((v: any) => ({
          kanjiChar: k.character,
          word: v.word,
          reading: v.reading,
          meanings: v.meanings || [],
          meanings_id: v.meanings_id || [],
        }))

        await prisma.vocab.createMany({
          data: vocabData
        })
      }
    }
    
    console.log(`Completed N${level}`)
  }

  console.log('Database seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
