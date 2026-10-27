<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Project: Profectus

XR curriculum progress tracker. Next.js 15 (App Router), Zustand v5, Tailwind CSS v4.

### Commands

```bash
npm run dev        # dev server → http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
npm test           # Vitest suite
npm run typecheck  # TypeScript validation
```

### Key Files

| File | Purpose |
|---|---|
| `src/data/curriculum.ts` | Static `CURRICULUM` — 6 modules, 64 topics |
| `src/store/progress.ts` | Zustand store, `localStorage` key `profectus-progress` |
| `src/types/index.ts` | `Status`, `TopicType`, `Topic`, `Module` |
| `src/app/api/chat/route.ts` | AI proxy — OpenAI SDK, env: `AI_API_KEY` / `AI_BASE_URL` |
| `src/components/assistant/AIAssistant.tsx` | Floating chat panel |

### Rules

1. Run `npm run typecheck` after every file edit. Fix errors before new feature work.
2. Run `npm test` before marking any task done.
3. Pages are thin shells — delegate to a single feature component per route.
4. Progress logic belongs in the Zustand store, not components.
5. Do not add inline progress computations — use `getModuleProgress()` / `getGlobalProgress()` from the store.

### Deeper Context

- Architecture, file map, store API, known issues → [`docs/agents/context.md`](docs/agents/context.md)
- Improvement backlog by tier → [`docs/agents/research/what-to-improve-per-tier.md`](docs/agents/research/what-to-improve-per-tier.md)
- Research reports → [`docs/agents/research/`](docs/agents/research/)
- Project review #1 (2026-10-27) → [`docs/review-2026-10-27.md`](docs/review-2026-10-27.md)
