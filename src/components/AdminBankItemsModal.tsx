'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AdminAudioField } from '@/components/AdminAudioField'
import { useToast } from '@/components/Toast'

interface CustomQuestionItem {
  id: string
  kanji: string | null
  prompt: string
  options: string[]
  correctIndex: number
  type: string
  audioUrl: string | null
}

interface Props {
  bankId: string
  onClose: () => void
  onUpdated: () => void
}

export function AdminBankItemsModal({ bankId, onClose, onUpdated }: Props) {
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<CustomQuestionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CustomQuestionItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadBank = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/questions/bank/${bankId}`)
    if (res.ok) {
      const data = (await res.json()) as {
        bank: { title: string; questions: CustomQuestionItem[] }
      }
      setTitle(data.bank.title)
      setQuestions(data.bank.questions)
    }
    setLoading(false)
  }, [bankId])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadBank()
    }, 0)
    return () => window.clearTimeout(id)
  }, [loadBank])

  function openNewQuestion() {
    setIsNew(true)
    setEditing({
      id: '',
      kanji: '',
      prompt: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      type: 'reading',
      audioUrl: '',
    })
  }

  async function saveQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!editing || saving) return
    setSaving(true)

    const cleanOptions = editing.options.map((o) => o.trim()).filter(Boolean)
    const res = await fetch('/api/admin/questions/item', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(isNew ? { bankId } : { id: editing.id }),
        kanji: editing.kanji?.trim() || null,
        prompt: editing.prompt.trim(),
        options: cleanOptions,
        correctIndex: editing.correctIndex,
        type: editing.type,
        audioUrl: editing.audioUrl?.trim() || null,
      }),
    })

    setSaving(false)
    if (res.ok) {
      showToast(isNew ? 'Soal ditambahkan.' : 'Soal diperbarui.', 'success')
      setEditing(null)
      setIsNew(false)
      void loadBank()
      onUpdated()
    } else {
      const err = (await res.json()) as { error?: string }
      showToast(err.error || 'Gagal menyimpan soal.', 'error')
    }
  }

  async function deleteQuestion(id: string) {
    const res = await fetch(`/api/admin/questions/item?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      showToast('Soal dihapus.', 'success')
      void loadBank()
      onUpdated()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl border border-border-color overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-border-color bg-card-muted/30">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-text-main truncate">Kelola Butir Soal</h2>
            <p className="text-xs text-text-muted truncate">{title || 'Memuat...'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openNewQuestion}
              className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#660019] text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus size={14} /> Tambah Soal
            </button>
            <button onClick={onClose} className="text-text-subtle hover:text-text-main">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {editing && (
            <form
              onSubmit={saveQuestion}
              className="p-4 rounded-2xl border-2 border-[#800020]/30 bg-card-muted/20 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">
                    Kanji Terkait (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editing.kanji ?? ''}
                    onChange={(e) => setEditing({ ...editing, kanji: e.target.value })}
                    placeholder="日"
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1">Tipe</label>
                  <select
                    value={editing.type}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
                  >
                    <option value="reading">reading</option>
                    <option value="meaning">meaning</option>
                    <option value="reverse">reverse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Pertanyaan</label>
                <textarea
                  rows={2}
                  required
                  value={editing.prompt}
                  onChange={(e) => setEditing({ ...editing, prompt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {editing.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={editing.correctIndex === idx}
                      onChange={() => setEditing({ ...editing, correctIndex: idx })}
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...editing.options]
                        next[idx] = e.target.value
                        setEditing({ ...editing, options: next })
                      }}
                      placeholder={`Opsi ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-border-color bg-surface font-jp text-xs"
                    />
                  </div>
                ))}
              </div>

              <AdminAudioField
                label="Audio Soal"
                value={editing.audioUrl ?? ''}
                onChange={(url) => setEditing({ ...editing, audioUrl: url })}
                folder="questions"
                slug={editing.kanji || `q-${editing.id || 'new'}`}
                sourceText={editing.prompt}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null)
                    setIsNew(false)
                  }}
                  className="px-3 py-2 rounded-xl border border-border-color text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660019] text-white text-xs font-bold"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-center text-sm text-text-muted py-6">Memuat butir soal...</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-sm text-text-subtle py-6">Belum ada butir soal.</p>
          ) : (
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl border border-border-color bg-surface flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-subtle">
                      #{idx + 1} · {q.type}
                      {q.kanji ? ` · Kanji ${q.kanji}` : ''}
                      {q.audioUrl ? ' · 🔊 audio' : ''}
                    </p>
                    <p className="text-sm font-medium text-text-main font-jp mt-0.5">{q.prompt}</p>
                    <p className="text-xs text-success mt-1 font-jp">
                      Jawaban: {q.options[q.correctIndex] ?? '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNew(false)
                        setEditing({ ...q })
                      }}
                      className="px-2.5 py-1 rounded-lg border border-border-color text-xs font-semibold hover:border-[#800020]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(q.id)}
                      className="p-1.5 rounded-lg border border-border-color text-error hover:bg-error/10"
                      aria-label="Hapus soal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
