export type Status = 'not_started' | 'in_progress' | 'done'

export type TopicType = 'lesson' | 'exercise' | 'project' | 'group_project'

export interface Topic {
  id: string
  title: string
  type: TopicType
  status: Status
  notes?: string
  startedAt?: string
  completedAt?: string
}

export interface Module {
  id: string
  title: string
  subtitle?: string
  color: string
  order: number
  topics: Topic[]
}

export interface ProgressState {
  modules: Module[]
  setTopicStatus: (moduleId: string, topicId: string, status: Status) => void
  setTopicNotes: (moduleId: string, topicId: string, notes: string) => void
}
