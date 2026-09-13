'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ApplySenseiPage() {
  const router = useRouter()
  const [certUrl, setCertUrl] = useState('')
  const [idUrl, setIdUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/user/apply-sensei', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateUrl: certUrl, idCardUrl: idUrl })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Terjadi kesalahan')
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    }
  }

  return (
    <div className="px-4 py-6">
      <Link href="/profile" className="flex items-center gap-2 text-sm text-text-muted mb-6 hover:text-primary">
        <ArrowLeft size={16} /> Kembali ke Profil
      </Link>
      
      <h1 className="text-2xl font-bold text-text-main mb-2">Pengajuan Akun Sensei</h1>
      <p className="text-text-muted text-sm mb-6">
        Untuk menjadi kontributor dan membuat materi kanji atau kuis baru, Anda harus memiliki sertifikat minimal JLPT N3.
      </p>

      {success ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-800 text-center">
          Pengajuan berhasil dikirim! Silakan tunggu verifikasi dari Admin.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-2xl border border-border-color">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Link Sertifikat JLPT (N3 / N2 / N1) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={certUrl}
              onChange={e => setCertUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-3 rounded-xl border border-border-color bg-transparent text-text-main focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-text-muted mt-1">Upload ke Google Drive dan paste linknya di sini.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Link KTP (Opsional)
            </label>
            <input
              type="url"
              value={idUrl}
              onChange={e => setIdUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-3 rounded-xl border border-border-color bg-transparent text-text-main focus:outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors mt-4"
          >
            {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </form>
      )}
    </div>
  )
}
