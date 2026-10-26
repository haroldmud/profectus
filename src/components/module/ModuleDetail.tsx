'use client'

import { useProgressStore } from '@/store/progress'
import { StatusChip } from '@/components/ui/StatusChip'
import { TopicIcon } from '@/components/ui/TopicIcon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Status } from '@/types'
import Link from 'next/link'

export function ModuleDetail({ moduleId }: { moduleId: string }) {
  const { modules, setTopicStatus, getModuleProgress } = useProgressStore()
  const mod = modules.find((m) => m.id === moduleId)

  if (!mod) return <p className="text-white/40">Module not found.</p>

  const progress = getModuleProgress(mod.id)
  const done = mod.topics.filter((t) => t.status === 'done').length

  return (
    <div>
      <div className="mb-8">
        <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors mb-4 inline-block">
          ← Back to Overview
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mod.color }} />
          <h1 className="text-2xl font-bold text-white">{mod.title}</h1>
        </div>
        <p className="text-white/40 mb-4">{mod.subtitle}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <ProgressBar value={progress} color={mod.color} height="h-2" showLabel />
          </div>
          <span className="text-sm text-white/30">{done} of {mod.topics.length} complete</span>
        </div>
      </div>

      <div className="space-y-2">
        {mod.topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-5 py-4 gap-4 hover:border-white/15 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <TopicIcon title={topic.title} color={mod.color} />
              <span className="text-sm text-white/80">{topic.title}</span>
            </div>
            <StatusChip
              status={topic.status}
              onClick={(next: Status) => setTopicStatus(mod.id, topic.id, next)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
