'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/components/Toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      showToast('Email atau password salah.', 'error')
    } else {
      showToast('Login berhasil!', 'success')
      const callback = searchParams.get('callbackUrl')
      router.push(callback || '/learn')
      router.refresh()
    }
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border-color p-6">
      <h2 className="text-lg font-semibold text-text-main mb-4">Masuk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          {loading ? 'Memuat...' : 'Masuk'}
        </button>
      </form>
      <button
        onClick={() => signIn('google', { callbackUrl: '/learn' })}
        className="mt-3 w-full py-3 rounded-xl border border-border-color text-text-main font-medium hover:bg-card-muted transition-colors"
      >
        Masuk dengan Google
      </button>
      <p className="mt-4 text-center text-sm text-text-muted">
        Belum punya akun?{' '}
        <Link href="/auth/register" className="text-primary font-medium">Daftar</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 w-full">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/KanjiPahamLogo.png"
            alt="KanjiPaham Logo"
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl object-contain mb-2 shadow-sm"
            priority
          />
          <h1 className="text-2xl font-bold text-center text-text-main">
            KanjiPaham
          </h1>
        </div>
        <Suspense fallback={<div className="p-6 text-center">Memuat form login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
