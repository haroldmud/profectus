# Profectus — Agent Context Reference

> Verbose reference for AI agents. Keep AGENTS.md lean — put depth here.

---

## Architecture

**Stack:** Next.js 15 (App Router, Turbopack), Zustand v5, Tailwind CSS v4, OpenAI SDK

**Data flow — single direction:**
```
CURRICULUM (static)
  └─▶ useProgressStore (Zustand + localStorage)
        └─▶ ModuleCard | ModuleDetail | TimelineView | AnalyticsView
              └─▶ AIAssistant (reads store, POSTs to /api/chat)
                    └─▶ OpenAI-compatible endpoint (claude-haiku-4-5)
```

**Persistence model:**
- Single `localStorage` key: `profectus-progress`
- Seeded from `CURRICULUM` on first load (all topics `not_started`)
- `skipHydration: true` — manual hydration via `StoreHydration` provider
- No migration path when `CURRICULUM` changes for existing users

---

## File Map

```
src/
├── app/
│   ├── api/chat/route.ts          # AI proxy — POST handler, OpenAI SDK
│   ├── analytics/page.tsx         # /analytics shell
│   ├── module/[id]/page.tsx       # /module/[id] shell
│   ├── timeline/page.tsx          # /timeline shell
│   └── layout.tsx                 # Root layout + AIAssistant + StoreHydration
├── components/
│   ├── assistant/AIAssistant.tsx  # Floating chat panel (bottom-6 right-6)
│   ├── analytics/AnalyticsView.tsx
│   ├── timeline/TimelineView.tsx
│   ├── module/ModuleDetail.tsx
│   ├── overview/ModuleCard.tsx
│   ├── providers/StoreHydration.tsx
│   └── ui/                        # StatusChip, TopicIcon, ProgressBar, ...
├── data/curriculum.ts             # CURRICULUM: 6 modules, 64 topics
├── hooks/useHydrated.ts           # Unused — wired to nothing
├── lib/ai.ts                      # Client fetch wrapper → /api/chat
├── store/progress.ts              # Zustand store
└── types/index.ts                 # Status, TopicType, Topic, Module
```

---

## Core Types

```ts
Status    = 'not_started' | 'in_progress' | 'done'
TopicType = 'lesson' | 'exercise' | 'project' | 'group_project'

Topic   { id, title, type, status, notes?, startedAt?, completedAt? }
Module  { id, title, subtitle?, color, order, topics: Topic[] }
```

---

## Store Actions & Selectors

| Symbol | Location | Description |
|---|---|---|
| `setTopicStatus` | `store/progress.ts:25` | Updates status + timestamps (`startedAt`, `completedAt`) |
| `setTopicNotes` | `store/progress.ts:46` | Updates free-text notes |
| `getModuleProgress` | `store/progress.ts:60` | `{ done, total, percentage }` for one module |
| `getGlobalProgress` | `store/progress.ts:67` | Global `{ done, total, percentage }` |

---

## AI Integration

- **Route:** `POST /api/chat` — no auth, no rate limit, no input validation
- **Model:** `claude-haiku-4-5` (hard-coded at `route.ts:14`)
- **Env vars required:** `AI_API_KEY`, `AI_BASE_URL`
- **System prompt built at:** `AIAssistant.tsx:12` — passes module names + done/in-progress counts only
- **Not in context:** topic names, notes, timestamps, current page
- **Chat history:** ephemeral `useState` — lost on panel close or navigation

---

## Known Issues (from review-2026-10-27.md)

| Priority | Issue | File |
|---|---|---|
| High | Zero tests; `npm test` script broken | `package.json` |
| High | No input validation on chat route | `route.ts:10` |
| High | ~80 lines of duplicated notes logic | `ModuleDetail.tsx`, `TimelineView.tsx` |
| Medium | Nested `<main>` on analytics page | `analytics/page.tsx:5` |
| Medium | Dead code: `useHydrated`, `TopicTypeIcon` | `hooks/`, `components/ui/` |
| Medium | `getTopicIcon` 50-regex scan unmemoized | `topicIcons.ts:159` |

---

## Related Files

- `docs/review-2026-10-27.md` — full project review #1
- `docs/agents/research/what-to-improve-per-tier.md` — improvement backlog by tier
- `docs/agents/research/2026-10-27-ai-assistant-and-progress-tracking.md` — deep research on AI + progress tracking
