'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'Terjadi kesalahan yang tidak terduga saat autentikasi.'

  if (error === 'Configuration') {
    errorMessage = 'Terdapat masalah pada konfigurasi server autentikasi (Google Client ID/Secret belum disetting ATAU Database PostgreSQL sedang mati / tidak dapat diakses).'
  } else if (error === 'AccessDenied') {
    errorMessage = 'Akses ditolak. Anda tidak memiliki izin untuk masuk.'
  } else if (error === 'Verification') {
    errorMessage = 'Token verifikasi telah kedaluwarsa atau sudah digunakan.'
  } else if (error === 'OAuthSignin' || error === 'OAuthCallback' || error === 'OAuthCreateAccount' || error === 'EmailCreateAccount' || error === 'Callback' || error === 'OAuthAccountNotLinked' || error === 'EmailSignin' || error === 'CredentialsSignin') {
    errorMessage = `Gagal masuk (${error}). Silakan coba lagi.`
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border-color p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-error/15 rounded-full">
          <AlertCircle className="w-8 h-8 text-error" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-text-main mb-3">
        Otentikasi Gagal
      </h2>
      
      <p className="text-text-muted mb-8 text-sm">
        {errorMessage}
      </p>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Login
      </Link>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/KanjiPahamLogo.png"
            alt="KanjiPaham Logo"
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl object-contain mb-2 shadow-sm"
            priority
          />
          <h1 className="text-2xl font-bold text-center text-text-main">
            KanjiPaham
          </h1>
        </div>
        <Suspense fallback={<div className="text-center p-8">Memuat...</div>}>
          <AuthErrorContent />
        </Suspense>
      </div>
    </main>
  )
}
