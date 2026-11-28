'use client'

import { useCallback, useEffect, useState } from 'react'
import { Edit3, Plus, Search, Trash2, X } from 'lucide-react'
import { AdminAudioField } from '@/components/AdminAudioField'
import { useToast } from '@/components/Toast'

interface DokkaiQ {
  orderIdx: number
  prompt: string
  options: string[]
  optsEn: string[]
  answer: number
  why?: string | null
}

interface DokkaiRow {
  id: string
  kind: string
  title: string
  text: string
  en: string
  audioUrl: string | null
  questions: DokkaiQ[]
}

const EMPTY_DOC: DokkaiRow = {
  id: '',
  kind: 'short',
  title: '',
  text: '',
  en: '',
  audioUrl: '',
  questions: [],
}

export default function AdminDokkaiPage() {
  const { showToast } = useToast()
  const [passages, setPassages] = useState<DokkaiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [kindFilter, setKindFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [form, setForm] = useState<DokkaiRow>(EMPTY_DOC)
  const [saving, setSaving] = useState(false)

  const fetchPassages = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      kind: kindFilter,
      q: query,
      page: String(page),
    })
    const res = await fetch(`/api/admin/dokkai?${params.toString()}`)
    if (res.ok) {
      const data = (await res.json()) as {
        passages: DokkaiRow[]
        total: number
        totalPages: number
      }
      setPassages(data.passages)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }, [kindFilter, query, page])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchPassages()
    }, 150)
    return () => window.clearTimeout(id)
  }, [fetchPassages])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)

    const payload = {
      id: form.id.trim(),
      kind: form.kind,
      title: form.title.trim(),
      text: form.text,
      en: form.en,
      audioUrl: form.audioUrl?.trim() || null,
      questions: form.questions,
    }

    const res = await fetch(
      modalMode === 'edit' ? `/api/admin/dokkai/${encodeURIComponent(form.id)}` : '/api/admin/dokkai',
      {
        method: modalMode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    setSaving(false)
    if (res.ok) {
      showToast(
        modalMode === 'edit' ? 'Bacaan Dokkai diperbarui.' : 'Bacaan Dokkai ditambahkan.',
        'success'
      )
      setModalMode(null)
      void fetchPassages()
    } else {
      const err = (await res.json()) as { error?: string }
      showToast(err.error || 'Gagal menyimpan Dokkai.', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(`Hapus bacaan ${id} beserta seluruh soalnya?`)) return
    const res = await fetch(`/api/admin/dokkai/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) {
      showToast(`Bacaan ${id} dihapus.`, 'success')
      void fetchPassages()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Latihan Dokkai</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {total} wacana bacaan &amp; soal pemahaman di PostgreSQL
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ ...EMPTY_DOC })
            setModalMode('create')
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus size={18} /> Tambah Bacaan
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Cari ID, judul, atau teks bacaan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-surface text-sm text-text-main focus:outline-none focus:border-[#800020]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'short', 'medium', 'info', 'long'] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setKindFilter(k)
                setPage(1)
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border uppercase flex-shrink-0 ${
                kindFilter === k
                  ? 'bg-[#800020] text-white border-[#800020]'
                  : 'bg-surface border-border-color text-text-muted hover:text-text-main'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border-color overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-card-muted/40 text-text-muted text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-border-color">ID / Tipe</th>
              <th className="p-4 font-bold border-b border-border-color">Judul &amp; Cuplikan</th>
              <th className="p-4 font-bold border-b border-border-color">Soal / Audio</th>
              <th className="p-4 font-bold border-b border-border-color text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">
                  Memuat data Dokkai...
                </td>
              </tr>
            ) : passages.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">
                  Tidak ada bacaan yang cocok.
                </td>
              </tr>
            ) : (
              passages.map((p) => (
                <tr key={p.id} className="hover:bg-card-muted/20">
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-text-main block">{p.id}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#800020]/10 text-[#800020] dark:bg-[#800020]/30 dark:text-[#F28482] uppercase">
                      {p.kind}
                    </span>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="font-semibold text-text-main truncate">{p.title}</p>
                    <p className="text-xs text-text-muted font-jp line-clamp-2 mt-0.5">{p.text}</p>
                  </td>
                  <td className="p-4 text-xs text-text-muted">
                    <span className="font-semibold text-text-main">{p.questions.length} soal</span>
                    <span className="block text-[11px] mt-0.5">
                      {p.audioUrl ? '🔊 Audio Supabase' : 'Web Speech fallback'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setForm({
                          ...p,
                          audioUrl: p.audioUrl ?? '',
                          questions: p.questions.map((q) => ({ ...q })),
                        })
                        setModalMode('edit')
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-color text-xs font-semibold hover:border-[#800020]"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border-color text-error hover:bg-error/10"
                      aria-label={`Hapus ${p.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-border-color bg-surface disabled:opacity-40 font-semibold"
            >
              Sebelumnya
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-border-color bg-surface disabled:opacity-40 font-semibold"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl border border-border-color overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-border-color bg-card-muted/30">
              <h2 className="text-lg font-bold text-text-main">
                {modalMode === 'edit' ? `Edit Dokkai: ${form.id}` : 'Tambah Bacaan Dokkai'}
              </h2>
              <button onClick={() => setModalMode(null)} className="text-text-subtle hover:text-text-main">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">ID</label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'edit'}
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="short-01"
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">Tipe</label>
                  <select
                    value={form.kind}
                    onChange={(e) => setForm({ ...form, kind: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                  >
                    <option value="short">short</option>
                    <option value="medium">medium</option>
                    <option value="info">info</option>
                    <option value="long">long</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">Judul</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Teks Bacaan (JP)</label>
                <textarea
                  rows={5}
                  required
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Terjemahan (EN)</label>
                <textarea
                  rows={3}
                  value={form.en}
                  onChange={(e) => setForm({ ...form, en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                />
              </div>

              <AdminAudioField
                label="Audio Bacaan"
                value={form.audioUrl ?? ''}
                onChange={(url) => setForm({ ...form, audioUrl: url })}
                folder="dokkai"
                slug={form.id || form.title}
                sourceText={form.text}
              />

              <div className="space-y-2 pt-3 border-t border-border-color">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-text-muted">
                    Soal Pemahaman ({form.questions.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        questions: [
                          ...form.questions,
                          {
                            orderIdx: form.questions.length,
                            prompt: '',
                            options: ['', '', '', ''],
                            optsEn: ['', '', '', ''],
                            answer: 0,
                            why: '',
                          },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Tambah Soal
                  </button>
                </div>

                {form.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-3 rounded-xl border border-border-color bg-card-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-muted">Soal #{qIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            questions: form.questions.filter((_, i) => i !== qIdx),
                          })
                        }
                        className="text-xs text-error hover:underline"
                      >
                        Hapus Soal
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={q.prompt}
                      onChange={(e) => {
                        const next = [...form.questions]
                        next[qIdx] = { ...q, prompt: e.target.value }
                        setForm({ ...form, questions: next })
                      }}
                      placeholder="Pertanyaan (JP)"
                      className="w-full px-3 py-1.5 rounded-lg border border-border-color bg-surface font-jp text-xs"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            checked={q.answer === optIdx}
                            onChange={() => {
                              const next = [...form.questions]
                              next[qIdx] = { ...q, answer: optIdx }
                              setForm({ ...form, questions: next })
                            }}
                          />
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const next = [...form.questions]
                              const nextOpts = [...q.options]
                              nextOpts[optIdx] = e.target.value
                              next[qIdx] = { ...q, options: nextOpts }
                              setForm({ ...form, questions: next })
                            }}
                            placeholder={`Opsi ${optIdx + 1}`}
                            className="flex-1 px-2.5 py-1 rounded-lg border border-border-color bg-surface font-jp text-xs"
                          />
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={q.why ?? ''}
                      onChange={(e) => {
                        const next = [...form.questions]
                        next[qIdx] = { ...q, why: e.target.value }
                        setForm({ ...form, questions: next })
                      }}
                      placeholder="Pembahasan jawaban benar (opsional)"
                      className="w-full px-3 py-1.5 rounded-lg border border-border-color bg-surface text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl border border-border-color text-sm font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#660019] text-white text-sm font-bold disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Dokkai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
