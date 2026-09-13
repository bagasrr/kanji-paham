# 🇯🇵 KanjiPaham (漢字パハム)

> **Platform Belajar Kanji & Kana Jepang yang Terstruktur, Menyenangkan, dan Berfokus pada Pembelajar.**  
> *A modern, interactive, and friendly Japanese Kanji & Kana learning platform with a warm Japanese stationery aesthetic.*

---

## 📑 Daftar Isi / Table of Contents

1. [Tentang Proyek (About the Project)](#-tentang-proyek-about-the-project)
2. [Fitur Utama (Key Features)](#-fitur-utama-key-features)
3. [Alur Aplikasi (How the Flow Works)](#-alur-aplikasi-how-the-flow-works)
4. [Dokumentasi API (How the API Works)](#-dokumentasi-api-how-the-api-works)
5. [Model & Skema Database (Database Schema)](#-model--skema-database-database-schema)
6. [Tech Stack & Arsitektur](#-tech-stack--arsitektur)
7. [Struktur Direktori (Project Structure)](#-struktur-direktori-project-structure)
8. [Panduan Instalasi & Menjalankan Aplikasi](#-panduan-instalasi--menjalankan-aplikasi)
9. [Informasi Pengembang & Kontak](#-informasi-pengembang--kontak)

---

## 🌸 Tentang Proyek (About the Project)

**KanjiPaham** adalah aplikasi web modern berbasis *mobile-first* yang dikembangkan untuk membantu siapa saja—terutama pembelajar di Indonesia—menguasai aksara **Kana (Hiragana & Katakana)** dan **Kanji Jepang (JLPT N5 hingga N1)** secara bertahap dan terstruktur.

Aplikasi ini didesain dengan filosofi **Japanese stationery aesthetic** yang hangat, nyaman di mata, dan berakar pada elemen kertas *washi*. KanjiPaham menghilangkan kesan aplikasi kamus/hafalan yang kaku dan menggantinya dengan pengalaman interaktif: visualisasi urutan goresan (*stroke order*), pelafalan suara audio native, furigana yang dapat diatur, kuis adaptif, dan pencatatan kanji yang sering salah (*Weak Kanji*).

---

## ✨ Fitur Utama (Key Features)

### 1. Pembelajaran Kana Interaktif (`/kana`)
- Tabel lengkap **Hiragana** dan **Katakana** (Gojuon, Dakuon, Handakuon, Yoon).
- Mode kartu belajar dengan romaji dan audio pelafalan.

### 2. Kurikulum Kanji Berjenjang (`/learn`)
- Tingkatan level resmi **JLPT N5, N4, N3, N2, dan N1**.
- Dibagi ke dalam unit kecil yang terkelola (**Sub-level**, masing-masing 10 Kanji) agar tidak membebani memori jangka pendek (*cognitive load*).

### 3. Kartu Kanji Komprehensif (`KanjiCard`)
- **Hero Kanji:** Karakter kanji besar dengan tipografi Mincho tradisional yang elegan.
- **Stroke Order Animation:** Visualisasi goresan SVG animasi berbasis data resmi KanjiVG.
- **On'yomi & Kun'yomi:** Pemisahan bacaan dengan kode warna kontras tinggi.
- **Arti & Makna:** Terjemahan Bahasa Indonesia dan Bahasa Inggris.
- **Contoh Kosakata & Kalimat:** Dilengkapi tag `<ruby>` dan `<rt>` (furigana) yang dapat diaktifkan/dinonaktifkan (*Furigana toggle*).
- **Pengucapan Audio:** Terintegrasi langsung dengan Web Speech API Jepang (`ja-JP`).

### 4. Sistem Kuis Ganda & Persiapan JLPT (`/quiz` & `/learn/[level]/[subLevel]/quiz`)
- **Mode Flashcard Match:** Pengulangan cepat untuk mengingat arti dan bacaan.
- **Mode Multiple Choice (Pilihan Ganda):** Menantang pemahaman makna, bacaan On'yomi, dan Kun'yomi dengan 4 pilihan acak.
- **Simulasi Ujian JLPT:** Latihan simulasi tingkat kesulitan N5–N1 dengan bank soal terkurasi.
- **Feedback Langsung:** Indikator visual hijau/merah, persentase nilai, dan opsi pengulangan.

### 5. Pelacak Kelemahan Cerdas (*Weak Kanji Tracker*)
- Sistem secara otomatis mencatat karakter kanji yang salah dijawab selama kuis ke tabel database `WeakKanji`.
- Muncul di halaman Profil pengguna sebagai daftar fokus belajar yang perlu diulang.

### 6. Autentikasi & Multi-Role User
- Pendaftaran akun dengan Email/Password (Bcrypt hashing) dan **Google OAuth**.
- Peran Pengguna:
  - **GAKUSEI (Siswa):** Belajar, kuis, simpan progres, dan ajukan sertifikasi pengajar.
  - **SENSEI (Guru/Pengajar):** Akses pembuatan bank soal kuis (`/dashboard/questions`).
  - **ADMIN:** Manajemen sistem, persetujuan sertifikat Sensei, dan manajemen bank soal.

### 7. Dual Theme & Dual Language (i18n)
- **Tema:** Mode Terang (*Warm Japanese Paper*) dan Mode Gelap (*Washi Night*).
- **Bahasa:** Pengalihan instan antara Bahasa Indonesia (`id`) dan Bahasa Inggris (`en`).

### 8. Halaman Informasi & Kontak Pembuat (`/info`)
- Menampilkan profil pengembang (Bagas Ramadhan), saluran feedback, serta tautan ke LinkedIn, GitHub, Instagram, dan Email dengan fitur satu-klik salin.

---

## 🔄 Alur Aplikasi (How the Flow Works)

### 1. Alur Belajar Pengguna (User Learning Flow)
```
[Pengguna Masuk / Beranda]
         │
         ├───► Pilih Belajar Kana ──► Buka Tabel Hiragana / Katakana ──► Dengar Audio & Latihan
         │
         └───► Pilih Level JLPT (N5 - N1)
                     │
                     ▼
             Pilih Sub-level (10 Kanji)
                     │
                     ├───► Buka Detail Kanji
                     │       ├─ Amati Goresan (Stroke SVG)
                     │       ├─ Baca On'yomi & Kun'yomi
                     │       ├─ Pelajari Kosakata & Contoh Kalimat
                     │       └─ Dengar Audio Native (Web Speech)
                     │
                     └───► Mulai Kuis Sub-level
                             ├─ Mode Flashcard ATAU Mode Pilihan Ganda (MCQ)
                             ├─ Jawab Soal & Dapatkan Umpan Balik Instan
                             └─ Selesai:
                                  ├─ Skor dicatat ke `QuizResult`
                                  ├─ Progres kanji disimpan ke `UserProgress`
                                  └─ Kesalahan dicatat ke `WeakKanji`
```

### 2. Alur Pelacak Kelemahan (Weak Kanji System)
1. Ketika pengguna memilih jawaban salah pada kuis, aplikasi mengirimkan request ke `POST /api/user/quiz-result`.
2. Endpoint mengidentifikasi karakter kanji yang dijawab salah dan melakukan `upsert` pada tabel `WeakKanji`:
   - Jika sudah ada: `mistakeCount` bertambah +1 dan `lastMistake` diperbarui.
   - Jika belum ada: catatan baru dibuat dengan `mistakeCount = 1`.
3. Pada halaman `/profile`, pengguna dapat melihat 10 kanji yang paling sering salah untuk dipelajari kembali.

### 3. Alur Pengajuan & Verifikasi Sensei (Teacher Application Flow)
1. Pengguna berstatus `GAKUSEI` membuka halaman `/profile/apply-sensei`.
2. Mengisi formulir dan mengunggah tautan sertifikat JLPT (minimal N3).
3. Data tersimpan di `TeacherApplication` dengan status `PENDING`.
4. `ADMIN` meninjau pengajuan melalui dashboard dan menyetujui (`APPROVED`).
5. Role pengguna otomatis berubah menjadi `SENSEI`, membuka menu dashboard pembuatan soal kuis.

---

## 🔌 Dokumentasi API (How the API Works)

Semua endpoint API beralamat di `/api/*` dan mengembalikan respons dalam format JSON standar.

### 1. Modul Kanji

#### `GET /api/kanji`
Mengambil data kanji berdasarkan tingkat level JLPT atau karakter tertentu.

- **Query Parameters:**
  - `level` *(opsional, number)*: Level JLPT (1 - 5).
  - `subLevel` *(opsional, number)*: Nomor sub-level (misal: `1`).
  - `character` *(opsional, string)*: Karakter kanji spesifik (misal: `日`).
- **Response (200 OK):**
```json
{
  "kanji": [
    {
      "character": "日",
      "strokes": 4,
      "grade": 1,
      "jlpt": 5,
      "subLevel": 1,
      "meanings": ["day", "sun", "Japan"],
      "meanings_id": ["hari", "matahari", "Jepang"],
      "readings_on": ["ニチ", "ジツ"],
      "readings_kun": ["ひ", "-び", "-か"],
      "svgFile": "065e5.svg",
      "vocab": [
        {
          "word": "日曜日",
          "reading": "にちようび",
          "meanings_id": ["Hari Minggu"]
        }
      ]
    }
  ]
}
```

---

### 2. Modul Autentikasi (`/api/auth/*`)

#### `POST /api/auth/register`
Mendaftarkan pengguna baru dengan email dan password.
- **Body:**
```json
{
  "name": "Bagas Ramadhan",
  "email": "user@example.com",
  "password": "Password123"
}
```
- **Validasi:** Password minimal 8 karakter, harus memuat minimal 1 huruf besar dan 1 angka.
- **Response (201 Created):**
```json
{
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "name": "Bagas Ramadhan"
  }
}
```

#### `POST /api/auth/set-password`
Menetapkan password untuk akun yang login via OAuth atau lupa password.
- **Headers:** Memerlukan sesi login yang valid (`session cookie`).
- **Body:** `{ "password": "NewPassword123" }`

---

### 3. Modul Pengguna & Progres (`/api/user/*`)

#### `GET /api/user/progress`
Mengambil daftar karakter kanji yang telah dikuasai pengguna yang sedang login.
- **Response (200 OK):**
```json
{
  "progress": [
    {
      "character": "一",
      "jlptLevel": 5,
      "subLevel": 1,
      "completedAt": "2026-09-13T10:00:00.000Z"
    }
  ]
}
```

#### `POST /api/user/progress`
Menandai karakter kanji sebagai telah selesai dipelajari.
- **Body:**
```json
{
  "character": "一",
  "jlptLevel": 5,
  "subLevel": 1
}
```

#### `POST /api/user/quiz-result`
Menyimpan riwayat skor kuis serta merekam kanji yang salah (*mistakes*).
- **Body:**
```json
{
  "level": 5,
  "subLevel": 1,
  "mode": "mcq",
  "score": 8,
  "total": 10,
  "mistakes": ["本", "水"]
}
```
- **Proses:**
  - Menyimpan rekor ke tabel `QuizResult`.
  - Jika array `mistakes` disertakan, memperbarui frekuensi kesalahan pada tabel `WeakKanji`.

#### `POST /api/user/apply-sensei`
Mengajukan permohonan menjadi Sensei.
- **Body:**
```json
{
  "certificateUrl": "https://example.com/jlpt-n3-cert.pdf",
  "idCardUrl": "https://example.com/ktp.jpg"
}
```

---

### 4. Modul Kuis & Bank Soal (`/api/quiz/*` & `/api/admin/questions/*`)

#### `GET /api/quiz/jlpt`
Mengambil kumpulan soal simulasi JLPT untuk level tertentu.
- **Query Parameters:** `level=5`
- **Response (200 OK):**
```json
{
  "questions": [
    {
      "id": "q1",
      "kanji": "木",
      "prompt": "Pilih arti yang tepat untuk kanji '木':",
      "options": ["Pohon", "Air", "Buku", "Uang"],
      "correctIndex": 0,
      "type": "meaning"
    }
  ]
}
```

#### `GET / POST /api/admin/questions/bank`
Mengelola bank soal kuis kustom (khusus role `SENSEI` atau `ADMIN`).

#### `GET / PUT / DELETE /api/admin/questions/bank/[id]`
Mengambil, memperbarui, atau menghapus bank soal kustom beserta seluruh butir soalnya.

#### `POST /api/admin/questions/parse`
Memproses teks mentah atau dokumen kuis menjadi format bank soal terstruktur secara otomatis.

---

## 🗄️ Model & Skema Database (Database Schema)

Dikelola menggunakan **Prisma ORM** dengan database **PostgreSQL**:

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : has
    USER ||--o{ SESSION : has
    USER ||--o{ USER_PROGRESS : tracks
    USER ||--o{ QUIZ_RESULT : records
    USER ||--o{ WEAK_KANJI : struggles_with
    USER ||--o| TEACHER_APPLICATION : submits
    
    KANJI ||--o{ VOCAB : contains
    KANJI ||--o{ WEAK_KANJI : flagged_in
    
    CUSTOM_QUESTION_BANK ||--o{ CUSTOM_QUESTION : holds
```

### Ringkasan Entitas Utama:
- **`User`**: Menyimpan identitas, email, password terenkripsi, avatar, dan hak akses (`Role: GAKUSEI | SENSEI | ADMIN`).
- **`Kanji`**: Katalog kanji lengkap (karakter, jumlah goresan, level JLPT, sublevel, arti ID & EN, on'yomi, kun'yomi, dan nama file SVG goresan).
- **`Vocab`**: Contoh kosakata yang berelasi dengan masing-masing karakter kanji.
- **`UserProgress`**: Menyimpan data kanji mana saja yang sudah diselesaikan oleh pengguna.
- **`QuizResult`**: Riwayat pelaksanaan kuis, skor perolehan, tanggal pengerjaan, dan mode kuis.
- **`WeakKanji`**: Indeks cerdas penghitung kesalahan per kanji untuk tiap pengguna.
- **`TeacherApplication`**: Manajemen pengajuan sertifikasi pengajar JLPT.
- **`CustomQuestionBank` & `CustomQuestion`**: Bank soal fleksibel yang dibuat oleh Sensei/Admin.

---

## 🛠️ Tech Stack & Arsitektur

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Rendering hybrid (SSG, SSR, API Route Handlers), Turbopack |
| **UI Library** | [React 19](https://react.dev/) | React Server Components & Client Components |
| **Bahasa** | [TypeScript 5](https://www.typescriptlang.org/) | *End-to-end type safety* |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Theme tokens (`bg-surface`, `text-primary`, dark mode support) |
| **Database & ORM** | PostgreSQL & [Prisma](https://www.prisma.io/) | Skema relasional, migrasi otomatis, dan type-safe client |
| **Autentikasi** | [NextAuth.js v5 Beta](https://authjs.dev/) | Sesi berbasis JWT, Credentials Provider, Google OAuth |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Ikon antarmuka modern yang konsisten |
| **Aset Visual** | [KanjiVG](https://kanjivg.tagaini.net/) | Format SVG goresan karakter kanji standar |
| **Audio** | Web Speech API (`ja-JP`) | Sintesis suara native peramban tanpa latensi server |

---

## 📁 Struktur Direktori (Project Structure)

```text
├── prisma/
│   └── schema.prisma              # Definisi skema database Prisma
├── public/
│   ├── assets/
│   │   └── KanjiPahamLogo.png     # Logo & Maskot resmi KanjiPaham
│   └── svg/
│       └── kanji/                 # Aset stroke order SVG (KanjiVG)
├── scripts/
│   ├── seed-kanji.ts              # Script populate data kanji ke database
│   └── download-svg.ts            # Script unduh SVG goresan dari repositori KanjiVG
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # Endpoint REST API (kanji, auth, user, admin)
│   │   ├── auth/                  # Halaman Login, Register, Set Password, Error
│   │   ├── dashboard/             # Dashboard manajemen soal untuk Sensei & Admin
│   │   ├── info/                  # Halaman Informasi Web & Kontak Pengembang
│   │   ├── kana/                  # Pembelajaran Hiragana & Katakana
│   │   ├── learn/                 # Kurikulum belajar Kanji N5–N1 & Kuis Sub-level
│   │   ├── profile/               # Profil pengguna, riwayat progres, Weak Kanji
│   │   ├── quiz/                  # Halaman simulasi kuis persiapan JLPT
│   │   ├── globals.css            # Desain token CSS & konfigurasi tema Washi
│   │   └── layout.tsx             # Root layout dengan Theme, Language, & Toast
│   ├── components/                # Komponen antarmuka reusable
│   │   ├── BottomNav.tsx          # Navigasi bawah (mobile) & sidebar (desktop)
│   │   ├── KanjiCard.tsx          # Komponen kartu kanji interaktif utama
│   │   ├── LanguageProvider.tsx   # Provider konteks bahasa (ID/EN)
│   │   ├── ThemeProvider.tsx      # Provider tema gelap/terang
│   │   └── Toast.tsx              # Komponen notifikasi toast
│   ├── data/                      # Dataset JSON lokal kanji (N5 - N1)
│   ├── hooks/                     # Custom React hooks (speech synthesis, dll.)
│   ├── lib/                       # Konfigurasi Prisma, Auth, helper kanji & kuis
│   └── proxy.ts                   # Next.js route proxy / route guarding
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js**: Versi 20.x atau lebih baru.
- **NPM** atau package manager kompatibel lainnya.
- **PostgreSQL**: Instance lokal atau cloud database (misal: Supabase, Neon, Docker).

### 2. Kloning & Pengaturan Environment
Salin berkas konfigurasi lingkungan:
```bash
cp .env.example .env
```
Sesuaikan variabel di dalam `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kanjipaham?schema=public"
AUTH_SECRET="buat_random_secret_string_disini"
NEXTAUTH_URL="http://localhost:3000"

# Opsional jika menggunakan Google Login:
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Setup Database & Seeding Kanji
Jalankan migrasi Prisma dan lakukan seeding data awal kanji:
```bash
# Generate client Prisma
npx prisma generate

# Sinkronisasi schema ke database
npx prisma db push

# Seeding data kanji N5 (atau gunakan npm run seed:kanji untuk semua level)
npm run seed:n5

# Unduh berkas goresan SVG Kanji N5
npm run svg:n5
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

### 6. Build untuk Produksi
```bash
npm run build
npm start
```

---

## 👨‍💻 Informasi Pengembang & Kontak

Aplikasi **KanjiPaham** dirancang dan dikembangkan dengan dedikasi penuh oleh **Bagas Ramadhan**.

> *"Kami masih terus mengembangkan dan menyempurnakan KanjiPaham. Jika Anda memiliki saran, masukan ide, kritik, ataupun pertanyaan apa pun, jangan ragu untuk menghubungi kami!"*

- **LinkedIn:** [linkedin.com/in/bagasrr17](https://linkedin.com/in/bagasrr17)
- **GitHub:** [github.com/bagasrr](https://github.com/bagasrr)
- **Instagram:** [@barra.adhan17](https://instagram.com/barra.adhan17)
- **Email Bisnis & Kolaborasi:** [business.bagasrr@gmail.com](mailto:business.bagasrr@gmail.com)

---

## 📄 Lisensi & Hak Cipta

- Proyek ini dilisensikan di bawah lisensi terbuka untuk tujuan edukasi.
- Data urutan goresan kanji bersumber dari proyek sumber terbuka [KanjiVG](https://kanjivg.tagaini.net/) di bawah lisensi Creative Commons Attribution-Share Alike 3.0.
- &copy; 2026 **KanjiPaham** · Dibuat dengan cinta untuk para pembelajar Bahasa Jepang.
