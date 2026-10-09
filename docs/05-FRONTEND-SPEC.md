# 05 — FRONTEND SPEC (Next.js + TypeScript)

Visuals and motion: follow `02-DESIGN-SYSTEM.md` (it wins on colors, fonts, motion). Backend contract: `01-ARCHITECTURE §6` (events) and `04-BACKEND-SPEC §9` (endpoints).

## 1. Setup

- Next.js (App Router) + TypeScript (strict) + Tailwind. Packages: `motion` (animation), `react-markdown`, `remark-gfm`. Anything else (including packages needed by UI add-ons) only after asking the owner.
- Fonts: Fraunces, DM Sans, Space Mono via `next/font/google` in `src/lib/fonts.ts` only.
- `NEXT_PUBLIC_API_URL` is the only public env var. Read it in one place (`lib/api.ts`), strip trailing `/`.
- `npm run build` must pass with zero errors before every push.
- `.gitignore` check: `frontend/src/lib` must be tracked (00 §7).
- Per-page `metadata` (title, description), favicon/app icon generated from the logo.

## 2. Routes

| Route | Purpose | Nav index |
|-------|---------|-----------|
| `/` | Home: hero, how it works, depths, limits, CTA | 0 |
| `/research` | The app: new research form + live run + report | 1 |
| `/history` | Saved reports list | 2 |
| `/reports/[id]` | One saved report (child of History) | 2 |
| `/about` | About, privacy, tech, FAQ | 3 |

`Header` and `Footer` live in `app/layout.tsx` and are shared by all pages. Page transition wraps `{children}` only (02 §5.2).

## 3. Library files (`src/lib/`)

- `fonts.ts`: the three fonts.
- `site.ts`: `siteConfig = { name: "ResearchPilot", ownerName: "", githubUrl: "", linkedinUrl: "", portfolioUrl: "", exampleTopics: [...] }` (owner fills blanks; UI hides links whose URL is empty).
- `navOrder.ts`: ordered nav items `[{href, label}]`, `getNavIndex(pathname)` (`/reports/*` → History index), `getDirection(prev, next)` (+1 right/forward, −1 left/back).
- `motionTokens.ts`: durations, easing, distances from 02 §5.1; helper that returns smaller distances on mobile and zero slides when reduced motion is on (`useReducedMotion`).
- `types.ts`: TypeScript types for every SSE event (discriminated union on `type`), `Depth`, `BudgetResponse`, `ReportSummary`, `ReportFull`.
- `clientId.ts`: `getClientId()` creates a UUID once in `localStorage` key `rp_client_id`; safe on the server (returns empty string if `window` is undefined).
- `api.ts`: `getBudget()`, `listReports()`, `getReport(id)`, `deleteReport(id)`, `ping()`. Network errors return typed friendly errors.
- `stream.ts`: `startResearch({topic, depth, signal, onEvent})`:
  1. `fetch(POST /api/research)` with JSON body and `AbortSignal`.
  2. If not OK, read JSON `{code,message}` and throw a typed error.
  3. Read `response.body` with a `ReadableStream` reader + `TextDecoder`, buffer partial chunks, split on blank lines, parse `data:` lines as JSON, call `onEvent`.
  4. `AbortError` resolves quietly.
- `mockStream.ts`: **same function signature as `startResearch`**, but plays a scripted sequence of realistic events (plan → 2 rounds → notes → report, with 600–1500 ms gaps, a warning variant and an error variant). Selected by `?mock=stream`, `?mock=warning`, `?mock=error` or when `NEXT_PUBLIC_API_URL` is empty. This lets the whole UI be built and tested before the backend exists.
- `format.ts`: relative time ("2 h ago"), local reset-time formatting from `resets_at` (browser timezone), domain helper.

## 4. Components (`src/components/`)

**Layout and motion**
| Component | Notes |
|-----------|-------|
| `Header` | Black sticky header per 02 §4.2. Logo (next/image), wordmark, nav links, `BudgetPill`, "Start research" CTA, mobile menu button |
| `NavLinks` | Renders links, `aria-current`, sliding gold underline (shared layout animation) |
| `MobileMenu` | Slide-in from right, staggered fade links, focus trap, Esc to close |
| `Footer` | Black band per 02 §4.11 |
| `PageTransition` | Left/right transition by `getDirection` (02 §5.2); enter-only fallback allowed |
| `Reveal` | Sideways scroll reveal with `from="left" \| "right" \| "auto"` and stagger support (02 §5.3) |
| `FadeText` | Fade-in text, optional `byWord` (02 §5.4) |
| `FadeSwap` | Cross-fade when content changes (02 §5.4) |
| `HorizontalStrip` | Scroll-snap strip with arrows, dots, edge masks, hint (02 §5.5) |
| `DotBackground` | Reused from `reference/`, re-colored with `--dot` |
| `GlassCard`, `Banner`, `EmptyState`, `Skeleton` | Per 02 §4 |

