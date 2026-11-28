'use client'

import { useCallback, useEffect, useState } from 'react'
import { Edit3, Plus, Search, Trash2, X } from 'lucide-react'
import { AdminKanjiVocabTab, type AdminVocabRow } from '@/components/AdminKanjiVocabTab'
import { useToast } from '@/components/Toast'

interface SoundHookItem {
  r: string
  hook: string
  emoji?: string
}

interface AdminKanjiRow {
  character: string
  strokes: number
  jlpt: number
  subLevel: number
  meanings: string[]
  meanings_id: string[]
  readings_on: string[]
  readings_kun: string[]
  keyword: string | null
  mnemonic: string | null
  components?: string[]
  radicals?: string[]
  soundHooks?: SoundHookItem[] | null
}

interface KanjiFormState {
  character: string
  jlpt: number
  subLevel: number
  strokes: number
  meanings: string
  meanings_id: string
  readings_on: string
  readings_kun: string
  keyword: string
  mnemonic: string
  components: string
  radicals: string
  soundHooks: SoundHookItem[]
}

const EMPTY_FORM: KanjiFormState = {
  character: '',
  jlpt: 5,
  subLevel: 1,
  strokes: 1,
  meanings: '',
  meanings_id: '',
  readings_on: '',
  readings_kun: '',
  keyword: '',
  mnemonic: '',
  components: '',
  radicals: '',
  soundHooks: [],
}

