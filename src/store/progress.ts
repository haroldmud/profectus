'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Module, Status } from '@/types'
import { CURRICULUM } from '@/data/curriculum'

interface ProgressStore {
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void
  modules: Module[]
  setTopicStatus: (moduleId: string, topicId: string, status: Status) => void
  setTopicNotes: (moduleId: string, topicId: string, notes: string) => void
  getModuleProgress: (moduleId: string) => number
  getGlobalProgress: () => number
  mergeNewTopics: () => void
}

function mergeCurriculumIntoStored(stored: Module[], curriculum: Module[]): Module[] {
  const result: Module[] = [...stored]
  const storedMap = new Map(stored.map((m) => [m.id, m]))

  for (const currModule of curriculum) {
    const storedModule = storedMap.get(currModule.id)
    if (!storedModule) {
      result.push(currModule)
    } else {
      const storedTopicIds = new Set(storedModule.topics.map((t) => t.id))
      const newTopics = currModule.topics.filter((t) => !storedTopicIds.has(t.id))
      if (newTopics.length > 0) {
        const idx = result.findIndex((m) => m.id === currModule.id)
        result[idx] = { ...storedModule, topics: [...storedModule.topics, ...newTopics] }
      }
    }
  }

  return result
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      modules: CURRICULUM,

      setTopicStatus: (moduleId, topicId, status) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id !== moduleId
              ? m
              : {
                  ...m,
                  topics: m.topics.map((t) => {
                    if (t.id !== topicId) return t
                    const now = new Date().toISOString()
                    return {
                      ...t,
                      status,
                      startedAt: t.startedAt ?? (status !== 'not_started' ? now : undefined),
                      completedAt: status === 'done' ? now : undefined,
                    }
                  }),
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

      mergeNewTopics: () =>
        set((state) => ({
          modules: mergeCurriculumIntoStored(state.modules, CURRICULUM),
        })),
    }),
    {
      name: 'profectus-progress',
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.mergeNewTopics()
        state?.setHasHydrated(true)
      },
    }
  )
)
