export const N5_CATEGORIES = [
  { id: 1, title: 'Angka & Bilangan' },
  { id: 2, title: 'Waktu & Hari' },
  { id: 3, title: 'Orang & Keluarga' },
  { id: 4, title: 'Arah & Posisi' },
  { id: 5, title: 'Alam & Ruang' },
  { id: 6, title: 'Kata Sifat Dasar' },
  { id: 7, title: 'Kata Kerja 1' },
  { id: 8, title: 'Kata Kerja 2 & Lainnya' },
  { id: 9, title: 'Lainnya' }
]

export function getSubLevelTitle(level: number, subLevel: number): string {
  if (level === 5) {
    const category = N5_CATEGORIES.find(c => c.id === subLevel)
    if (category) return category.title
  }
  return `Bagian ${subLevel}`
}
