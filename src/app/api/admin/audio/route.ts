import { NextRequest, NextResponse } from 'next/server'
import { requireStaff } from '@/lib/admin'
import {
  buildSafeAudioPath,
  generateElevenLabsAudio,
  getAudioIntegrationStatus,
  uploadAudioToSupabase,
} from '@/lib/audio-storage'

export const dynamic = 'force-dynamic'

const MAX_AUDIO_BYTES = 10 * 1024 * 1024
const ALLOWED_AUDIO_MIME = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/ogg',
  'audio/webm',
])

export async function GET() {
  const { error } = await requireStaff()
  if (error) return error

  return NextResponse.json(getAudioIntegrationStatus())
}

export async function POST(request: NextRequest) {
  const { error } = await requireStaff()
  if (error) return error

  const contentType = request.headers.get('content-type') || ''

  try {
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file')
      const folder = String(formData.get('folder') || 'misc')
      const slug = String(formData.get('slug') || 'clip')

      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'File audio tidak ditemukan' }, { status: 400 })
      }
      if (file.size === 0 || file.size > MAX_AUDIO_BYTES) {
        return NextResponse.json(
          { error: 'Ukuran file audio maksimal 10 MB' },
          { status: 400 }
        )
      }

      const mime = file.type || 'audio/mpeg'
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3'
      if (!ALLOWED_AUDIO_MIME.has(mime) && !['mp3', 'wav', 'm4a', 'ogg', 'webm'].includes(ext)) {
        return NextResponse.json(
          { error: 'Format file harus MP3, WAV, M4A, OGG, atau WEBM' },
          { status: 400 }
        )
      }

      const buffer = await file.arrayBuffer()
      const objectPath = buildSafeAudioPath(folder, slug, ext)
      const audioUrl = await uploadAudioToSupabase(buffer, objectPath, mime)

      return NextResponse.json({ audioUrl, storagePath: objectPath })
    }

    const body = (await request.json()) as {
      mode?: string
      text?: string
      folder?: string
      slug?: string
      voiceId?: string
    }

    if (body.mode !== 'elevenlabs') {
      return NextResponse.json({ error: 'Mode upload audio tidak valid' }, { status: 400 })
    }

    const text = (body.text ?? '').trim()
    if (!text) {
      return NextResponse.json({ error: 'Teks untuk generate audio wajib diisi' }, { status: 400 })
    }

    const { buffer, contentType: ttsMime } = await generateElevenLabsAudio(text, {
      voiceId: body.voiceId,
    })
    const objectPath = buildSafeAudioPath(body.folder || 'elevenlabs', body.slug || 'tts', 'mp3')
    const audioUrl = await uploadAudioToSupabase(buffer, objectPath, ttsMime)

    return NextResponse.json({
      audioUrl,
      storagePath: objectPath,
      charactersUsed: text.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal memproses file audio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
