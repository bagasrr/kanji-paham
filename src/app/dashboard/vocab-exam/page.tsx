'use client'

import { useCallback, useEffect, useState } from 'react'
import { Edit3, Plus, Search, Trash2, X } from 'lucide-react'
import { AdminAudioField } from '@/components/AdminAudioField'
import { useToast } from '@/components/Toast'

interface VocabExamRow {
  id: string
  targetWord: string
  mode: string
  prompt: string
  options: string[]
  optsEn: string[]
  answer: number
  why: string | null
  en: string | null
  audioUrl: string | null
}

const EMPTY_FORM: VocabExamRow = {
  id: '',
  targetWord: '',
  mode: 'para',
  prompt: '',
  options: ['', '', '', ''],
  optsEn: ['', '', '', ''],
  answer: 0,
  why: '',
  en: '',
  audioUrl: '',
}

export default function AdminVocabExamPage() {
  const { showToast } = useToast()
  const [questions, setQuestions] = useState<VocabExamRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modeFilter, setModeFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [form, setForm] = useState<VocabExamRow>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      mode: modeFilter,
      q: query,
      page: String(page),
    })
    const res = await fetch(`/api/admin/vocab-exam?${params.toString()}`)
    if (res.ok) {
      const data = (await res.json()) as {
        questions: VocabExamRow[]
        total: number
        totalPages: number
      }
      setQuestions(data.questions)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }, [modeFilter, query, page])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchQuestions()
    }, 150)
    return () => window.clearTimeout(id)
  }, [fetchQuestions])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)

    const payload = {
      targetWord: form.targetWord.trim(),
      mode: form.mode,
      prompt: form.prompt.trim(),
      options: form.options.map((o) => o.trim()),
      optsEn: form.optsEn,
      answer: form.answer,
      why: form.why?.trim() || null,
      en: form.en?.trim() || null,
      audioUrl: form.audioUrl?.trim() || null,
    }

    const res = await fetch(
      modalMode === 'edit' ? `/api/admin/vocab-exam/${form.id}` : '/api/admin/vocab-exam',
      {
        method: modalMode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    setSaving(false)
    if (res.ok) {
      showToast(
        modalMode === 'edit' ? 'Soal kontekstual diperbarui.' : 'Soal baru ditambahkan.',
        'success'
      )
      setModalMode(null)
      void fetchQuestions()
    } else {
      const err = (await res.json()) as { error?: string }
      showToast(err.error || 'Gagal menyimpan soal.', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus soal kosakata kontekstual ini?')) return
    const res = await fetch(`/api/admin/vocab-exam/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Soal dihapus.', 'success')
      void fetchQuestions()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Kosakata Kontekstual</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {total} soal parafrasa &amp; pemakaian kata di PostgreSQL
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ ...EMPTY_FORM })
            setModalMode('create')
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus size={18} /> Tambah Soal
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
            placeholder="Cari kata target, kalimat soal, atau terjemahan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-surface text-sm text-text-main focus:outline-none focus:border-[#800020]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'para', label: 'Parafrasa' },
            { key: 'usage', label: 'Pemakaian' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => {
                setModeFilter(m.key)
                setPage(1)
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex-shrink-0 ${
                modeFilter === m.key
                  ? 'bg-[#800020] text-white border-[#800020]'
                  : 'bg-surface border-border-color text-text-muted hover:text-text-main'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border-color overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-card-muted/40 text-text-muted text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-border-color">Kata Target</th>
              <th className="p-4 font-bold border-b border-border-color">Mode</th>
              <th className="p-4 font-bold border-b border-border-color">Soal &amp; Audio</th>
              <th className="p-4 font-bold border-b border-border-color text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">
                  Memuat soal kontekstual...
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">
                  Tidak ada soal yang cocok.
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id} className="hover:bg-card-muted/20">
                  <td className="p-4 font-bold text-text-main font-jp">{q.targetWord}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#800020]/10 text-[#800020] dark:bg-[#800020]/30 dark:text-[#F28482]">
                      {q.mode}
                    </span>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="font-jp text-text-main line-clamp-2">{q.prompt}</p>
                    <p className="text-xs text-text-subtle mt-0.5">
                      Jawaban: <span className="font-jp">{q.options[q.answer] ?? '-'}</span>
                      {q.audioUrl ? ' · 🔊 Audio Supabase' : ''}
                    </p>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setForm({
                          ...q,
                          why: q.why ?? '',
                          en: q.en ?? '',
                          audioUrl: q.audioUrl ?? '',
                        })
                        setModalMode('edit')
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-color text-xs font-semibold hover:border-[#800020]"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border-color text-error hover:bg-error/10"
                      aria-label={`Hapus ${q.targetWord}`}
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
          <div className="bg-surface w-full max-w-xl rounded-2xl shadow-xl border border-border-color overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-border-color bg-card-muted/30">
              <h2 className="text-lg font-bold text-text-main">
                {modalMode === 'edit' ? `Edit Soal: ${form.targetWord}` : 'Tambah Soal Kontekstual'}
              </h2>
              <button onClick={() => setModalMode(null)} className="text-text-subtle hover:text-text-main">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">Kata Target</label>
                  <input
                    type="text"
                    required
                    value={form.targetWord}
                    onChange={(e) => setForm({ ...form, targetWord: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                  >
                    <option value="para">para (Parafrasa)</option>
                    <option value="usage">usage (Pemakaian)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Pertanyaan (JP)</label>
                <textarea
                  rows={3}
                  required
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={form.answer === idx}
                      onChange={() => setForm({ ...form, answer: idx })}
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...form.options]
                        next[idx] = e.target.value
                        setForm({ ...form, options: next })
                      }}
                      placeholder={`Opsi ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-border-color bg-surface font-jp text-xs"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Arti / Gloss (EN)</label>
                <input
                  type="text"
                  value={form.en ?? ''}
                  onChange={(e) => setForm({ ...form, en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Pembahasan</label>
                <textarea
                  rows={2}
                  value={form.why ?? ''}
                  onChange={(e) => setForm({ ...form, why: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                />
              </div>

              <AdminAudioField
                label="Audio Soal"
                value={form.audioUrl ?? ''}
                onChange={(url) => setForm({ ...form, audioUrl: url })}
                folder="vocab-exam"
                slug={form.targetWord || form.id || 'vocab-exam'}
                sourceText={form.prompt.replace(/[【】]/g, '')}
              />

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
                  {saving ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
