'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Module, Status } from '@/types'
import { CURRICULUM } from '@/data/curriculum'

interface ProgressStore {
  modules: Module[]
  setTopicStatus: (moduleId: string, topicId: string, status: Status) => void
  setTopicNotes: (moduleId: string, topicId: string, notes: string) => void
  getModuleProgress: (moduleId: string) => number
  getGlobalProgress: () => number
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      modules: CURRICULUM,

      setTopicStatus: (moduleId, topicId, status) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id !== moduleId
              ? m
              : {
                  ...m,
                  topics: m.topics.map((t) =>
                    t.id !== topicId ? t : { ...t, status }
                  ),
                }
          ),
        })),

      setTopicNotes: (moduleId, topicId, notes) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id !== moduleId
              ? m
              : {
                  ...m,
                  topics: m.topics.map((t) =>
                    t.id !== topicId ? t : { ...t, notes }
                  ),
                }
          ),
        })),

      getModuleProgress: (moduleId) => {
        const mod = get().modules.find((m) => m.id === moduleId)
        if (!mod || mod.topics.length === 0) return 0
        const done = mod.topics.filter((t) => t.status === 'done').length
        return Math.round((done / mod.topics.length) * 100)
      },

      getGlobalProgress: () => {
        const all = get().modules.flatMap((m) => m.topics)
        if (all.length === 0) return 0
        const done = all.filter((t) => t.status === 'done').length
        return Math.round((done / all.length) * 100)
      },
    }),
    { name: 'profectus-progress' }
  )
)
