/**
 * src/hooks/useJapaneseSpeech.ts
 *
 * Custom hook that wraps the Web Speech API (SpeechSynthesisUtterance)
 * for Japanese (ja-JP) pronunciation playback.
 *
 * Phase 1 (MVP): uses browser TTS as a lightweight fallback.
 * Phase 2: will be supplemented by native MP3s from Tatoeba
 *          via <audio src="/audio/sentences/[id].mp3" />.
 *
 * Usage:
 *   const { speak, isPlaying, isSupported } = useJapaneseSpeech();
 *   <button onClick={() => speak("日本語")} disabled={isPlaying} />
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface UseJapaneseSpeechReturn {
  /** Speak the given Japanese text. No-op if already playing or unsupported. */
  speak: (text: string) => void;
  /** Cancel any ongoing utterance immediately. */
  stop: () => void;
  /** True while an utterance is being spoken. */
  isPlaying: boolean;
  /**
   * True when the browser supports the Web Speech API.
   * Use this to conditionally render the audio button.
   */
  isSupported: boolean;
}

export function useJapaneseSpeech(): UseJapaneseSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false);

  // Detect support once on mount (avoids SSR window access)
  const isSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined";

  // Keep a ref to the active utterance so we can cancel it
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount — prevent state updates on dead component
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    utteranceRef.current = null;
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;
      if (!text.trim()) return;

      // Cancel any currently running utterance first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;  // slightly slower for learners
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Prefer a Japanese voice if available
      const voices = window.speechSynthesis.getVoices();
      const japaneseVoice = voices.find(
        (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
      );
      if (japaneseVoice) utterance.voice = japaneseVoice;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
      };
      utterance.onerror = (e) => {
        // 'interrupted' fires when we cancel() before natural end — not a real error
        if (e.error !== "interrupted") {
          console.warn("useJapaneseSpeech: speech error", e.error);
        }
        setIsPlaying(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  return { speak, stop, isPlaying, isSupported };
}
