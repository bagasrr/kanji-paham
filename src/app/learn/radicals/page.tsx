import { getRadicals } from '@/lib/radicals'
import { RadicalsBrowser } from '@/components/RadicalsBrowser'

export const dynamic = 'force-dynamic'

export default async function RadicalsPage() {
  const radicals = await getRadicals()
  return <RadicalsBrowser radicals={radicals} />
}
