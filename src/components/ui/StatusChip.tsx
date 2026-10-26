import { Status } from '@/types'

const CONFIG: Record<Status, { label: string; classes: string }> = {
  not_started: { label: 'Not Started', classes: 'bg-white/10 text-white/40' },
  in_progress: { label: 'In Progress', classes: 'bg-yellow-500/20 text-yellow-300' },
  done: { label: 'Done', classes: 'bg-green-500/20 text-green-400' },
}

interface Props {
  status: Status
  onClick?: (next: Status) => void
}

const CYCLE: Record<Status, Status> = {
  not_started: 'in_progress',
  in_progress: 'done',
  done: 'not_started',
}

export function StatusChip({ status, onClick }: Props) {
  const { label, classes } = CONFIG[status]
  return (
    <button
      onClick={() => onClick?.(CYCLE[status])}
      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all ${classes} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
    >
      {label}
    </button>
  )
}
