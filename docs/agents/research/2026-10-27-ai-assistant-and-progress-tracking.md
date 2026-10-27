---
date: 2026-10-27T08:52:28.786459+00:00
git_commit: 4b6907b1da80ef536c63360ff1f71e4269793d96
branch: main
topic: "What are the current capabilities and gaps in the AI assistant and progress tracking features?"
tags: [research, codebase, ai-assistant, progress-tracking, analytics, zustand, timeline]
status: complete
---

# Research: AI Assistant and Progress Tracking Features

## Research Question
What are the current capabilities and gaps in the AI assistant and progress tracking features?

## Summary

Profectus is an XR curriculum progress tracker with two distinct feature domains:

1. **AI Assistant** — a floating chat panel backed by a server-side proxy to `claude-haiku-4-5`. The assistant receives a freshly-built system prompt on every message that summarizes the user's current curriculum progress, enabling contextually-aware coaching responses.

2. **Progress Tracking** — a Zustand store (`profectus-progress` in `localStorage`) that holds the full curriculum state. It records `status`, `startedAt`, `completedAt`, and free-text `notes` per topic. Four UI surfaces render this data: a module card grid, a module detail view, an accordion timeline, and an analytics dashboard.

```
profectus/
├── src/
│   ├── app/
│   │   ├── api/chat/
│   │   │   └── route.ts              # AI proxy (POST handler)
│   │   ├── analytics/
│   │   │   └── page.tsx              # /analytics route shell
│   │   └── timeline/
│   │       └── page.tsx              # /timeline route shell
│   ├── components/
│   │   ├── assistant/
│   │   │   └── AIAssistant.tsx       # Floating chat panel
│   │   ├── analytics/
│   │   │   └── AnalyticsView.tsx     # Full analytics feature component
│   │   ├── timeline/
│   │   │   └── TimelineView.tsx      # Timeline accordion feature component
│   │   ├── overview/
│   │   │   └── ModuleCard.tsx        # Home grid card
│   │   ├── module/
│   │   │   └── ModuleDetail.tsx      # Per-module topic list
│   │   ├── providers/
│   │   │   └── StoreHydration.tsx    # SSR hydration gate
│   │   └── ui/
│   │       └── ProgressBar.tsx       # Shared progress bar primitive
│   ├── data/
│   │   └── curriculum.ts             # Static CURRICULUM array (6 modules, 64 topics)
│   ├── hooks/
│   │   └── useHydrated.ts            # Hydration boolean hook
│   ├── lib/
│   │   └── ai.ts                     # Client-side fetch wrapper
│   ├── store/
│   │   └── progress.ts               # Zustand store with localStorage persistence
│   └── types/
│       └── index.ts                  # Status, TopicType, Topic, Module, ProgressState
```

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│                                                                  │
│  ┌──────────────┐   reads   ┌────────────────────────────────┐  │
│  │ AIAssistant  │◄──────────│  useProgressStore (Zustand)    │  │
│  │  .tsx        │           │  persisted → localStorage      │  │
│  │              │           │  modules[], setTopicStatus()   │  │
│  │ buildSystem  │           │  setTopicNotes()               │  │
│  │ Prompt()     │           │  getModuleProgress()           │  │
│  └──────┬───────┘           │  getGlobalProgress()           │  │
│         │ sendChatMessage   └──────────┬─────────────────────┘  │
│         │ (lib/ai.ts)                  │ reads                  │
│         ▼                             ▼                         │
│  ┌──────────────┐           ┌────────────────────────────────┐  │
│  │ POST /api/   │           │  AnalyticsView  TimelineView   │  │
│  │ chat         │           │  ModuleCard     ModuleDetail   │  │
│  └──────┬───────┘           └────────────────────────────────┘  │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  OpenAI-compatible endpoint │
│  model: claude-haiku-4-5    │
│  env: AI_API_KEY            │
│       AI_BASE_URL           │
└─────────────────────────────┘
```

---

## Detailed Findings

### AI Assistant

**Component: `src/components/assistant/AIAssistant.tsx`**
- Exports `AIAssistant` (line 25) — a floating panel fixed at `bottom-6 right-6`
- Toggle button uses `✦` / `×` icons (lines 66–67)
- Panel dimensions: `w-80 h-[480px]` (line 71)
- Local state: `open`, `messages: Message[]`, `input`, `loading` (lines 26–29)
- Message history is component-local (`useState`) — not persisted anywhere (line 27)
- Auto-scrolls to bottom on every new message via `useEffect` + `bottomRef` (lines 33–35, 106)

**System Prompt: `buildSystemPrompt()` (line 12)**
- Invoked on every `send()` call — not cached
- Iterates all modules and formats: `"- {title}: {done}/{total} done, {inProgress} in progress"` (lines 13–17)
- System prompt role string is hard-coded: `"You are an XR development learning coach"` (line 19)
- Context passed: module names, done count per module, in-progress count per module
- Context NOT passed: topic names, topic types, notes content, timestamps, current page/module the user is viewing

**Message Sending: `send()` (line 37)**
- Builds full message array: `[system prompt, ...history, userMsg]` (lines 45–48)
- Calls `sendChatMessage` from `src/lib/ai.ts`
- On error: appends a static error string to chat (line 52)
- No streaming — waits for full response before rendering (lines 45–50)

**Client helper: `src/lib/ai.ts`**
- `sendChatMessage(messages)` POSTs to `/api/chat` and returns `data.content` as a plain string (lines 1–12)
- No retry logic, no timeout, no streaming support

**Server route: `src/app/api/chat/route.ts`**
- `POST` handler (line 9) parses `{ messages }` from request body (line 10)
- Uses OpenAI SDK pointed at `AI_BASE_URL` with `AI_API_KEY` (lines 4–7)
- Model fixed at `'claude-haiku-4-5'` (line 14)
- Uses `client.chat.completions.create()` — non-streaming (line 13)
- Returns `{ content: string }` or `{ error: string }` with status 500 (lines 17–21)
- No authentication/rate-limiting on the route

---

### Progress Tracking — Store

**`src/store/progress.ts`**

State shape (`ProgressStore` interface, line 8):
| Field | Type | Description |
|---|---|---|
| `_hasHydrated` | `boolean` | Tracks localStorage rehydration |
| `modules` | `Module[]` | Full curriculum with live status |
| `setTopicStatus` | action | Updates status + timestamps |
| `setTopicNotes` | action | Updates free-text notes |
| `getModuleProgress` | selector | % done for one module |
| `getGlobalProgress` | selector | % done across all modules |

**`setTopicStatus` (line 25)**
- Sets `startedAt` on first non-`not_started` transition (line 38)
- Sets `completedAt` only when transitioning to `'done'` (line 39)
- Clears `completedAt` when moving away from `'done'` (completedAt becomes `undefined`)

**Persistence (lines 74–81)**
- Key: `'profectus-progress'`
- `skipHydration: true` — manual hydration via `StoreHydration` provider
- `onRehydrateStorage` callback sets `_hasHydrated = true`

---

### Progress Tracking — Curriculum Data

**`src/data/curriculum.ts`**
- Exports `CURRICULUM: Module[]` — 6 modules, 64 topics total:
  | Module | Topics | Colors |
  |---|---|---|
  | Godot Basics | 12 | `#478cbf` |
  | Blender Modelling | 14 | `#ea7600` |
  | Substance Painter | 11 | `#a855f7` |
  | Unreal Engine | 10 | `#0f9bd7` |
  | Unity | 12 | `#22c55e` |
  | Virtual Reality | 9 | `#f43f5e` |
