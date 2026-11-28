/**
 * src/hooks/useJapaneseSpeech.ts
 *
 * Hybrid Japanese audio playback hook:
 * 1. Prefers pre-recorded / Supabase Storage MP3/audio URLs when provided.
 * 2. Falls back seamlessly to Web Speech API (SpeechSynthesisUtterance ja-JP)
 *    when no custom audioUrl exists or playback fails.
 */

'use client'

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}
const getSpeechSupportSnapshot = (): boolean =>
  typeof window !== 'undefined' &&
  (('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') ||
    typeof Audio !== 'undefined')
const getSpeechSupportServerSnapshot = (): boolean => false

export interface UseJapaneseSpeechReturn {
  /** Speak text using custom audioUrl first, or fallback to Web Speech API. */
  speak: (text: string, audioUrl?: string | null) => void
  /** Cancel any ongoing audio/utterance immediately. */
  stop: () => void
  /** True while audio or speech synthesis is playing. */
  isPlaying: boolean
  /** True when Audio or Web Speech API is available. */
  isSupported: boolean
}

export function useJapaneseSpeech(): UseJapaneseSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false)

  const isSupported = useSyncExternalStore(
    noopSubscribe,
    getSpeechSupportSnapshot,
    getSpeechSupportServerSnapshot
  )

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  const speakWithSynthesis = useCallback((text: string) => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      setIsPlaying(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = window.speechSynthesis.getVoices()
    const japaneseVoice = voices.find((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja'))
    if (japaneseVoice) utterance.voice = japaneseVoice

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => {
      setIsPlaying(false)
      utteranceRef.current = null
    }
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.warn('useJapaneseSpeech: speech error', e.error)
      }
      setIsPlaying(false)
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const speak = useCallback(
    (text: string, audioUrl?: string | null) => {
      if (!isSupported) return
      const trimmedUrl = audioUrl?.trim()
      if (!text.trim() && !trimmedUrl) return

      stop()

      if (trimmedUrl && typeof Audio !== 'undefined') {
        const audio = new Audio(trimmedUrl)
        audioRef.current = audio
        audio.onplay = () => setIsPlaying(true)
        audio.onended = () => {
          setIsPlaying(false)
          audioRef.current = null
        }
        audio.onerror = () => {
          audioRef.current = null
          if (text.trim()) {
            speakWithSynthesis(text)
          } else {
            setIsPlaying(false)
          }
        }
        void audio.play().catch(() => {
          audioRef.current = null
          if (text.trim()) {
            speakWithSynthesis(text)
          } else {
            setIsPlaying(false)
          }
        })
        return
      }

      speakWithSynthesis(text)
    },
    [isSupported, speakWithSynthesis, stop]
  )

  return { speak, stop, isPlaying, isSupported }
}
