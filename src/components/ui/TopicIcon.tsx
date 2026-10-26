import { getTopicIcon } from '@/lib/topicIcons'

interface Props {
  title: string
  color?: string
  size?: number
}

export function TopicIcon({ title, color = '#ffffff', size = 16 }: Props) {
  const Icon = getTopicIcon(title)
  return <Icon size={size} style={{ color, opacity: 0.75, flexShrink: 0 }} />
}