**Marketing pages**
| Component | Notes |
|-----------|-------|
| `HeroSection`, `LivePreviewCard` | Home hero; preview card is a static/looping mock, not a real run |
| `HowItWorksStrip` | 5 cards inside `HorizontalStrip` |
| `DepthCards` | 3 cards, left/center/right reveal |
| `LimitsSection` | Text + mock budget meter |
| `CtaBand` | Black band with gold button |
| `FaqAccordion` | Smooth open/close, answer text fades (use an add-on if approved) |

**App**
| Component | Notes |
|-----------|-------|
| `BudgetPill` | Polls `GET /api/budget` on load, after each finished run, and every 60 s. Shows "AI calls used/limit" (numbers via FadeSwap), tooltip with local reset time |
| `TopicForm` | Textarea (placeholder "What do you want researched?", counter 0/300), example chips (from `siteConfig.exampleTopics`), `DepthSelector`, Start/Cancel button, public-demo note |
| `DepthSelector` | Quick / Standard / Deep with estimates; sliding gold highlight; disables options where `depths[x].allowed` is false |
| `RunView` | Holds run state; renders `ProgressTimeline` then `ReportView` |
| `ProgressTimeline` | Rows per 02 §4.8, built from events |
| `SubQuestionChips` | Chips inside a `HorizontalStrip` |
| `ReportView` | Markdown + citation pills + `SourcesList` + meta line ("Standard · 4 AI calls · 8 search/read credits · 31 s") |
| `SourcesList` | Numbered; title, domain, external link |
| `HistoryList` | Rows from `listReports()`; click → `/reports/[id]`; delete with inline confirm ("Delete this report?" Yes/No) |

`src/components/addons/` holds approved UI add-ons from `reference/ui-addons/` (02 §10).

## 5. Run state machine (Research page)

States: `idle → waking → running → done | error | cancelled`.

- **On load:** call `ping()` (GET /health). If > 3 s show info banner "Waking up the server (free hosting can take up to a minute)…" until it responds; disable Start while waking. (Skipped in mock mode.)
- **Start:** validate topic (5–300 chars) → `running` → clear previous run → `startResearch(...)` (or mock).
- **Events → UI:**
  - `run_started`: run header + limits.
  - `plan`: Plan row done + sub-question chips.
  - `round_started`: new round group (Search / Read / Notes pending), slides in from the right.
  - `search_done`: append query + top domains under Search (one muted line per query).
  - `reading`: Read row active with page titles/domains.
  - `notes`: Notes row done, count ("6 notes"), expandable list (note text with `[n]`), then "Enough information" or "Looking deeper: {follow-up queries}".
  - `writing`: Write row active.
  - `report`: render the report (sections fade in sequentially).
  - `usage`: update run header counters ("AI calls 3/6 · Search/read credits 8") and the `BudgetPill` (use `daily_used` directly, no extra request).
  - `warning`: warning banner (run continues).
  - `error`: error banner with the friendly message; keep rows already shown; show partial notes if included.
  - `done`: state `done`; refresh history count.
- **Cancel** (visible while running): `AbortController.abort()` → `cancelled`, message "Run cancelled. Partial progress is saved in history."
- **Leaving the page** during a run aborts the stream (cleanup in `useEffect`).
- Never two runs at once from the same page.
- Live data never re-animates rows already on screen.

## 6. Report rendering

- `react-markdown` + `remark-gfm`. **No raw HTML** (do not enable `rehype-raw`).
- Replace `[n]` patterns in text nodes with a citation pill linking to `#source-n`; scrolling there highlights the source row (02 §4.9). `[1][3]` becomes two pills.
- Links in Markdown: only `http`/`https`, `target="_blank" rel="noopener noreferrer"`.
- A saved report with `status` `failed_budget` or `failed` shows partial notes with an explanatory banner.

## 7. Messages (exact wording)

| Case | Text |
|------|------|
| Waking | "Waking up the server (free hosting can take up to a minute)…" |
| Daily budget gone | "Today's AI budget is used up. It resets at {time}. You can still read your saved reports." |
| Depth disabled | "Not enough budget left today for this depth." |
| Rate limited | "You've started a lot of runs recently. Please try again later." |
| Busy | "A research run is already in progress." |
| No results | "The web search returned nothing useful. Try rewording the topic." |
| Timeout | "This took too long and was stopped." |
| Generic error | "Something went wrong. Please try again." |
| Public note under form | "Reports are saved in this browser. Don't enter private information." |

## 8. States that must exist and be previewable

Waking · idle empty · running (each step) · done (report with 20+ sources) · warning (stopped early) · error · cancelled · budget exhausted (Start disabled + message) · history empty · history loading (skeleton) · history list · mobile menu open · long topic text. In design phases these are previewed with `?mock=` (`running`, `done`, `warning`, `error`, `waking`, `budget`, `empty`, `stream`).

## 9. Pre-push checklist (every time)

1. `npm run build` passes.
2. `git ls-files frontend/src/lib` lists all lib files.
3. `git status` shows no `.env*` files.
4. `NEXT_PUBLIC_API_URL` on Vercel points to the Render URL (https, no trailing slash).
5. Reduced-motion check done if animations changed.
