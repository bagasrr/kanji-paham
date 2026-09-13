"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ExternalLink, Copy, Check, Sparkles, MessageSquareHeart, Heart, ArrowLeft, Code2, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/Toast";

function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function InfoPage() {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const email = "business.bagasrr@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      showToast(lang === "id" ? "Email berhasil disalin ke clipboard!" : "Email copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast(lang === "id" ? "Gagal menyalin email." : "Failed to copy email.", "error");
    }
  };

  const isId = lang === "id";

  return (
    <div className="py-4 pb-28 max-w-3xl mx-auto">
      {/* Top Back Navigation */}
      <div className="mb-6">
        <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors font-medium bg-surface px-4 py-2 rounded-full border border-border-color shadow-sm">
          <ArrowLeft size={16} />
          {isId ? "Kembali ke Beranda" : "Back to Home"}
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border-color p-8 md:p-10 mb-8 shadow-sm text-center">
        <div className="pattern-washi absolute inset-0 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 mb-4 rounded-3xl overflow-hidden shadow-md border-2 border-border-color bg-card-muted/40 p-1">
            <Image src="/assets/KanjiPahamLogo.png" alt="KanjiPaham Mascot Logo" width={96} height={96} className="w-full h-full object-contain" priority />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Sparkles size={13} />
            <span>{isId ? "Informasi & Pengembang" : "About & Creator Information"}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight mb-3">KanjiPaham</h1>

          <p className="text-text-muted text-sm md:text-base max-w-xl leading-relaxed">
            {isId
              ? "Platform belajar Kanji & Kana Jepang yang dirancang mobile-first, interaktif, dan mudah dipahami dengan visual khas Jepang untuk pembelajar di Indonesia."
              : "A modern, interactive, and friendly Japanese Kanji & Kana learning platform built to help learners master the language with ease and joy."}
          </p>
        </div>
      </div>

      {/* ── FEEDBACK & IMPROVING CALLOUT BANNER ───────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card-muted/40 to-sakura/10 border-2 border-primary/20 p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageSquareHeart size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-text-main mb-2 flex items-center gap-2">
              <span>{isId ? "Kami Terus Berkembang!" : "We Are Still Improving!"}</span>
              <span className="text-base">🚀</span>
            </h2>
            <p className="text-sm text-text-main/90 leading-relaxed font-medium">
              {isId ? (
                <>
                  Kami masih terus mengembangkan dan menyempurnakan <strong>KanjiPaham</strong>. Jika Anda memiliki saran, masukan ide, kritik, ataupun pertanyaan apa pun, silakan hubungi kami melalui saluran berikut:
                </>
              ) : (
                <>
                  We are still continuously improving and polishing <strong>KanjiPaham</strong>. If you have any advice, feedback, feature suggestions, or anything to share, please feel free to contact us at:
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── CONTACT & SOCIAL CHANNELS GRID ───────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2 px-1">
          <span>📬</span> {isId ? "Saluran Kontak & Media Sosial" : "Contact & Social Channels"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/bagasrr17"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl border-2 border-border-color bg-surface hover:border-[#0A66C2] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <LinkedInIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">LinkedIn</p>
                <p className="text-base font-bold text-text-main group-hover:text-[#0A66C2] transition-colors">bagasrr17</p>
                <p className="text-xs text-text-subtle">linkedin.com/in/bagasrr17</p>
              </div>
            </div>
            <ExternalLink size={18} className="text-text-subtle group-hover:text-[#0A66C2] transition-colors flex-shrink-0" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/bagasrr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl border-2 border-border-color bg-surface hover:border-text-main hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-text-main/10 text-text-main flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <GitHubIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">GitHub</p>
                <p className="text-base font-bold text-text-main group-hover:text-primary transition-colors">bagasrr</p>
                <p className="text-xs text-text-subtle">github.com/bagasrr</p>
              </div>
            </div>
            <ExternalLink size={18} className="text-text-subtle group-hover:text-text-main transition-colors flex-shrink-0" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/barra.adhan"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl border-2 border-border-color bg-surface hover:border-[#E1306C] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Instagram</p>
                <p className="text-base font-bold text-text-main group-hover:text-[#E1306C] transition-colors">@barra.adhan</p>
                <p className="text-xs text-text-subtle">instagram.com/barra.adhan</p>
              </div>
            </div>
            <ExternalLink size={18} className="text-text-subtle group-hover:text-[#E1306C] transition-colors flex-shrink-0" />
          </a>

          {/* Email */}
          <div className="flex flex-col justify-between p-5 rounded-2xl border-2 border-border-color bg-surface hover:border-primary hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Email</p>
                  <p className="text-sm md:text-base font-bold text-text-main break-all">{email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border-color/50">
              <a href={`mailto:${email}`} className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors text-center shadow-sm">
                {isId ? "Kirim Pesan" : "Send Email"}
              </a>
              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl border border-border-color bg-surface hover:bg-card-muted text-text-main transition-colors shadow-sm cursor-pointer"
                title={isId ? "Salin alamat email" : "Copy email address"}
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copied ? (isId ? "Tersalin" : "Copied") : isId ? "Salin" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CREATOR PROFILE CARD ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-border-color bg-surface p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-serif text-3xl font-extrabold flex items-center justify-center flex-shrink-0 shadow-md">B</div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-xl font-bold text-text-main">Bagas Ramadhan (bagasrr)</h3>
                <p className="text-xs font-semibold text-primary">Creator & Lead Developer of KanjiPaham</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card-muted border border-border-color text-xs font-medium text-text-muted self-center sm:self-auto">
                <Code2 size={13} />
                <span>Full-Stack Developer</span>
              </span>
            </div>

            <p className="text-sm text-text-muted leading-relaxed mt-2">
              {isId
                ? "KanjiPaham dikembangkan dengan sepenuh hati sebagai proyek independen untuk membantu siapa saja yang ingin belajar Bahasa Jepang—khususnya aksara Kanji dan Kana—dengan metode belajar yang nyaman, visual yang hangat, dan kuis interaktif yang menguji daya ingat secara menyeluruh."
                : "KanjiPaham is passionately built as an independent project to empower anyone learning Japanese—especially Kanji and Kana—with intuitive visuals, JLPT-focused structure, and interactive quizzes that reinforce long-term memory."}
            </p>
          </div>
        </div>
      </div>

      {/* ── APP FEATURES HIGHLIGHT ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border-color bg-card-muted/30 p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 text-primary font-bold text-sm">
          <BookOpen size={16} />
          <span>KanjiPaham v1.0</span>
        </div>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          {isId
            ? "Belajar Kanji N5–N1, stroke order visualizer, kuis pilihan ganda & flashcard, serta dukungan multi-bahasa Indonesia dan Inggris."
            : "Learn JLPT N5–N1 Kanji, stroke order animations, multiple-choice & flashcard quizzes, with full Indonesian and English support."}
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-text-subtle mt-4">
          <span>{isId ? "Dibuat dengan" : "Crafted with"}</span>
          <Heart size={12} className="text-primary fill-primary mx-0.5" />
          <span>{isId ? "untuk pembelajar Jepang di mana pun" : "for Japanese learners worldwide"}</span>
        </div>
      </div>
    </div>
  );
}
