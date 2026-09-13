'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Password tidak cocok.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Terjadi kesalahan.')
    } else {
      router.push('/profile')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#0F172A] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#1F2937] dark:text-[#F8FAFC] mb-6">
          Buat Password Anda
        </h1>
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-slate-700 p-6">
          <p className="text-sm text-text-muted mb-4 text-center">
            Anda login menggunakan Google. Silakan buat password agar Anda juga dapat login menggunakan email dan password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] dark:text-slate-300 mb-1">Password Baru</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1F2937] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] dark:text-slate-300 mb-1">Konfirmasi Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1F2937] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
