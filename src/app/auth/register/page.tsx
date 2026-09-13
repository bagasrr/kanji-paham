'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      showToast(data.error || 'Pendaftaran gagal.', 'error')
    } else {
      showToast('Pendaftaran berhasil! Silakan login.', 'success')
      router.push('/auth/login')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-text-main mb-6">🇯🇵 KanjiPaham</h1>
        <div className="bg-surface rounded-2xl shadow-sm border border-border-color p-6">
          <h2 className="text-lg font-semibold text-text-main mb-4">Daftar Akun</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] dark:text-slate-300 mb-1">Nama</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                placeholder="Nama Lengkap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] dark:text-slate-300 mb-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] dark:text-slate-300 mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                placeholder="Min 8 karakter, 1 huruf besar, 1 angka" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
              {loading ? 'Memuat...' : 'Daftar'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-text-muted">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary font-medium">Masuk</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
