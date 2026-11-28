import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Guard admin/sensei API routes consistently without duplicating session checks.
 */
export async function requireStaff(adminOnly = false) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const role = session.user.role
  if (adminOnly && role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  if (!adminOnly && role !== 'ADMIN' && role !== 'SENSEI') {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  return { session }
}