function splitCsv(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function AdminKanjiPage() {
  const { showToast } = useToast()

  const [kanjis, setKanjis] = useState<AdminKanjiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [modalTab, setModalTab] = useState<'info' | 'vocab'>('info')
  const [form, setForm] = useState<KanjiFormState>(EMPTY_FORM)
  const [vocabs, setVocabs] = useState<AdminVocabRow[]>([])
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const fetchKanjis = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      level: levelFilter,
      q: query,
      page: String(page),
    })
    const res = await fetch(`/api/admin/kanji?${params.toString()}`)
    if (res.ok) {
      const data = (await res.json()) as {
        kanjis: AdminKanjiRow[]
        total: number
        totalPages: number
      }
      setKanjis(data.kanjis)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }, [levelFilter, query, page])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchKanjis()
    }, 150)
    return () => window.clearTimeout(id)
  }, [fetchKanjis])

  const loadKanjiDetail = useCallback(async (char: string) => {
    const res = await fetch(`/api/admin/kanji/${encodeURIComponent(char)}`)
    if (!res.ok) return
    const data = (await res.json()) as {
      kanji: AdminKanjiRow & { vocab?: AdminVocabRow[] }
    }
    const k = data.kanji
    setForm({
      character: k.character,
      jlpt: k.jlpt,
      subLevel: k.subLevel,
      strokes: k.strokes,
      meanings: k.meanings.join(', '),
      meanings_id: k.meanings_id.join(', '),
      readings_on: k.readings_on.join(', '),
      readings_kun: k.readings_kun.join(', '),
      keyword: k.keyword ?? '',
      mnemonic: k.mnemonic ?? '',
      components: (k.components ?? []).join(', '),
      radicals: (k.radicals ?? []).join(', '),
      soundHooks: Array.isArray(k.soundHooks) ? k.soundHooks : [],
    })
    setVocabs(k.vocab ?? [])
  }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setVocabs([])
    setModalTab('info')
    setModalMode('create')
  }

  function openEdit(row: AdminKanjiRow) {
    setForm({
      character: row.character,
      jlpt: row.jlpt,
      subLevel: row.subLevel,
      strokes: row.strokes,
      meanings: row.meanings.join(', '),
      meanings_id: row.meanings_id.join(', '),
      readings_on: row.readings_on.join(', '),
      readings_kun: row.readings_kun.join(', '),
      keyword: row.keyword ?? '',
      mnemonic: row.mnemonic ?? '',
      components: (row.components ?? []).join(', '),
      radicals: (row.radicals ?? []).join(', '),
      soundHooks: Array.isArray(row.soundHooks) ? row.soundHooks : [],
    })
    setVocabs([])
    setModalTab('info')
    setModalMode('edit')
    void loadKanjiDetail(row.character)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)

    const payload = {
      character: form.character.trim(),
      jlpt: form.jlpt,
      subLevel: form.subLevel,
      strokes: form.strokes,
      meanings: splitCsv(form.meanings),
      meanings_id: splitCsv(form.meanings_id),
      readings_on: splitCsv(form.readings_on),
      readings_kun: splitCsv(form.readings_kun),
      keyword: form.keyword.trim() || null,
      mnemonic: form.mnemonic.trim() || null,
      components: splitCsv(form.components),
      radicals: splitCsv(form.radicals),
      soundHooks: form.soundHooks.filter((s) => s.r.trim() && s.hook.trim()),
    }

    const url =
      modalMode === 'edit'
        ? `/api/admin/kanji/${encodeURIComponent(form.character)}`
        : '/api/admin/kanji'
    const res = await fetch(url, {
      method: modalMode === 'edit' ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (res.ok) {
      showToast(
        modalMode === 'edit' ? 'Data kanji diperbarui.' : 'Kanji baru ditambahkan.',
        'success'
      )
      setModalMode(null)
      void fetchKanjis()
    } else {
      const err = (await res.json()) as { error?: string }
      showToast(err.error || 'Gagal menyimpan data kanji.', 'error')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/kanji/${encodeURIComponent(deleteTarget)}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      showToast(`Kanji ${deleteTarget} dihapus.`, 'success')
      setDeleteTarget(null)
      void fetchKanjis()
    } else {
      showToast('Gagal menghapus kanji.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Kelola Kanji</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {total} kanji tersimpan di database PostgreSQL
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} /> Tambah Kanji
        </button>
      </div>

      {/* Filters */}
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
            placeholder="Cari karakter, arti, atau keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-surface text-sm text-text-main focus:outline-none focus:border-[#800020]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', '5', '4', '3', '2', '1'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setLevelFilter(lvl)
                setPage(1)
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex-shrink-0 ${
                levelFilter === lvl
                  ? 'bg-[#800020] text-white border-[#800020]'
                  : 'bg-surface border-border-color text-text-muted hover:text-text-main'
              }`}
            >
              {lvl === 'all' ? 'Semua' : `N${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border-color overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-card-muted/40 text-text-muted text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-border-color">Kanji</th>
              <th className="p-4 font-bold border-b border-border-color">Level</th>
              <th className="p-4 font-bold border-b border-border-color">Arti (ID / EN)</th>
              <th className="p-4 font-bold border-b border-border-color">Bacaan</th>
              <th className="p-4 font-bold border-b border-border-color text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted text-sm">Memuat data kanji...</td>
              </tr>
            ) : kanjis.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted text-sm">Tidak ada kanji ditemukan.</td>
              </tr>
            ) : (
              kanjis.map((k) => (
                <tr key={k.character} className="hover:bg-card-muted/25 transition-colors">
                  <td className="p-4 border-b border-border-color">
                    <span className="text-3xl font-bold text-text-main font-jp">{k.character}</span>
                  </td>
                  <td className="p-4 border-b border-border-color text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] dark:text-[#F28482] font-bold">
                      N{k.jlpt}
                    </span>
                    <span className="block text-text-subtle mt-1">
                      Sub {k.subLevel} · {k.strokes} str
                    </span>
                  </td>
                  <td className="p-4 border-b border-border-color text-sm">
                    <p className="font-semibold text-text-main capitalize">
                      {k.meanings_id.length > 0 ? k.meanings_id.join(', ') : k.meanings.join(', ')}
                    </p>
                    {k.keyword && (
                      <span className="text-xs text-text-muted">Keyword: {k.keyword}</span>
                    )}
                  </td>
                  <td className="p-4 border-b border-border-color text-xs text-text-muted font-jp">
                    <div>On: {k.readings_on.join('、') || '-'}</div>
                    <div>Kun: {k.readings_kun.join('、') || '-'}</div>
                  </td>
                  <td className="p-4 border-b border-border-color text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(k)}
                      className="p-2 text-[#800020] dark:text-[#F28482] hover:bg-[#800020]/10 rounded-lg transition-colors inline-flex mr-1"
                      aria-label={`Edit ${k.character}`}
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(k.character)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors inline-flex"
                      aria-label={`Hapus ${k.character}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            Halaman <strong className="text-text-main">{page}</strong> dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3.5 py-2 rounded-xl border border-border-color bg-surface disabled:opacity-40 font-semibold"
            >
              Sebelumnya
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3.5 py-2 rounded-xl border border-border-color bg-surface disabled:opacity-40 font-semibold"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-surface rounded-2xl border border-border-color shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="p-5 bg-[#800020] text-white flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {modalMode === 'edit' ? `Edit Kanji ${form.character}` : 'Tambah Kanji Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-lg hover:bg-white/15"
              >
                <X size={18} />
              </button>
            </div>

            {modalMode === 'edit' && (
              <div className="flex border-b border-border-color bg-card-muted/20 px-5 pt-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModalTab('info')}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                    modalTab === 'info'
                      ? 'border-[#800020] text-[#800020] dark:text-[#F28482]'
                      : 'border-transparent text-text-muted'
                  }`}
                >
                  Info &amp; Mnemonic
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('vocab')}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                    modalTab === 'vocab'
                      ? 'border-[#800020] text-[#800020] dark:text-[#F28482]'
                      : 'border-transparent text-text-muted'
                  }`}
                >
                  Contoh Kata &amp; Kalimat ({vocabs.length})
                </button>
              </div>
            )}

            <div className="p-5 overflow-y-auto space-y-3.5 text-sm">
              {modalTab === 'vocab' && modalMode === 'edit' ? (
                <AdminKanjiVocabTab
                  character={form.character}
                  vocabs={vocabs}
                  onRefresh={() => void loadKanjiDetail(form.character)}
                />
              ) : (
                <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Karakter</label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'edit'}
                    value={form.character}
                    onChange={(e) => setForm({ ...form, character: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp text-lg text-center disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">JLPT</label>
                  <select
                    value={form.jlpt}
                    onChange={(e) => setForm({ ...form, jlpt: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                  >
                    {[5, 4, 3, 2, 1].map((l) => (
                      <option key={l} value={l}>N{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">SubLevel</label>
                  <input
                    type="number"
                    min={1}
                    value={form.subLevel}
                    onChange={(e) => setForm({ ...form, subLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Strokes</label>
                  <input
                    type="number"
                    min={1}
                    value={form.strokes}
                    onChange={(e) => setForm({ ...form, strokes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">Arti Indonesia (pisahkan koma)</label>
                <input
                  type="text"
                  value={form.meanings_id}
                  onChange={(e) => setForm({ ...form, meanings_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">Arti Inggris (pisahkan koma)</label>
                <input
                  type="text"
                  value={form.meanings}
                  onChange={(e) => setForm({ ...form, meanings: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">On&apos;yomi (pisahkan koma)</label>
                  <input
                    type="text"
                    value={form.readings_on}
                    onChange={(e) => setForm({ ...form, readings_on: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Kun&apos;yomi (pisahkan koma)</label>
                  <input
                    type="text"
                    value={form.readings_kun}
                    onChange={(e) => setForm({ ...form, readings_kun: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">Keyword Mnemonic</label>
                <input
                  type="text"
                  value={form.keyword}
                  onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">Cerita Mnemonic</label>
                <textarea
                  rows={3}
                  value={form.mnemonic}
                  onChange={(e) => setForm({ ...form, mnemonic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Komponen (pisahkan koma)</label>
                  <input
                    type="text"
                    value={form.components}
                    onChange={(e) => setForm({ ...form, components: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Radikal (pisahkan koma)</label>
                  <input
                    type="text"
                    value={form.radicals}
                    onChange={(e) => setForm({ ...form, radicals: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-surface font-jp"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border-color">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted">Sound Hooks ({form.soundHooks.length})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        soundHooks: [...form.soundHooks, { r: '', hook: '', emoji: '' }],
                      })
                    }
                    className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Tambah Sound Hook
                  </button>
                </div>
                {form.soundHooks.map((sh, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={sh.r}
                      onChange={(e) => {
                        const next = [...form.soundHooks]
                        next[idx] = { ...sh, r: e.target.value }
                        setForm({ ...form, soundHooks: next })
                      }}
                      placeholder="Bacaan"
                      className="col-span-3 px-2.5 py-1.5 rounded-lg border border-border-color bg-surface font-jp text-xs"
                    />
                    <input
                      type="text"
                      value={sh.hook}
                      onChange={(e) => {
                        const next = [...form.soundHooks]
                        next[idx] = { ...sh, hook: e.target.value }
                        setForm({ ...form, soundHooks: next })
                      }}
                      placeholder="Asosiasi bunyi"
                      className="col-span-6 px-2.5 py-1.5 rounded-lg border border-border-color bg-surface text-xs"
                    />
                    <input
                      type="text"
                      value={sh.emoji ?? ''}
                      onChange={(e) => {
                        const next = [...form.soundHooks]
                        next[idx] = { ...sh, emoji: e.target.value }
                        setForm({ ...form, soundHooks: next })
                      }}
                      placeholder="Emoji"
                      className="col-span-2 px-2 py-1.5 rounded-lg border border-border-color bg-surface text-xs text-center"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          soundHooks: form.soundHooks.filter((_, i) => i !== idx),
                        })
                      }
                      className="col-span-1 text-error text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-border-color flex justify-end gap-3 bg-card-muted/20">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-text-muted hover:bg-card-muted"
              >
                {modalTab === 'vocab' ? 'Tutup' : 'Batal'}
              </button>
              {modalTab === 'info' && (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#800020] hover:bg-[#660019] text-white disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border-color p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-text-main mb-2">Hapus Kanji {deleteTarget}?</h3>
            <p className="text-sm text-text-muted mb-5">
              Kanji dan seluruh kosakata terkait di database akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-card-muted text-text-main font-semibold text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-error text-white font-semibold text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
