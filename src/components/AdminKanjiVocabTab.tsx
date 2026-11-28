'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminAudioField } from '@/components/AdminAudioField'
import { useToast } from '@/components/Toast'

export interface AdminExampleItem {
  ja: string
  en: string
  furigana?: string
  tatoebaId?: number
  audioUrl?: string
}

export interface AdminVocabRow {
  id: string
  word: string
  reading: string
  meanings: string[]
  meanings_id: string[]
  mnemonic: string | null
  audioUrl: string | null
  examples: AdminExampleItem[] | null
}

interface Props {
  character: string
  vocabs: AdminVocabRow[]
  onRefresh: () => void
}

interface VocabDraft {
  id: string | null
  word: string
  reading: string
  meanings: string
  meanings_id: string
  mnemonic: string
  audioUrl: string
  examples: AdminExampleItem[]
}

const EMPTY_DRAFT: VocabDraft = {
  id: null,
  word: '',
  reading: '',
  meanings: '',
  meanings_id: '',
  mnemonic: '',
  audioUrl: '',
  examples: [],
}

function splitCsv(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function AdminKanjiVocabTab({ character, vocabs, onRefresh }: Props) {
  const { showToast } = useToast()
  const [draft, setDraft] = useState<VocabDraft | null>(null)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setDraft({ ...EMPTY_DRAFT })
  }

  function openEdit(v: AdminVocabRow) {
    setDraft({
      id: v.id,
      word: v.word,
      reading: v.reading,
      meanings: v.meanings.join(', '),
      meanings_id: v.meanings_id.join(', '),
      mnemonic: v.mnemonic ?? '',
      audioUrl: v.audioUrl ?? '',
      examples: Array.isArray(v.examples) ? v.examples.map((ex) => ({ ...ex })) : [],
    })
  }

  async function saveDraft() {
    if (!draft || saving) return
    setSaving(true)
    const payload = {
      ...(draft.id ? { id: draft.id } : {}),
      word: draft.word.trim(),
      reading: draft.reading.trim(),
      meanings: splitCsv(draft.meanings),
      meanings_id: splitCsv(draft.meanings_id),
      mnemonic: draft.mnemonic.trim() || null,
      audioUrl: draft.audioUrl.trim() || null,
      examples: draft.examples.filter((ex) => ex.ja.trim()),
    }

    const res = await fetch(`/api/admin/kanji/${encodeURIComponent(character)}/vocab`, {
      method: draft.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (res.ok) {
      showToast(draft.id ? 'Kosakata diperbarui.' : 'Kosakata ditambahkan.', 'success')
      setDraft(null)
      onRefresh()
    } else {
      const err = (await res.json()) as { error?: string }
      showToast(err.error || 'Gagal menyimpan kosakata.', 'error')
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(
      `/api/admin/kanji/${encodeURIComponent(character)}/vocab?id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )
    if (res.ok) {
      showToast('Kosakata dihapus.', 'success')
      if (draft?.id === id) setDraft(null)
      onRefresh()
    } else {
      showToast('Gagal menghapus kosakata.', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          {vocabs.length} contoh kosakata untuk Kanji <strong className="font-jp">{character}</strong>
        </p>
        <button
          type="button"
          onClick={openNew}
          className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#660019] text-white text-xs font-semibold flex items-center gap-1"
        >
          <Plus size={14} /> Tambah Kata
        </button>
      </div>

      {draft && (
        <div className="p-4 rounded-2xl border-2 border-[#800020]/30 bg-card-muted/20 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">Kata (Kanji/Kana)</label>
              <input
                type="text"
                value={draft.word}
                onChange={(e) => setDraft({ ...draft, word: e.target.value })}
                placeholder="contoh: 日本"
                className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">Bacaan</label>
              <input
                type="text"
                value={draft.reading}
                onChange={(e) => setDraft({ ...draft, reading: e.target.value })}
                placeholder="にほん"
                className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">Arti Indonesia</label>
              <input
                type="text"
                value={draft.meanings_id}
                onChange={(e) => setDraft({ ...draft, meanings_id: e.target.value })}
                placeholder="Jepang"
                className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">Arti Inggris</label>
              <input
                type="text"
                value={draft.meanings}
                onChange={(e) => setDraft({ ...draft, meanings: e.target.value })}
                placeholder="Japan"
                className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Catatan / Tip Kata</label>
            <input
              type="text"
              value={draft.mnemonic}
              onChange={(e) => setDraft({ ...draft, mnemonic: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface text-sm"
            />
          </div>

          <AdminAudioField
            label="Audio Kata"
            value={draft.audioUrl}
            onChange={(url) => setDraft({ ...draft, audioUrl: url })}
            folder="vocab"
            slug={draft.word || character}
            sourceText={draft.word}
          />

          <div className="space-y-2 pt-2 border-t border-border-color">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-text-muted">
                Contoh Kalimat ({draft.examples.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    examples: [...draft.examples, { ja: '', en: '', furigana: '', audioUrl: '' }],
                  })
                }
                className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
              >
                <Plus size={13} /> Tambah Kalimat
              </button>
            </div>

            {draft.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl border border-border-color bg-surface space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-text-subtle">Kalimat #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        examples: draft.examples.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-xs text-error hover:underline"
                  >
                    Hapus
                  </button>
                </div>
                <input
                  type="text"
                  value={ex.ja}
                  onChange={(e) => {
                    const next = [...draft.examples]
                    next[i] = { ...ex, ja: e.target.value }
                    setDraft({ ...draft, examples: next })
                  }}
                  placeholder="Kalimat Jepang (ja)"
                  className="w-full px-3 py-1.5 rounded-lg border border-border-color bg-surface font-jp text-xs"
                />
                <input
                  type="text"
                  value={ex.furigana ?? ''}
                  onChange={(e) => {
                    const next = [...draft.examples]
                    next[i] = { ...ex, furigana: e.target.value }
                    setDraft({ ...draft, examples: next })
                  }}
                  placeholder="Markup furigana opsional: {東京|とうきょう}"
                  className="w-full px-3 py-1.5 rounded-lg border border-border-color bg-surface font-jp text-xs"
                />
                <input
                  type="text"
                  value={ex.en}
                  onChange={(e) => {
                    const next = [...draft.examples]
                    next[i] = { ...ex, en: e.target.value }
                    setDraft({ ...draft, examples: next })
                  }}
                  placeholder="Terjemahan (en)"
                  className="w-full px-3 py-1.5 rounded-lg border border-border-color bg-surface text-xs"
                />
                <AdminAudioField
                  label={`Audio Kalimat #${i + 1}`}
                  value={ex.audioUrl ?? ''}
                  onChange={(url) => {
                    const next = [...draft.examples]
                    next[i] = { ...ex, audioUrl: url }
                    setDraft({ ...draft, examples: next })
                  }}
                  folder="examples"
                  slug={`${draft.word || character}-${i + 1}`}
                  sourceText={ex.ja}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="px-3 py-2 rounded-xl border border-border-color text-xs font-semibold"
            >
              Tutup Editor Kata
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={saveDraft}
              className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660019] text-white text-xs font-bold disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Kosakata'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {vocabs.length === 0 ? (
          <p className="text-xs text-text-subtle py-4 text-center">Belum ada contoh kosakata di database.</p>
        ) : (
          vocabs.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border-color bg-surface"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-main font-jp">
                  {v.word} <span className="text-xs font-normal text-text-muted">({v.reading})</span>
                </p>
                <p className="text-xs text-text-muted truncate">
                  {v.meanings_id.join(', ') || v.meanings.join(', ')}
                  {Array.isArray(v.examples) && v.examples.length > 0
                    ? ` · ${v.examples.length} contoh`
                    : ''}
                  {v.audioUrl ? ' · 🔊 audio' : ''}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(v)}
                  className="px-2.5 py-1 rounded-lg border border-border-color text-xs font-semibold hover:border-[#800020]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  className="p-1.5 rounded-lg border border-border-color text-error hover:bg-error/10"
                  aria-label="Hapus kosakata"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
