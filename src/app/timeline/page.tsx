import { TimelineView } from '@/components/timeline/TimelineView'

export default function TimelinePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Timeline</h1>
        <p className="text-white/40">Your XR learning path — click a module to expand its topics.</p>
      </div>
      <TimelineView />
    </div>
  )
}
