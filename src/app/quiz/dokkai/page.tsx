import { getDokkaiPassages } from '@/lib/exercises'
import { DokkaiPractice } from '@/components/DokkaiPractice'

export const dynamic = 'force-dynamic'

export default async function DokkaiPage() {
  const passages = await getDokkaiPassages()
  return <DokkaiPractice passages={passages} />
}
