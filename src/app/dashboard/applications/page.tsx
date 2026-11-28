'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface ApplicationRow {
  id: string
  certificateUrl: string
  idCardUrl: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

export default function ApplicationsDashboardPage() {
  const { showToast } = useToast()
  const [apps, setApps] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchApps() {
    const res = await fetch('/api/admin/applications')
    if (res.ok) {
      const data = (await res.json()) as { applications: ApplicationRow[] }
      setApps(data.applications)
    }
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    fetch('/api/admin/applications')
      .then((res) => (res.ok ? (res.json() as Promise<{ applications: ApplicationRow[] }>) : null))
      .then((data) => {
        if (!active) return
        if (data) setApps(data.applications)
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function handleAction(id: string, status: 'APPROVED' | 'REJECTED') {
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      showToast(
        status === 'APPROVED' ? 'Pengajuan Sensei disetujui!' : 'Pengajuan ditolak.',
        'success'
      )
      void fetchApps()
    } else {
      showToast('Gagal memperbarui status.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Verifikasi Sensei</h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Tinjau pengajuan sertifikat JLPT dari calon pengajar
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-color overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-card-muted/40 text-text-muted text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-border-color">Pemohon</th>
              <th className="p-4 font-bold border-b border-border-color">Dokumen</th>
              <th className="p-4 font-bold border-b border-border-color">Status</th>
              <th className="p-4 font-bold border-b border-border-color text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted text-sm">Memuat...</td>
              </tr>
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted text-sm">
                  Belum ada pengajuan Sensei.
                </td>
              </tr>
            ) : (
              apps.map((app) => (
                <tr key={app.id} className="hover:bg-card-muted/25 transition-colors">
                  <td className="p-4 border-b border-border-color">
                    <p className="font-semibold text-text-main">{app.user.name || 'Tanpa Nama'}</p>
                    <p className="text-xs text-text-muted">{app.user.email}</p>
                  </td>
                  <td className="p-4 border-b border-border-color text-xs space-y-1">
                    <a
                      href={app.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#800020] dark:text-[#F28482] font-semibold hover:underline"
                    >
                      Sertifikat JLPT <ExternalLink size={12} />
                    </a>
                    {app.idCardUrl && (
                      <a
                        href={app.idCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-text-muted hover:underline"
                      >
                        Identitas <ExternalLink size={12} />
                      </a>
                    )}
                  </td>
                  <td className="p-4 border-b border-border-color">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.status === 'APPROVED'
                          ? 'bg-success/15 text-success'
                          : app.status === 'REJECTED'
                          ? 'bg-error/15 text-error'
                          : 'bg-warning/15 text-warning'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 border-b border-border-color text-right whitespace-nowrap">
                    {app.status === 'PENDING' && (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleAction(app.id, 'APPROVED')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-success text-white text-xs font-bold hover:opacity-90"
                        >
                          <CheckCircle2 size={14} /> Setujui
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'REJECTED')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-error text-white text-xs font-bold hover:opacity-90"
                        >
                          <XCircle size={14} /> Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
