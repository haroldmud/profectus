'use client'

import { useProgressStore } from '@/store/progress'
import { TopicType } from '@/types'

const TYPE_LABELS: Record<TopicType, string> = {
  lesson: 'Lesson',
  exercise: 'Exercise',
  project: 'Project',
  group_project: 'Group Project',
}

const TYPE_COLORS: Record<TopicType, string> = {
  lesson: '#a855f7',
  exercise: '#0f9bd7',
  project: '#22c55e',
  group_project: '#f43f5e',
}

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isoWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

export function AnalyticsView() {
  const modules = useProgressStore((s) => s.modules)
  const allTopics = modules.flatMap((m) => m.topics)

  const globalDone = allTopics.filter((t) => t.status === 'done').length
  const globalTotal = allTopics.length

  // Per-module stats
  const moduleStats = modules.map((m) => {
    const done = m.topics.filter((t) => t.status === 'done').length
    const inProgress = m.topics.filter((t) => t.status === 'in_progress').length
    return { mod: m, done, inProgress, total: m.topics.length }
  })

  // Topic-type breakdown
  const typeKeys: TopicType[] = ['lesson', 'exercise', 'project', 'group_project']
  const typeCounts = typeKeys.map((type) => {
    const all = allTopics.filter((t) => t.type === type)
    const done = all.filter((t) => t.status === 'done').length
    return { type, total: all.length, done }
  }).filter((tc) => tc.total > 0)

  // Weekly velocity (last 8 weeks)
  const now = new Date()
  const weeks: { label: string; count: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const weekDate = new Date(now)
    weekDate.setUTCDate(weekDate.getUTCDate() - i * 7)
    const weekKey = isoWeekStart(weekDate)
    const count = allTopics.filter((t) => {
      if (!t.completedAt) return false
      return isoWeekStart(new Date(t.completedAt)) === weekKey
    }).length
    const weekEnd = new Date(weekDate)
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
    weeks.push({
      label: `${weekDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`,
      count,
    })
  }
  const maxWeekCount = Math.max(...weeks.map((w) => w.count), 1)

  // Day-of-week heatmap
  const dayBuckets = new Array(7).fill(0)
  allTopics.forEach((t) => {
    if (!t.completedAt) return
    const d = new Date(t.completedAt)
    const dow = (d.getUTCDay() + 6) % 7 // 0=Mon
    dayBuckets[dow]++
  })
  const maxDayCount = Math.max(...dayBuckets, 1)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-white/40 text-sm">
          {globalDone} of {globalTotal} topics complete — {globalTotal === 0 ? 0 : Math.round(globalDone / globalTotal * 100)}% overall
        </p>
      </div>

      {/* Module completion bars */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Module Progress</h2>
        <div className="space-y-3">
          {moduleStats.map(({ mod, done, inProgress, total }) => {
            const pctDone = total === 0 ? 0 : (done / total) * 100
            const pctInProgress = total === 0 ? 0 : (inProgress / total) * 100
            return (
              <div key={mod.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-white/70">{mod.title}</span>
                  <span className="text-xs text-white/30">{done}/{total}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden flex">
                  <div
                    className="h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${pctDone}%`, backgroundColor: mod.color }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${pctInProgress}%`, backgroundColor: mod.color, opacity: 0.3 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Topic type breakdown */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Topic Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {typeCounts.map(({ type, total, done }) => (
            <div key={type} className="rounded-xl border border-white/8 bg-white/5 p-4">
              <div
                className="text-xs font-medium mb-1"
                style={{ color: TYPE_COLORS[type] }}
              >
                {TYPE_LABELS[type]}
              </div>
              <div className="text-2xl font-bold text-white">{done}</div>
              <div className="text-xs text-white/30">of {total} done</div>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(done / total * 100)}%`, backgroundColor: TYPE_COLORS[type] }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly velocity */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Weekly Completions</h2>
        {globalDone === 0 ? (
          <p className="text-white/30 text-sm">No completed topics yet — completions will appear here once you start marking topics done.</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {weeks.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '96px' }}>
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${Math.round((w.count / maxWeekCount) * 100)}%`,
                      minHeight: w.count > 0 ? '4px' : '0',
                      backgroundColor: '#a855f7',
                      opacity: w.count > 0 ? 0.8 : 0.15,
                    }}
                  />
                </div>
                <span className="text-[10px] text-white/30 whitespace-nowrap">{w.label}</span>
                {w.count > 0 && <span className="text-[10px] text-white/50">{w.count}</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Day-of-week pattern */}
      {globalDone > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Most Productive Days</h2>
          <div className="flex items-end gap-3">
            {WEEK_LABELS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '56px' }}>
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${Math.round((dayBuckets[i] / maxDayCount) * 100)}%`,
                      minHeight: dayBuckets[i] > 0 ? '4px' : '0',
                      backgroundColor: '#22c55e',
                      opacity: dayBuckets[i] > 0 ? 0.7 : 0.1,
                    }}
                  />
                </div>
                <span className="text-[10px] text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
