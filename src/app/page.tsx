'use client'

import { useProgressStore } from '@/store/progress'
import { ModuleCard } from '@/components/overview/ModuleCard'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function OverviewPage() {
  const { modules, getGlobalProgress } = useProgressStore()
  const global = getGlobalProgress()
  const totalTopics = modules.flatMap((m) => m.topics).length
  const doneTopics = modules.flatMap((m) => m.topics).filter((t) => t.status === 'done').length

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-1">Your XR Journey</h1>
        <p className="text-white/40 mb-6">
          {doneTopics} of {totalTopics} topics complete across {modules.length} modules
        </p>
        <div className="max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Overall progress</span>
            <span className="text-sm font-mono text-white">{global}%</span>
          </div>
          <ProgressBar value={global} color="#a855f7" height="h-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <ModuleCard key={mod.id} module={mod} />
        ))}
      </div>
    </div>
  )
}
