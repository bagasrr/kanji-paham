'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/Toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState<'credentials' | 'google' | null>(null)
  const isSubmitting = submitting !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    setSubmitting('credentials')
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setSubmitting(null)
        showToast('Email atau password salah.', 'error')
        return
      }
      showToast('Login berhasil!', 'success')
      const callback = searchParams.get('callbackUrl')
      router.push(callback || '/learn')
      router.refresh()
    } catch {
      setSubmitting(null)
      showToast('Terjadi kesalahan saat login.', 'error')
    }
  }

  async function handleGoogleSignIn() {
    if (isSubmitting) return
    setSubmitting('google')
    try {
      const callback = searchParams.get('callbackUrl')
      await signIn('google', { callbackUrl: callback || '/learn' })
    } catch {
      setSubmitting(null)
      showToast('Gagal menghubungkan ke Google.', 'error')
    }
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border-color p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-text-main mb-3.5">Masuk</h2>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Email</label>
          <input
            type="email"
            required
            disabled={isSubmitting}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Password</label>
          <input
            type="password"
            required
            disabled={isSubmitting}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={submitting === 'credentials'}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          {submitting === 'credentials' ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        aria-busy={submitting === 'google'}
        className="mt-3 w-full py-3 rounded-xl border border-border-color text-text-main font-medium hover:bg-card-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
      >
        {submitting === 'google' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Menghubungkan...</span>
          </>
        ) : (
          'Masuk dengan Google'
        )}
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
    <div className="min-h-[calc(100dvh-9rem)] md:min-h-[calc(100dvh-4rem)] flex items-center justify-center w-full">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/assets/KanjiPahamLogo.png"
            alt="KanjiPaham Logo"
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain mb-2 shadow-sm"
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
    </div>
  )
}
