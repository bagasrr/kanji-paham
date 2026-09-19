import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const isRegisterSensei = process.env.isRegisterSensei === 'true' || process.env.NEXT_PUBLIC_IS_REGISTER_SENSEI === 'true' || process.env.IS_REGISTER_SENSEI === 'true'
  if (!isRegisterSensei) {
    return NextResponse.json({ error: 'Pendaftaran Sensei sedang ditutup' }, { status: 403 })
  }

  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { certificateUrl, idCardUrl } = await request.json()

  if (!certificateUrl) {
    return NextResponse.json({ error: 'Sertifikat JLPT N3 wajib dilampirkan' }, { status: 400 })
  }

  // Check if application already exists
  const existing = await prisma.teacherApplication.findUnique({
    where: { userId: session.user.id }
  })

  if (existing && existing.status === 'PENDING') {
    return NextResponse.json({ error: 'Pengajuan Anda sedang diproses' }, { status: 400 })
  }

  const application = await prisma.teacherApplication.upsert({
    where: { userId: session.user.id },
    update: { certificateUrl, idCardUrl, status: 'PENDING' },
    create: { userId: session.user.id, certificateUrl, idCardUrl, status: 'PENDING' }
  })

  return NextResponse.json({ application }, { status: 201 })
}
