'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-slate-700 p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <AlertCircle className="w-8 h-8 text-[#DC2626]" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-3">
        Otentikasi Gagal
      </h2>
      
      <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm">
        {errorMessage}
      </p>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-red-700 transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Login
      </Link>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#0F172A] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#1F2937] dark:text-[#F8FAFC] mb-6">
          🇯🇵 KanjiPaham
        </h1>
        <Suspense fallback={<div className="text-center p-8">Memuat...</div>}>
          <AuthErrorContent />
        </Suspense>
      </div>
    </main>
  )
}
