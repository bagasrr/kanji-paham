import { getVocabExamQuestions } from '@/lib/exercises'
import { VocabExamPractice } from '@/components/VocabExamPractice'

export const dynamic = 'force-dynamic'

export default async function VocabExamPage() {
  const all = await getVocabExamQuestions()
  const counts = {
    all: all.length,
    para: all.filter((q) => q.mode === 'para').length,
    usage: all.filter((q) => q.mode === 'usage').length,
  }
  return <VocabExamPractice counts={counts} />
}
