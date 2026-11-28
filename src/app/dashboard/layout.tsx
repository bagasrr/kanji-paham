import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
    redirect('/profile')
  }

  return (
    <DashboardSidebar role={session.user.role} userName={session.user.name ?? session.user.email}>
      {children}
    </DashboardSidebar>
  )
}
