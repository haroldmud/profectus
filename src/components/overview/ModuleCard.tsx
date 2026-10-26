'use client'

import Link from 'next/link'
import { Module } from '@/types'
import { useProgressStore } from '@/store/progress'
import { ProgressBar } from '@/components/ui/ProgressBar'

const TYPE_COUNTS = (topics: Module['topics']) => {
  const counts = { lesson: 0, exercise: 0, project: 0, group_project: 0 }
  topics.forEach((t) => counts[t.type]++)
  return counts
}

export function ModuleCard({ module }: { module: Module }) {
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress)
  const progress = getModuleProgress(module.id)
  const counts = TYPE_COUNTS(module.topics)
  const done = module.topics.filter((t) => t.status === 'done').length

  return (
    <Link
      href={`/module/${module.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div
            className="w-2.5 h-2.5 rounded-full mb-3"
            style={{ backgroundColor: module.color }}
          />
          <h3 className="font-semibold text-white text-base">{module.title}</h3>
          <p className="text-white/40 text-xs mt-0.5">{module.subtitle}</p>
        </div>
        <span className="text-white/30 text-sm font-mono">{String(module.order).padStart(2, '0')}</span>
      </div>

      <div className="mb-3">
        <ProgressBar value={progress} color={module.color} height="h-1.5" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs text-white/30">
          {counts.lesson > 0 && <span>{counts.lesson} lessons</span>}
          {counts.exercise > 0 && <span>{counts.exercise} exercises</span>}
          {(counts.project + counts.group_project) > 0 && (
            <span>{counts.project + counts.group_project} projects</span>
          )}
        </div>
        <span className="text-xs text-white/30">{done}/{module.topics.length}</span>
      </div>
    </Link>
  )
}
