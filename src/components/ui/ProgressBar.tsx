interface Props {
  value: number
  color?: string
  height?: string
  showLabel?: boolean
}

export function ProgressBar({ value, color = '#478cbf', height = 'h-2', showLabel = false }: Props) {
  return (
    <div className="w-full">
      <div className={`w-full bg-white/10 rounded-full ${height} overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-white/50 mt-1 block">{value}% complete</span>
      )}
    </div>
  )
}