- All topics initialize with `status: 'not_started'` (no `startedAt`/`completedAt` pre-set)
- Topic types present: `lesson`, `exercise`, `project`, `group_project`
- No descriptions, difficulty levels, estimated durations, or prerequisite links on any topic

---

### Progress Tracking — UI Surfaces

**ModuleCard (`src/components/overview/ModuleCard.tsx`)**
- Reads per-module topics from store (line 15)
- Computes inline `progress` percentage (line 16)
- Displays: module title, subtitle, progress %, topic-type counts via `TYPE_COUNTS` helper (line 8)
- Links to `/module/[id]`

**ModuleDetail (`src/components/module/ModuleDetail.tsx`)**
- Actions exposed: `setTopicStatus`, `setTopicNotes` (line 12)
- Local state: `toggleNotes`, `startEditing`, `stopEditing` for inline notes UI (lines 22–41)
- Renders each topic with `StatusChip` (status toggle), `TopicIcon`, and collapsible notes textarea

**TimelineView (`src/components/timeline/TimelineView.tsx`)**
- Accordion: one module expanded at a time, default first module (line 12)
- Vertical line decoration via absolute-positioned `div` (line 17)
- Module dot fills with `mod.color` at 100% progress, otherwise dark (lines 30–33)
- Topics show `StatusChip` (clickable status toggle) and `TopicIcon` (lines 68–71)
- Notes NOT visible or editable in timeline view

**AnalyticsView (`src/components/analytics/AnalyticsView.tsx`)**
- Derives all stats in-component from raw store data (no memoization)
- Charts rendered as pure CSS/div bar charts (no external chart library)
- Stats computed:
  - Global done/total count + percentage (lines 33–35)
  - Per-module done + in-progress counts (lines 37–41)
  - Topic-type breakdown: done/total per type (lines 44–49)
  - Weekly velocity: last 8 calendar weeks, completion counts (lines 51–68)
  - Day-of-week heatmap: completions bucketed Mon–Sun (lines 72–79)

