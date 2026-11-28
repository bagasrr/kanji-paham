'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, UploadCloud, Eye } from 'lucide-react'

type QuestionPreview = {
  prompt: string
  kanji?: string
  options: string[]
  correctIndex: number
  type: string
}

type QuestionBankRow = {
  id: string
  title: string
  level: number
  subLevel: number | null
  createdAt: string
  _count: { questions: number }
}

export default function QuestionsDashboard() {
  const [banks, setBanks] = useState<QuestionBankRow[]>([])
  const [loading, setLoading] = useState(true)

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [parsing, setParsing] = useState(false)
  const [parsedQuestions, setParsedQuestions] = useState<QuestionPreview[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('5')
  const [subLevel, setSubLevel] = useState('')

  async function fetchBanks() {
    const res = await fetch('/api/admin/questions/bank')
    if (res.ok) {
      const data = (await res.json()) as { banks: QuestionBankRow[] }
      setBanks(data.banks)
    }
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    fetch('/api/admin/questions/bank')
      .then((res) => (res.ok ? (res.json() as Promise<{ banks: QuestionBankRow[] }>) : null))
      .then((data) => {
        if (!active) return
        if (data) setBanks(data.banks)
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setFileUrl(URL.createObjectURL(selected))
      setParsedQuestions([])
      setUploadError(null)
    }
  }

  async function handleExtractText() {
    if (!file) return
    setParsing(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/questions/parse', {
        method: 'POST',
        body: formData,
      })
      const data = (await res.json()) as { questions?: QuestionPreview[]; error?: string }
      if (res.ok && data.questions) {
        setParsedQuestions(data.questions)
      } else {
        setUploadError(data.error || 'Gagal mengekstrak soal')
      }
    } catch {
      setUploadError('Gagal memproses file')
    }
    setParsing(false)
  }

  async function handleSaveBank() {
    if (!title || parsedQuestions.length === 0) return

    const res = await fetch('/api/admin/questions/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        level,
        subLevel: subLevel || null,
        questions: parsedQuestions,
      }),
    })

    if (res.ok) {
      setShowUploadModal(false)
      setFile(null)
      setFileUrl(null)
      setParsedQuestions([])
      setTitle('')
      void fetchBanks()
    } else {
      const data = (await res.json()) as { error?: string }
      setUploadError(data.error || 'Gagal menyimpan bank soal')
    }
  }

  async function handleDeleteConfirm() {
    if (!showDeleteModal) return
    const res = await fetch(`/api/admin/questions/bank/${showDeleteModal}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setShowDeleteModal(null)
      void fetchBanks()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Bank Soal Kustom</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Unggah paket soal pilihan ganda dari PDF atau Word (.docx)
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} /> Upload Soal
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-border-color overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-card-muted/40 text-text-muted text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-border-color">Judul Paket</th>
              <th className="p-4 font-bold border-b border-border-color">Target Level</th>
              <th className="p-4 font-bold border-b border-border-color">Jumlah Soal</th>
              <th className="p-4 font-bold border-b border-border-color">Dibuat Pada</th>
              <th className="p-4 font-bold border-b border-border-color text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted text-sm">Memuat...</td>
              </tr>
            ) : banks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted text-sm">
                  Belum ada soal kustom yang diupload.
                </td>
              </tr>
            ) : (
              banks.map((bank) => (
                <tr key={bank.id} className="hover:bg-card-muted/25 transition-colors">
                  <td className="p-4 border-b border-border-color text-text-main font-semibold">
                    {bank.title}
                  </td>
                  <td className="p-4 border-b border-border-color text-text-muted text-sm">
                    <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] dark:text-[#F28482] font-bold text-xs mr-1.5">
                      N{bank.level}
                    </span>
                    {bank.subLevel ? `Sub ${bank.subLevel}` : 'Simulasi JLPT'}
                  </td>
                  <td className="p-4 border-b border-border-color text-text-muted text-sm">
                    {bank._count.questions} soal
                  </td>
                  <td className="p-4 border-b border-border-color text-text-muted text-sm">
                    {new Date(bank.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 border-b border-border-color text-right">
                    <button
                      onClick={() => setShowDeleteModal(bank.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors inline-flex"
                      aria-label={`Hapus ${bank.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border-color shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-border-color flex justify-between items-center bg-[#800020] text-white">
              <h2 className="text-lg font-bold">Upload Bank Soal (PDF/Word)</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="hover:bg-white/15 p-1.5 rounded-lg"
                aria-label="Tutup modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-main">Judul Paket Soal</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Tryout N5 Bagian 1"
                    className="w-full px-4 py-2 rounded-xl border border-border-color bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-text-main">Target Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border-color bg-surface text-text-main"
                    >
                      {[5, 4, 3, 2, 1].map((l) => (
                        <option key={l} value={l}>N{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-text-main">SubLevel (Opsional)</label>
                    <input
                      type="number"
                      value={subLevel}
                      onChange={(e) => setSubLevel(e.target.value)}
                      placeholder="Kosongkan u/ Simulasi"
                      className="w-full px-4 py-2 rounded-xl border border-border-color bg-surface text-text-main"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-border-color rounded-xl p-6 flex flex-col items-center justify-center text-center bg-card-muted/20">
                  <UploadCloud size={44} className="text-[#800020] dark:text-[#F28482] mb-2" />
                  <p className="text-text-muted text-sm mb-4">Pilih file PDF atau Word (.docx)</p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#800020]/10 file:text-[#800020] hover:file:bg-[#800020]/20 cursor-pointer"
                  />
                </div>

                {fileUrl && file?.type === 'application/pdf' && (
                  <div className="border border-border-color rounded-xl overflow-hidden h-64 relative">
                    <div className="absolute top-0 left-0 right-0 bg-[#800020]/90 text-white text-xs px-2.5 py-1 flex items-center gap-2">
                      <Eye size={12} /> Preview PDF
                    </div>
                    <iframe src={fileUrl} className="w-full h-full" />
                  </div>
                )}

                {file && (
                  <button
                    onClick={handleExtractText}
                    disabled={parsing}
                    className="w-full py-3 bg-[#800020] hover:bg-[#660019] text-white rounded-xl font-semibold disabled:opacity-50 transition-colors"
                  >
                    {parsing ? 'Mengekstrak Teks...' : 'Ekstrak & Validasi Soal'}
                  </button>
                )}

                {uploadError && (
                  <div className="p-4 bg-error/10 text-error rounded-xl border border-error/25 text-sm">
                    {uploadError}
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 bg-card-muted/25 rounded-xl p-4 overflow-y-auto border border-border-color">
                <h3 className="font-bold text-text-main mb-4">
                  Hasil Ekstraksi ({parsedQuestions.length} Soal)
                </h3>

                {parsedQuestions.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-12">
                    Ekstrak file untuk melihat preview struktur soal di sini.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {parsedQuestions.map((q, i) => (
                      <div key={i} className="bg-surface p-4 rounded-xl shadow-sm border border-border-color">
                        <p className="font-medium text-text-main mb-2">{i + 1}. {q.prompt}</p>
                        {q.kanji && <p className="text-sm text-[#800020] dark:text-[#F28482] mb-2">Ref Kanji: {q.kanji}</p>}
                        <ul className="text-sm space-y-1 mb-2">
                          {q.options.map((opt, optIdx) => (
                            <li
                              key={optIdx}
                              className={optIdx === q.correctIndex ? 'text-success font-bold' : 'text-text-muted'}
                            >
                              {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correctIndex && '✓'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-border-color flex justify-end gap-3 bg-card-muted/20">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-5 py-2.5 text-text-muted font-medium hover:bg-card-muted rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveBank}
                disabled={parsedQuestions.length === 0 || !title}
                className="px-5 py-2.5 bg-[#800020] hover:bg-[#660019] text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
              >
                Konfirmasi & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border-color shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-error/15 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Hapus Bank Soal?</h3>
            <p className="text-sm text-text-muted mb-6">
              Tindakan ini tidak dapat dibatalkan. Semua soal di dalam paket ini akan terhapus secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 py-2.5 bg-card-muted text-text-main rounded-xl font-semibold hover:bg-border-color/50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-error text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
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
