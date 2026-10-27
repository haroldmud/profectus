'use client'

import { useState } from 'react'
import { useProgressStore } from '@/store/progress'
import { StatusChip } from '@/components/ui/StatusChip'
import { TopicIcon } from '@/components/ui/TopicIcon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Status } from '@/types'

export function TimelineView() {
  const { modules, setTopicStatus, setTopicNotes, getModuleProgress } = useProgressStore()
  const [expanded, setExpanded] = useState<string | null>(modules[0]?.id ?? null)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editingNotes, setEditingNotes] = useState<Set<string>>(new Set())

  function toggleNotes(topicId: string) {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
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
                  {mod.topics.map((topic) => {
                    const notesOpen = expandedNotes.has(topic.id)
                    const isEditing = editingNotes.has(topic.id)
                    const hasNotes = !!topic.notes?.trim()

                    return (
                      <div
                        key={topic.id}
                        className="group/topic rounded-xl border border-white/8 bg-white/5 hover:border-white/15 transition-colors"
                      >
                        <div className="flex items-center justify-between px-4 py-3 gap-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <TopicIcon title={topic.title} color={mod.color} />
                            <span className="text-sm text-white/80 truncate">{topic.title}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => toggleNotes(topic.id)}
                              className={`flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-md hover:bg-white/5 ${notesOpen ? 'opacity-100' : 'opacity-0 group-hover/topic:opacity-100'}`}
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
                          <div className="px-4 pb-4 border-t border-white/5 pt-3">
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
