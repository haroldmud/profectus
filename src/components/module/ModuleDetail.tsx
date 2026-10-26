'use client'

import { useState } from 'react'
import { useProgressStore } from '@/store/progress'
import { StatusChip } from '@/components/ui/StatusChip'
import { TopicIcon } from '@/components/ui/TopicIcon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Status } from '@/types'
import Link from 'next/link'

export function ModuleDetail({ moduleId }: { moduleId: string }) {
  const { modules, setTopicStatus, setTopicNotes, getModuleProgress } = useProgressStore()
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editingNotes, setEditingNotes] = useState<Set<string>>(new Set())
  const mod = modules.find((m) => m.id === moduleId)

  if (!mod) return <p className="text-white/40">Module not found.</p>

  const progress = getModuleProgress(mod.id)
  const done = mod.topics.filter((t) => t.status === 'done').length

  function toggleNotes(topicId: string) {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
        // also close edit mode when collapsing
        setEditingNotes((e) => { const en = new Set(e); en.delete(topicId); return en })
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  function startEditing(topicId: string) {
    setEditingNotes((prev) => new Set(prev).add(topicId))
  }

  function stopEditing(topicId: string) {
    setEditingNotes((prev) => { const next = new Set(prev); next.delete(topicId); return next })
  }

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
        {mod.topics.map((topic) => {
          const notesOpen = expandedNotes.has(topic.id)
          const isEditing = editingNotes.has(topic.id)
          const hasNotes = !!topic.notes?.trim()

          return (
            <div
              key={topic.id}
              className="rounded-xl border border-white/8 bg-white/5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <TopicIcon title={topic.title} color={mod.color} />
                  <span className="text-sm text-white/80">{topic.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleNotes(topic.id)}
                    className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                    aria-label="Toggle notes"
                  >
                    {notesOpen ? '▲' : '▼'}
                    <span>notes</span>
                    {!notesOpen && hasNotes && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    )}
                  </button>
                  <StatusChip
                    status={topic.status}
                    onClick={(next: Status) => setTopicStatus(mod.id, topic.id, next)}
                  />
                </div>
              </div>

              {notesOpen && (
                <div className="px-5 pb-4 border-t border-white/5 pt-3">
                  {isEditing || !hasNotes ? (
                    <div className="space-y-2">
                      <textarea
                        autoFocus
                        value={topic.notes ?? ''}
                        onChange={(e) => setTopicNotes(mod.id, topic.id, e.target.value)}
                        placeholder="Add notes for this topic…"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 placeholder-white/20 resize-none focus:outline-none focus:border-white/25 transition-colors"
                      />
                      {hasNotes && (
                        <button
                          onClick={() => stopEditing(topic.id)}
                          className="text-xs text-white/30 hover:text-white/60 transition-colors"
                        >
                          Done editing
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="group relative">
                      <p className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed pr-12">
                        {topic.notes}
                      </p>
                      <button
                        onClick={() => startEditing(topic.id)}
                        className="absolute top-0 right-0 text-xs text-white/20 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded hover:bg-white/5"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
