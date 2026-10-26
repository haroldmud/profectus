import { TopicType } from '@/types'

const ICONS: Record<TopicType, string> = {
  lesson: '📖',
  exercise: '🛠',
  project: '🎯',
  group_project: '👥',
}

export function TopicTypeIcon({ type }: { type: TopicType }) {
  return <span title={type.replace('_', ' ')}>{ICONS[type]}</span>
}
