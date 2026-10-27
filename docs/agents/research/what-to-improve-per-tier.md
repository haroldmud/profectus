# Features to Implement — Per Tier

> Based on research: `2026-10-27-ai-assistant-and-progress-tracking.md`

---

## Tier 1 — High Impact, Targeted Changes

### 1. Richer AI Context in `buildSystemPrompt`
Right now the AI only sees module names + done/in-progress counts. It doesn't know which specific topics are done, what notes the user wrote, how long they've been stuck (a topic with `startedAt` but no `completedAt` for weeks), or what page they're currently on. Passing that context would turn a generic coach into one that can say "you've been on *Baking Mesh Maps* for 3 weeks — here's what tripped people up."

- **File to change:** `src/components/assistant/AIAssistant.tsx:12`

### 2. Persistent Chat History
Currently `messages` lives in local `useState` — gone on close or navigation. Moving it into the Zustand store (with localStorage persistence) means a user can close the panel, come back tomorrow, and continue the same conversation. The store and types are already in place to absorb this.

- **Files to change:** `src/store/progress.ts`, `src/components/assistant/AIAssistant.tsx`

### 3. Streaming Responses
The non-streaming round-trip makes the coach feel slow. Adding streaming via the OpenAI SDK's stream API + a `ReadableStream` response would make it feel dramatically more alive. The UI already has a loading animation to replace.

- **Files to change:** `src/app/api/chat/route.ts`, `src/lib/ai.ts`, `src/components/assistant/AIAssistant.tsx`

---

## Tier 2 — Medium Impact, More Involved

### 4. Topic-Level Enrichment: Estimated Durations + Difficulty
Topics have no `duration` or `difficulty` fields. Adding even rough estimates to `curriculum.ts` would unlock "time to completion" in analytics and let the AI say "you have ~6 hours left in this module."

- **Files to change:** `src/types/index.ts`, `src/data/curriculum.ts`, `src/components/analytics/AnalyticsView.tsx`

### 5. Streak / Consistency Tracking in Analytics
`AnalyticsView` tracks weekly velocity and day-of-week patterns but has no consecutive-days streak. All the data is already there (`completedAt` timestamps per topic) — it's purely a new derived computation.

- **File to change:** `src/components/analytics/AnalyticsView.tsx`

### 6. "Suggest Next Topic" Shortcut in AI Panel
A single quick-action button that fires a pre-built prompt ("What should I study next based on my progress?") without the user having to type it. Low engineering cost, high discoverability.

- **File to change:** `src/components/assistant/AIAssistant.tsx`

---

## Tier 3 — Worth Doing, Not Urgent

### 7. Notes Visible in TimelineView
Notes are editable in `ModuleDetail` but completely invisible in `TimelineView`. A collapsed preview would make the timeline much more useful as a study log.

- **File to change:** `src/components/timeline/TimelineView.tsx`

### 8. Curriculum Migration Path
Existing users never receive new topics added to `curriculum.ts`. A simple version-check + merge on hydration would fix silent data drift for returning users.

- **Files to change:** `src/store/progress.ts`, `src/data/curriculum.ts`

---

## Recommended First Sprint

Items **1 + 2 + 3** form a natural unit — together they transform the AI coach from a novelty into a genuinely powerful feature. The AI becomes context-aware, conversations persist across sessions, and responses feel live.
