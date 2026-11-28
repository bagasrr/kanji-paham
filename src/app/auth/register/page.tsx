'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/Toast'

export default function RegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoading(false)
        showToast(data.error || 'Pendaftaran gagal.', 'error')
      } else {
        showToast('Pendaftaran berhasil! Silakan login.', 'success')
        router.push('/auth/login')
      }
    } catch {
      setLoading(false)
      showToast('Terjadi kesalahan saat mendaftar.', 'error')
    }
  }

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
        <div className="bg-surface rounded-2xl shadow-sm border border-border-color p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-text-main mb-3.5">Daftar Akun</h2>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Nama</label>
              <input type="text" required disabled={loading} value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                placeholder="Nama Lengkap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email</label>
              <input type="email" required disabled={loading} value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Password</label>
              <input type="password" required disabled={loading} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                placeholder="Min 8 karakter, 1 huruf besar, 1 angka" />
            </div>
            <button type="submit" disabled={loading} aria-busy={loading}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Daftar'
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-text-muted">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary font-medium">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
