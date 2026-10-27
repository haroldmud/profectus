# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # start dev server (http://localhost:3000) — uses Turbopack
npm run build      # production build
npm run lint       # ESLint
npm test           # run Vitest suite
npm run typecheck  # TypeScript validation
```
3
## Testing

- **Framework**: Vitest (or Jest) with React Testing Library.
- **Scope**: Focus tests on Zustand store state transitions (`src/store/progress.ts`), curriculum data parsing (`src/data/curriculum.ts`), and route handlers (`src/app/api/chat/route.ts`).
- **Store Testing**: When testing components or store actions, reset `localStorage` or mock the Zustand store persistence to prevent leaking state between tests.
  Summary of final layout:

## Strict Execution Protocol
1. After editing any file, run `npm run typecheck` immediately.
2. If type errors occur, DO NOT attempt new feature work—fix the errors first.
3. Before marking a task finished, run `npm test`. If any test fails, self-correct and re-test.

## Architecture

**Profectus** is an XR curriculum progress tracker. Users mark topics done, add notes, and get AI coaching. Progress is persisted to `localStorage` via Zustand's `persist` middleware.

### Data flow

1. **Static curriculum** lives entirely in `src/data/curriculum.ts` — an array of `Module` objects with hardcoded `Topic` items.
2. **Zustand store** (`src/store/progress.ts`) seeds from `CURRICULUM` on first load, then lives in `localStorage` under the key `profectus-progress`. Topic timestamps (`startedAt`, `completedAt`) are set here.
3. **Pages** are thin — they import from the store and delegate to a single feature component. Route-to-component mapping:
   - `/` → `ModuleCard` grid
   - `/module/[id]` → `ModuleDetail`
   - `/timeline` → `TimelineView`
   - `/analytics` → `AnalyticsView`
4. **AI assistant** (`AIAssistant.tsx`) is a floating panel injected in the root layout. It builds a system prompt from live store state and calls `POST /api/chat`, which proxies to an OpenAI-compatible endpoint using the `openai` npm package.

### Key types (`src/types/index.ts`)

- `Status`: `'not_started' | 'in_progress' | 'done'`
- `TopicType`: `'lesson' | 'exercise' | 'project' | 'group_project'`
- `Topic` and `Module` are the two core domain objects.

### Adding a new module or topic

Edit `src/data/curriculum.ts`. New entries appear immediately on next load for users whose `localStorage` was never seeded (first-time visitors). Existing users keep their old stored state; there is no migration path currently.

### AI integration

`src/app/api/chat/route.ts` uses the `openai` npm package pointed at a custom `AI_BASE_URL` with model `claude-haiku-4-5`. Both env vars (`AI_API_KEY`, `AI_BASE_URL`) must be set in `.env.local`. The client-side helper `src/lib/ai.ts` is a thin `fetch` wrapper — AI logic lives on the server route.

### Styling

Tailwind CSS v4 via `@tailwindcss/turbopack`. All color values are inline (no Tailwind config theme extensions). Dark background is `#0d0d0f`; module accent colors come from `Module.color`.
```
