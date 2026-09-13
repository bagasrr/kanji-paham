import fs from 'fs'
import path from 'path'

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true })
  const files = dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  })
  return Array.prototype.concat(...files).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
}

const files = getFiles('src')

const replacements = [
  // Backgrounds
  { from: /bg-\[#FAF9F6\] dark:bg-\[#0F172A\]/g, to: 'bg-background' },
  { from: /bg-white dark:bg-\[#1E293B\]/g, to: 'bg-surface' },
  { from: /bg-white dark:bg-slate-800/g, to: 'bg-surface' },
  { from: /bg-slate-50 dark:bg-slate-800\/30/g, to: 'bg-surface/50' },
  
  // Primary elements
  { from: /bg-\[#DC2626\] dark:bg-\[#F87171\]/g, to: 'bg-primary' },
  { from: /bg-\[#DC2626\]/g, to: 'bg-primary' },
  { from: /text-\[#DC2626\] dark:text-\[#F87171\]/g, to: 'text-primary' },
  { from: /text-\[#DC2626\]/g, to: 'text-primary' },
  { from: /border-\[#DC2626\] dark:border-\[#F87171\]/g, to: 'border-primary' },
  { from: /hover:border-\[#DC2626\] dark:hover:border-\[#F87171\]/g, to: 'hover:border-primary' },
  
  // Text
  { from: /text-\[#1F2937\] dark:text-\[#F8FAFC\]/g, to: 'text-text-main' },
  { from: /text-slate-500/g, to: 'text-text-muted' },
  { from: /text-slate-400/g, to: 'text-text-muted\/80' },
  
  // Borders
  { from: /border-\[#E5E7EB\] dark:border-slate-700/g, to: 'border-border-color' },
  { from: /border-\[#E5E7EB\] dark:border-slate-600/g, to: 'border-border-color' }
]

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8')
  let original = content
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to)
  })
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8')
    console.log(`Updated ${file}`)
  }
})
