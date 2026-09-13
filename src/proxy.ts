import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const protectedPaths = ['/api/user', '/dashboard', '/profile/apply-sensei']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect OAuth users to set-password if they don't have one
  const hasPasswordSet = request.cookies.get('password_set')
  // @ts-ignore
  if (session && session.user && session.user.hasPassword === false && !hasPasswordSet && pathname !== '/auth/set-password') {
    return NextResponse.redirect(new URL('/auth/set-password', request.url))
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
    '/learn/:path*',
    '/api/user/:path*',
    '/dashboard/:path*',
    '/profile/apply-sensei',
  ],
}
