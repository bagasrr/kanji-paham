/**
 * Server-only helpers for uploading audio to Supabase Storage and optionally
 * synthesizing single-item TTS via ElevenLabs on explicit admin action.
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

const DEFAULT_ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'
const DEFAULT_ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2'

export interface AudioIntegrationStatus {
  supabaseConfigured: boolean
  elevenLabsConfigured: boolean
  bucket: string
  defaultModel: string
}

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const bucket = (process.env.SUPABASE_AUDIO_BUCKET || 'audio').trim() || 'audio'
  return { url, serviceKey, bucket }
}

function getElevenLabsConfig() {
  const apiKey = process.env.ELEVENLABS_API_KEY || ''
  const voiceId = (process.env.ELEVENLABS_VOICE_ID || DEFAULT_ELEVENLABS_VOICE_ID).trim()
  const modelId = (process.env.ELEVENLABS_MODEL_ID || DEFAULT_ELEVENLABS_MODEL_ID).trim()
  return { apiKey, voiceId, modelId }
}

/** Return non-secret configuration readiness booleans for the Admin UI. */
export function getAudioIntegrationStatus(): AudioIntegrationStatus {
  const sb = getSupabaseConfig()
  const el = getElevenLabsConfig()
  return {
    supabaseConfigured: Boolean(sb.url && sb.serviceKey),
    elevenLabsConfigured: Boolean(el.apiKey),
    bucket: sb.bucket,
    defaultModel: el.modelId,
  }
}

/** Build an ASCII-safe storage object path using UTF-16 codepoints for Japanese glyphs. */
export function buildSafeAudioPath(folder: string, slug: string, ext: string): string {
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'misc'
  const hexSlug = Array.from(slug.trim() || 'clip')
    .slice(0, 24)
    .map((ch) => (/^[a-zA-Z0-9_-]$/.test(ch) ? ch : ch.codePointAt(0)?.toString(16) || 'x'))
    .join('')
  const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'mp3'
  return `${cleanFolder}/${hexSlug}-${Date.now()}.${cleanExt}`
}

/** Upload an audio buffer to Supabase Storage via REST and return its public URL. */
export async function uploadAudioToSupabase(
  data: ArrayBuffer | Uint8Array,
  storagePath: string,
  contentType: string
): Promise<string> {
  const { url, serviceKey, bucket } = getSupabaseConfig()
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase Storage belum dikonfigurasi. Tambahkan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.'
    )
  }

  const normalizedPath = storagePath.replace(/^\/+/, '')
  const endpoint = `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${normalizedPath}`

  const headers: Record<string, string> = {
    apikey: serviceKey,
    'Content-Type': contentType,
    'x-upsert': 'true',
  }
  if (!serviceKey.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${serviceKey}`
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: data instanceof Uint8Array ? Buffer.from(data) : Buffer.from(data),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText)
    throw new Error(`Gagal upload ke Supabase Storage (${res.status}): ${detail.slice(0, 200)}`)
  }

  return `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${normalizedPath}`
}

/** Generate Japanese speech MP3 via @elevenlabs/elevenlabs-js (only called manually by Admin). */
export async function generateElevenLabsAudio(
  text: string,
  options?: { voiceId?: string; modelId?: string }
): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  const { apiKey, voiceId: defaultVoice, modelId: defaultModel } = getElevenLabsConfig()
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY belum diset di .env.local.')
  }

  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error('Teks untuk suara tidak boleh kosong.')
  }

  const voiceId = (options?.voiceId || defaultVoice).trim()
  const modelId = (options?.modelId || defaultModel).trim()

  const client = new ElevenLabsClient()
  const audioStream = await client.textToSpeech.convert(voiceId, {
    text: trimmed,
    modelId,
  })

  return {
    buffer: await new Response(audioStream).arrayBuffer(),
    contentType: 'audio/mpeg',
  }
}
