import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { password } = await request.json()

  if (!password) {
    return NextResponse.json({ error: 'Missing password' }, { status: 400 })
  }

  const passwordValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  if (!passwordValid) {
    return NextResponse.json(
      { error: 'Password must be 8+ chars with 1 uppercase and 1 number' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  })

  const response = NextResponse.json({ success: true }, { status: 200 })
  response.cookies.set('password_set', 'true', {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })
  
  return response
}
