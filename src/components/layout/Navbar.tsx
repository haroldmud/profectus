'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProgressStore } from '@/store/progress'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Suspense } from 'react'
import { Brain } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/analytics', label: 'Analytics' },
]

function NavLinks() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            pathname === href
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

export function Navbar() {
  const modules = useProgressStore((s) => s.modules)
  const all = modules.flatMap((m) => m.topics)
  const progress = all.length === 0 ? 0 : Math.round(all.filter((t) => t.status === 'done').length / all.length * 100)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0d0f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <span className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
            <Brain size={18} className="text-purple-400" />
            Profectus
          </span>
          <Suspense fallback={<nav className="flex gap-1 h-8" />}>
            <NavLinks />
          </Suspense>
        </div>
        <div className="flex items-center gap-3 min-w-[180px]">
          <span className="text-white/40 text-xs whitespace-nowrap">{progress}%</span>
          <ProgressBar value={progress} color="#a855f7" height="h-1.5" />
        </div>
      </div>
    </header>
  )
}