---

### Types (`src/types/index.ts`)

```
Status          = 'not_started' | 'in_progress' | 'done'
TopicType       = 'lesson' | 'exercise' | 'project' | 'group_project'

Topic {
  id, title, type, status
  notes?          // free-text, optional
  startedAt?      // ISO string, set on first non-not_started transition
  completedAt?    // ISO string, set only when status = 'done'
}

Module {
  id, title, subtitle?, color, order
  topics: Topic[]
}

ProgressState {  // partial interface, not the full Zustand store shape
  modules, setTopicStatus, setTopicNotes
}
```

---

## Code References

- `src/components/assistant/AIAssistant.tsx:12` — `buildSystemPrompt()` constructs the AI context from store modules
- `src/components/assistant/AIAssistant.tsx:25` — `AIAssistant` component entry point
- `src/components/assistant/AIAssistant.tsx:37` — `send()` — message dispatch logic, sends full history + system prompt
- `src/app/api/chat/route.ts:9` — `POST` handler, proxies to OpenAI-compatible endpoint
- `src/app/api/chat/route.ts:14` — model name `'claude-haiku-4-5'` hard-coded
- `src/lib/ai.ts:1` — `sendChatMessage()` client wrapper, POSTs messages array
- `src/store/progress.ts:8` — `ProgressStore` interface defining full store shape
- `src/store/progress.ts:25` — `setTopicStatus` action with timestamp logic
- `src/store/progress.ts:46` — `setTopicNotes` action
- `src/store/progress.ts:60` — `getModuleProgress` selector (% done per module)
- `src/store/progress.ts:67` — `getGlobalProgress` selector (% done globally)
- `src/store/progress.ts:74` — Zustand `persist` config with `skipHydration: true`
- `src/data/curriculum.ts:3` — `CURRICULUM` array: 6 modules, 64 topics, all `not_started`
- `src/components/analytics/AnalyticsView.tsx:29` — `AnalyticsView` — 4 stat sections, pure CSS charts
- `src/components/analytics/AnalyticsView.tsx:51` — weekly velocity: last 8 weeks using `isoWeekStart`
- `src/components/analytics/AnalyticsView.tsx:72` — day-of-week heatmap using `dayBuckets[dow]`
- `src/components/timeline/TimelineView.tsx:10` — `TimelineView` accordion; one module expanded at a time
- `src/components/module/ModuleDetail.tsx:11` — `ModuleDetail` with notes inline editing
- `src/components/overview/ModuleCard.tsx:14` — `ModuleCard` with progress % and topic-type counts
- `src/components/providers/StoreHydration.tsx:6` — `StoreHydration` gates render until store is hydrated
- `src/hooks/useHydrated.ts:3` — `useHydrated` returns boolean for SSR-safe rendering

---

## Architecture Documentation

**Data flow — single direction:**
`CURRICULUM (static)` → `useProgressStore (Zustand + localStorage)` → all UI components

**AI assistant context pipeline:**
`useProgressStore` → `buildSystemPrompt()` → POST `/api/chat` → OpenAI SDK → `claude-haiku-4-5`

**Persistence model:**
- Single `localStorage` key (`profectus-progress`) stores the entire `modules` array
- On first load, store is initialized from `CURRICULUM` (all topics `not_started`)
- Existing users' stored state is never migrated when `CURRICULUM` changes

**Hydration guard:**
- `StoreHydration` (providers) wraps the app in the root layout
- `useHydrated` hook provides the same boolean to individual components
- `skipHydration: true` in Zustand config means hydration is manual, triggered by the provider

**Chat message history:**
- Stored in `AIAssistant` component's local `useState` — ephemeral, lost on panel close or page navigation
- Full history array is sent with every message (growing unbounded per session)

**Analytics computation:**
- All calculations run inline in `AnalyticsView` render, re-derived on every render from raw store state
- No memoization (`useMemo`) applied to the derived stats
- No external charting library — all charts are CSS `div` elements with inline `height` percentages

**Module ordering:**
- `Module.order` field exists on the type but the `CURRICULUM` array is already ordered; no sort is applied at render time

---

## Open Questions

- Does `ProgressState` in `src/types/index.ts:24` (which omits `_hasHydrated`, `setHasHydrated`, `getModuleProgress`, `getGlobalProgress`) serve a specific purpose, or is it an incomplete mirror of the full `ProgressStore` interface?
- The `Module.order` field is defined but no component currently sorts by it — is ordering enforced by array position in `CURRICULUM`?
- `AIAssistant` sends the full message history on every request — is there a maximum token context concern for long chat sessions?
- Chat history is lost on panel close (component unmount) — is this intentional or a known limitation?
- No authentication on `POST /api/chat` — is this route intended to be public or is authentication planned?
