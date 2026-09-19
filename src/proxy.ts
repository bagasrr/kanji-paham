import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPaths = ['/api/user', '/dashboard', '/profile/apply-sensei']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  // Fast path: if route is not protected, bypass immediately without running auth()
  if (!isProtected) {
    return NextResponse.next()
  }

  const session = await auth()

  if (!session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based protection for /dashboard
  if (pathname.startsWith('/dashboard')) {
    // @ts-ignore
    const role = session?.user?.role
    if (role !== 'ADMIN' && role !== 'SENSEI') {
      return NextResponse.redirect(new URL('/profile', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/user/:path*',
    '/dashboard/:path*',
    '/profile/apply-sensei',
  ],
}
