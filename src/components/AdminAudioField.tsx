'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Play, Sparkles, Square, Upload } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface AudioStatus {
  supabaseConfigured: boolean
  elevenLabsConfigured: boolean
}

interface Props {
  label?: string
  value: string
  onChange: (nextUrl: string) => void
  folder: string
  slug: string
  sourceText?: string
}

let cachedStatus: AudioStatus | null = null

export function AdminAudioField({
  label = 'Audio (Supabase Storage / ElevenLabs)',
  value,
  onChange,
  folder,
  slug,
  sourceText = '',
}: Props) {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [status, setStatus] = useState<AudioStatus>(
    cachedStatus ?? { supabaseConfigured: false, elevenLabsConfigured: false }
  )
  const [busy, setBusy] = useState<'upload' | 'elevenlabs' | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (cachedStatus) return
    let active = true
    fetch('/api/admin/audio')
      .then((res) => (res.ok ? (res.json() as Promise<AudioStatus>) : null))
      .then((data) => {
        if (active && data) {
          cachedStatus = data
          setStatus(data)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  function togglePlay() {
    if (!value.trim()) return
    if (playing && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
      return
    }
    const audio = new Audio(value.trim())
    audioRef.current = audio
    audio.onplay = () => setPlaying(true)
    audio.onended = () => setPlaying(false)
    audio.onerror = () => {
      setPlaying(false)
      showToast('Gagal memutar URL audio tersebut.', 'error')
    }
    void audio.play().catch(() => setPlaying(false))
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy('upload')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      fd.append('slug', slug)
      const res = await fetch('/api/admin/audio', { method: 'POST', body: fd })
      const data = (await res.json()) as { audioUrl?: string; error?: string }
      if (res.ok && data.audioUrl) {
        onChange(data.audioUrl)
        showToast('Audio diunggah ke Supabase Storage.', 'success')
      } else {
        showToast(data.error || 'Gagal mengunggah audio.', 'error')
      }
    } finally {
      setBusy(null)
    }
  }

  async function handleElevenLabsGenerate() {
    const text = sourceText.trim()
    if (!text) {
      showToast('Isi teks Jepang dulu sebelum generate audio.', 'error')
      return
    }
    if (!window.confirm(`Generate suara ElevenLabs untuk ${text.length} karakter sekarang?`)) {
      return
    }
    setBusy('elevenlabs')
    try {
      const res = await fetch('/api/admin/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'elevenlabs',
          text,
          folder,
          slug,
        }),
      })
      const data = (await res.json()) as {
        audioUrl?: string
        charactersUsed?: number
        error?: string
      }
      if (res.ok && data.audioUrl) {
        onChange(data.audioUrl)
        showToast(
          `Audio ElevenLabs dibuat (${data.charactersUsed ?? text.length} kar.) & disimpan ke Supabase.`,
          'success'
        )
      } else {
        showToast(data.error || 'Gagal generate suara ElevenLabs.', 'error')
      }
    } finally {
      setBusy(null)
    }
  }

  const trimmedSource = sourceText.trim()

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase text-text-muted">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://.../storage/v1/object/public/audio/..."
          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-border-color bg-surface text-xs text-text-main focus:outline-none focus:border-[#800020]"
        />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value.trim() && (
            <button
              type="button"
              onClick={togglePlay}
              className="px-2.5 py-2 rounded-xl border border-border-color bg-surface text-xs font-semibold text-text-main hover:border-[#800020] flex items-center gap-1"
              title="Preview audio"
            >
              {playing ? <Square size={13} /> : <Play size={13} />}
              <span>{playing ? 'Stop' : 'Putar'}</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => fileInputRef.current?.click()}
            title={
              status.supabaseConfigured
                ? 'Upload MP3/WAV/M4A ke Supabase Storage'
                : 'Konfigurasi SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env untuk upload'
            }
            className="px-2.5 py-2 rounded-xl border border-border-color bg-surface text-xs font-semibold text-text-main hover:border-[#800020] disabled:opacity-50 flex items-center gap-1"
          >
            {busy === 'upload' ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            <span>Upload</span>
          </button>
          <button
            type="button"
            disabled={busy !== null || !status.elevenLabsConfigured || !status.supabaseConfigured}
            onClick={handleElevenLabsGenerate}
            title={
              !status.elevenLabsConfigured
                ? 'Tambahkan ELEVENLABS_API_KEY di .env untuk mengaktifkan'
                : !status.supabaseConfigured
                ? 'Tambahkan SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env untuk menyimpan hasil'
                : `Generate via ElevenLabs (${trimmedSource.length} karakter)`
            }
            className="px-2.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#660019] disabled:opacity-45 flex items-center gap-1"
          >
            {busy === 'elevenlabs' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Sparkles size={13} />
            )}
            <span>ElevenLabs{trimmedSource ? ` (${trimmedSource.length})` : ''}</span>
          </button>
        </div>
      </div>
      {(!status.supabaseConfigured || !status.elevenLabsConfigured) && (
        <p className="text-[11px] text-text-subtle">
          {!status.supabaseConfigured && 'Supabase Storage belum diset (.env) · '}
          {!status.elevenLabsConfigured && 'ElevenLabs API belum diset (.env) · '}
          URL audio manual tetap bisa diisi kapan saja.
        </p>
      )}
    </div>
  )
}
