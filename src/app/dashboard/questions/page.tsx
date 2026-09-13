'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, FileText, UploadCloud, Eye } from 'lucide-react'

type QuestionPreview = {
  prompt: string
  kanji?: string
  options: string[]
  correctIndex: number
  type: string
}

export default function QuestionsDashboard() {
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null) // holds bank ID to delete

  // Upload state
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [parsing, setParsing] = useState(false)
  const [parsedQuestions, setParsedQuestions] = useState<QuestionPreview[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('5')
  const [subLevel, setSubLevel] = useState('')

  useEffect(() => {
    fetchBanks()
  }, [])

  async function fetchBanks() {
    const res = await fetch('/api/admin/questions/bank')
    if (res.ok) {
      const data = await res.json()
      setBanks(data.banks)
    }
    setLoading(false)
  }

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
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        setParsedQuestions(data.questions)
      } else {
        setUploadError(data.error)
      }
    } catch (err) {
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
        subLevel: subLevel ? subLevel : null,
        questions: parsedQuestions
      })
    })

    if (res.ok) {
      setShowUploadModal(false)
      setFile(null)
      setFileUrl(null)
      setParsedQuestions([])
      setTitle('')
      fetchBanks()
    } else {
      const data = await res.json()
      setUploadError(data.error)
    }
  }

  async function handleDeleteConfirm() {
    if (!showDeleteModal) return
    const res = await fetch(`/api/admin/questions/bank/${showDeleteModal}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      setShowDeleteModal(null)
      fetchBanks()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Bank Soal Kustom</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          <Plus size={18} /> Upload Soal
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm">
              <th className="p-4 font-medium border-b border-slate-200 dark:border-slate-700">Judul Paket</th>
              <th className="p-4 font-medium border-b border-slate-200 dark:border-slate-700">Target Level</th>
              <th className="p-4 font-medium border-b border-slate-200 dark:border-slate-700">Jumlah Soal</th>
              <th className="p-4 font-medium border-b border-slate-200 dark:border-slate-700">Dibuat Pada</th>
              <th className="p-4 font-medium border-b border-slate-200 dark:border-slate-700 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Memuat...</td></tr>
            ) : banks.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Belum ada soal kustom yang diupload.</td></tr>
            ) : (
              banks.map(bank => (
                <tr key={bank.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium">
                    {bank.title}
                  </td>
                  <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    N{bank.level} {bank.subLevel ? `(Sub ${bank.subLevel})` : '(Simulasi JLPT)'}
                  </td>
                  <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    {bank._count.questions} soal
                  </td>
                  <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    {new Date(bank.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">
                    <button
                      onClick={() => setShowDeleteModal(bank.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Upload Bank Soal (PDF/Word)</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
              {/* Left Column: Form & Preview */}
              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Judul Paket Soal</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Tryout N5 Bagian 1" className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-white" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Target Level</label>
                    <select value={level} onChange={e => setLevel(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-white">
                      {[5,4,3,2,1].map(l => <option key={l} value={l}>N{l}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">SubLevel (Opsional)</label>
                    <input type="number" value={subLevel} onChange={e => setSubLevel(e.target.value)} placeholder="Kosongkan u/ Simulasi" className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-white" />
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <UploadCloud size={48} className="text-slate-400 mb-2" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Pilih file PDF atau Word (.docx)</p>
                  <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                {fileUrl && file?.type === 'application/pdf' && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-64 relative">
                    <div className="absolute top-0 left-0 right-0 bg-slate-800/80 text-white text-xs px-2 py-1 flex items-center gap-2">
                      <Eye size={12} /> Preview PDF
                    </div>
                    <iframe src={fileUrl} className="w-full h-full" />
                  </div>
                )}
                
                {file && (
                  <button onClick={handleExtractText} disabled={parsing} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {parsing ? 'Mengekstrak Teks...' : 'Ekstrak & Validasi Soal'}
                  </button>
                )}

                {uploadError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Right Column: Extracted Result */}
              <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 overflow-y-auto border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Hasil Ekstraksi ({parsedQuestions.length} Soal)</h3>
                
                {parsedQuestions.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-12">Ekstrak file untuk melihat preview struktur soal di sini.</p>
                ) : (
                  <div className="space-y-4">
                    {parsedQuestions.map((q, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <p className="font-medium text-slate-800 dark:text-white mb-2">{i+1}. {q.prompt}</p>
                        {q.kanji && <p className="text-sm text-primary mb-2">Ref Kanji: {q.kanji}</p>}
                        <ul className="text-sm space-y-1 mb-2">
                          {q.options.map((opt, optIdx) => (
                            <li key={optIdx} className={optIdx === q.correctIndex ? 'text-green-600 font-bold' : 'text-slate-600 dark:text-slate-400'}>
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

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
              <button onClick={() => setShowUploadModal(false)} className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">Batal</button>
              <button 
                onClick={handleSaveBank}
                disabled={parsedQuestions.length === 0 || !title}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Konfirmasi & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Hapus Bank Soal?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Tindakan ini tidak dapat dibatalkan. Semua soal di dalam paket ini akan terhapus secara permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Batal</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
