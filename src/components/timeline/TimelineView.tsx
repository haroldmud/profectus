'use client'

import { useState } from 'react'
import { useProgressStore } from '@/store/progress'
import { StatusChip } from '@/components/ui/StatusChip'
import { TopicTypeIcon } from '@/components/ui/TopicTypeIcon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Status } from '@/types'

export function TimelineView() {
  const { modules, setTopicStatus, getModuleProgress } = useProgressStore()
  const [expanded, setExpanded] = useState<string | null>(modules[0]?.id ?? null)

  return (
    <div className="relative">
      {/* vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />

      <div className="space-y-6">
        {modules.map((mod) => {
          const progress = getModuleProgress(mod.id)
          const isOpen = expanded === mod.id

          return (
            <div key={mod.id} className="relative pl-14">
              {/* dot */}
              <button
                onClick={() => setExpanded(isOpen ? null : mod.id)}
                className="absolute left-3.5 top-4 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: progress === 100 ? mod.color : '#0d0d0f',
                  borderColor: mod.color,
                }}
              />

              {/* header */}
              <button
                onClick={() => setExpanded(isOpen ? null : mod.id)}
                className="w-full text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-semibold text-white">{mod.title}</span>
                    <span className="text-white/40 text-sm ml-2">{mod.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/30">{progress}%</span>
                    <span className="text-white/30 text-xs group-hover:text-white/60 transition-colors">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                <ProgressBar value={progress} color={mod.color} height="h-1" />
              </button>

              {/* topics */}
              {isOpen && (
                <div className="mt-4 space-y-2">
                  {mod.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3 gap-4"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <TopicTypeIcon type={topic.type} />
                        <span className="text-sm text-white/80 truncate">{topic.title}</span>
                      </div>
                      <StatusChip
                        status={topic.status}
                        onClick={(next: Status) => setTopicStatus(mod.id, topic.id, next)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
