import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()

  if (!email || !password || !name) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Validate: min 8 chars, 1 number, 1 uppercase
  const passwordValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  if (!passwordValid) {
    return Response.json(
      { error: 'Password must be 8+ chars with 1 uppercase and 1 number' },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: 'Email already registered' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, email: true, name: true },
  })

  return Response.json({ user }, { status: 201 })
}
