# 06 — BUILD PLAN

**Rule:** one phase at a time. After each phase the agent stops and reports. The owner tests, ticks the checklist, commits, then asks for the next phase.

**Report format after every phase (agent must follow):**
1. What I built (3–6 plain-English lines)
2. Files created/changed
3. How you test it (exact steps/commands)
4. Checklist with ✅/❌
5. Anything I was unsure about (questions)

---

## Phase 0 — Prep (no features)

**Goal:** folder, git, safety files, understand the reference.

**Prompt for Antigravity:**
```
Read docs/00-START-HERE.md, then docs/01-ARCHITECTURE.md and docs/02-DESIGN-SYSTEM.md.
Do ONLY Phase 0 from docs/06-BUILD-PLAN.md.
1. List every file in reference/ (including reference/logo/ and reference/ui-addons/) and tell me in plain English what each is and which ones you will reuse. Do not integrate anything yet.
2. Create the folder structure from 00-START-HERE §5 (empty files/folders are fine).
3. Create .gitignore using ONLY anchored paths (no bare lib/, lib64/, build/, dist/). Run: git check-ignore -v frontend/src/lib/api.ts (must print nothing).
4. Create backend/.env.example and frontend/.env.example with the variable names from 00 §6 (empty values).
5. git init and make the first commit. Do not push yet.
Then stop and report.
```

**Done when:**
- [ ] `reference/` contents listed and explained (logo and every add-on folder, including starfield-hero)
- [ ] Folder structure matches 00 §5
- [ ] `git check-ignore -v frontend/src/lib/api.ts` prints nothing
- [ ] `.env.example` files exist, real `.env` files are ignored
- [ ] First commit made

---

## DESIGN TRACK (D1, D2, D3): design the whole website before building the agent

The site is designed first, with **mock data only**, so you can see and approve the look before any backend work. Read `docs/02-DESIGN-SYSTEM.md` fully before each D phase. Tokens, fonts and motion in that file win over anything in `reference/`.

**Before D1, put in `reference/`:** `logo/` (your logo image), `ui-addons/` (one folder per Nexus UI add-on, each with its .tsx file and an install.txt, see README B3). The background is the `starfield-hero` folder inside `ui-addons/`; there is no separate background folder.

---

### Phase D1: Foundations (tokens, fonts, logo, header, footer, page transitions)

**Prompt for Antigravity:**
```
Read docs/00-START-HERE.md, docs/02-DESIGN-SYSTEM.md and docs/05-FRONTEND-SPEC.md. Do ONLY Phase D1 of docs/06-BUILD-PLAN.md.
1. Create the Next.js + TypeScript + Tailwind app in frontend/ (if not already there) and install: framer-motion, lucide-react, react-markdown, remark-gfm. Run `npx shadcn@latest init` (needed for Nexus UI add-ons), keeping our design tokens as the source of truth as described in docs/02-DESIGN-SYSTEM.md §10.1. Ask me before installing anything else.
2. Implement the color tokens (02 §2) as CSS variables and in the Tailwind theme. No hex values anywhere else.
3. Load Fraunces, DM Sans and Space Mono in src/lib/fonts.ts (02 §3).
4. Logo: follow 02 §1 rules (copy to public/brand, check it on black, make favicon/app icon). Tell me what you decided.
5. Build the black sticky Header with NavLinks (sliding gold underline), BudgetPill (mock numbers), Start research button, MobileMenu (slides from the right, links fade in one by one), and the black Footer.
6. Build a SiteBackground wrapper (02 §4.3) that for now renders nothing (plain --bg). The real background (starfield-hero) is integrated in D2 after I approve.
7. Build PageTransition (left/right by nav order, 02 §5.2), Reveal, FadeText, FadeSwap, HorizontalStrip (02 §5.3-5.5) and lib/motionTokens.ts, lib/navOrder.ts, lib/site.ts.
8. Create the 4 pages (/, /research, /history, /about) as simple placeholders with a heading using FadeText, so I can test navigation and transitions.
9. ADD-ON INVENTORY ONLY: read every folder in reference/ui-addons/ (each has a Nexus UI usage .tsx file and an install.txt with the shadcn add command and the npm install line). For each: what it is, props that carry colors/copy, required packages, and your proposed placement (heuristics in 02 §10). Check starfield-hero's props: are title, subtitle and buttons optional? Tell me whether it can be a site-wide background or only the Home hero, and show screenshots of the options (02 §4.3). Do NOT install or integrate any add-on yet. Stop and wait for my approval of the placement table.
Run npm run build. Stop and report with screenshots at 375, 768 and 1280 px.
```

**Done when:**
- [ ] Header is black and sticky; logo is clearly visible on it; wordmark shown
- [ ] Nav links work; the gold underline slides sideways between links
- [ ] Mobile menu slides in from the right and its links fade in one by one; Esc closes it
- [ ] Clicking Home → Research → History → About slides pages in from the right; going back slides from the left; header/footer stay still
- [ ] Beige/off-white page; fonts look right (Fraunces headings, DM Sans body, Space Mono labels)
- [ ] Reduced-motion mode removes slides (use browser dev tools to test)
- [ ] Contrast numbers reported for `--ink-3` on `--bg` and gold on black
- [ ] Add-on inventory table delivered and **approved/edited by owner**
- [ ] `npm run build` passes

---

### Phase D2: Marketing pages (Home and About)

**Prompt:**
```
Do ONLY Phase D2 of docs/06-BUILD-PLAN.md. Read docs/02-DESIGN-SYSTEM.md §4-§6, §10 and docs/05-FRONTEND-SPEC.md §4.
Build the Home page sections exactly as in 02 §6.1 (hero using the starfield-hero add-on as the background per 02 §4.3, "Watch it work" with rotating example topics using FadeSwap, "How it works" in a HorizontalStrip, three depths with left/center/right reveals, limits section with opposite-side columns, black CTA band) and the About page (02 §6.4, with FAQ accordion). Use the copy deck in 02 §6.5 word for word.
Integrate the add-ons I approved in the placement table, following docs/02-DESIGN-SYSTEM.md §10.1 exactly: run each shadcn add command, adapt the usage code with our copy and token colors, and keep installed components where shadcn put them. Respect the approved list; do not add others.
Every page needs at least two sideways reveals. Test reduced motion. Run npm run build. Report with screenshots at 375, 768, 1280 px.
```

**Done when:**
- [ ] Home has all 7 parts, copy matches the deck
- [ ] starfield-hero background works with our colors and copy; text is readable; clicks are never blocked; mobile has fewer particles
- [ ] Rotating example topic ("Watch it work") cross-fades every few seconds and pauses on hover
- [ ] "How it works" strip scrolls by swipe, trackpad, arrows and keyboard; vertical scrolling is never hijacked
- [ ] Text and visual columns come in from opposite sides; depth cards come from left, center, right
- [ ] About page sections alternate left/right; FAQ opens smoothly
- [ ] Approved add-ons are installed with their shadcn commands, use our copy and token colors, and look right on the beige page (or sit in a black band)
- [ ] Only one animated background is visible at a time
- [ ] Skipped add-ons are listed with a reason
- [ ] Design QA checklist (02 §11) ticked for these pages
- [ ] `npm run build` passes

---

### Phase D3: App screens with mock data (Research, History, Report)

**Prompt:**
```
Do ONLY Phase D3 of docs/06-BUILD-PLAN.md. Read docs/02-DESIGN-SYSTEM.md §4, §6.2-6.3, §11 and docs/05-FRONTEND-SPEC.md fully.
Build the Research page (TopicForm, DepthSelector with sliding highlight, RunView, ProgressTimeline, SubQuestionChips, ReportView with citation pills and SourcesList), the History page, /reports/[id], Banner, EmptyState and Skeleton. All data comes from mock files only (src/lib/mockStream.ts and a small mock data file). Make every state in 05 §8 previewable with ?mock=running|done|warning|error|waking|budget|empty|stream. Use the same signature for mockStream as the real startResearch will have (05 §3).
Use add-ons only where I approved them. Run npm run build. Report with screenshots of each state at 375 and 1280 px.
```

**Done when:**
- [ ] Every state in 05 §8 can be previewed with `?mock=`
- [ ] `?mock=stream` plays a full fake run: rows slide in from the left, new rounds from the right, detail text cross-fades, report sections fade in one by one
- [ ] Depth selector highlight slides sideways
- [ ] Citation pill click scrolls to and highlights the source
- [ ] History page rows fade in from the left with a stagger; empty state looks good
- [ ] Layouts work at 375 / 768 / 1280 px, no horizontal page scroll
- [ ] Full Design QA checklist (02 §11) ticked
- [ ] **Owner signs off on the design** (say "design approved" before moving to Phase 1)
- [ ] `npm run build` passes

---

## Phase 1: Backend skeleton + early live deploy + CORS test

**Goal:** prove frontend ↔ backend works **on the live sites** before any agent code. The designed frontend from D1–D3 is deployed as is; only the budget pill is connected to the backend.

**Prompt:**
```
Do ONLY Phase 1 of docs/06-BUILD-PLAN.md. Read docs/04-BACKEND-SPEC.md §2, §3, §13 and docs/05-FRONTEND-SPEC.md §1, §3.
Backend: FastAPI app with GET /health and a placeholder GET /api/budget that returns fake numbers in the final JSON shape. Config parsing for ALLOWED_ORIGINS exactly as specified (log the parsed list at startup). CORS as specified.
Frontend: keep the designed site. Implement lib/api.ts (getBudget, ping) and connect ONLY the header BudgetPill and the waking-server banner to the backend. Everything else stays on mock data. If NEXT_PUBLIC_API_URL is empty the site must still work in mock mode.
Add requirements.txt (pinned), .python-version, and a short deploy note for me. Run npm run build and fix errors. Stop and report with exact deploy steps.
```

**Owner steps:** push to GitHub → create Render web service (root `backend`) → set env vars → create Vercel project (root `frontend`) → set `NEXT_PUBLIC_API_URL` → set `ALLOWED_ORIGINS` on Render to the Vercel URL → redeploy.

**Done when:**
- [ ] Backend runs locally (`/health` returns ok)
- [ ] Designed frontend runs locally and the header budget pill shows the fake numbers from the backend
- [ ] `npm run build` passes
- [ ] Render live: `https://RENDER_URL/health` works
- [ ] Vercel live site shows the budget pill with backend numbers (**CORS works on the live site**)
- [ ] The two `curl` CORS tests from 04 §3 show the right `access-control-allow-origin`
- [ ] Logo, fonts and animations look the same live as locally
- [ ] `git ls-files frontend/src/lib` lists the lib files on GitHub

---

## Phase 2: Real stream client + run state machine (still no backend agent)

**Goal:** the Research page runs on the real SSE client code and the real state machine, tested against the mock stream. After this, Phase 7 is only "switch the source to the live API".

**Prompt:**
```
Do ONLY Phase 2 of docs/06-BUILD-PLAN.md. Read docs/05-FRONTEND-SPEC.md §3, §5, §6 and docs/01-ARCHITECTURE.md §6.
Implement lib/types.ts (all event types), lib/stream.ts (real fetch + ReadableStream parser with buffering for split chunks and AbortController), lib/clientId.ts, and the full run state machine (idle, waking, running, done, error, cancelled) driven by whichever source is active (real stream or mockStream). Add Cancel. Write a small test script (scripts/test_sse_parser) or a dev-only page that feeds the parser an event stream split at awkward places (mid-line, mid-JSON) and shows PASS/FAIL. Keep ?mock= working. Run npm run build.
```

**Done when:**
- [ ] Parser test passes with chunks split mid-line and mid-JSON
- [ ] `?mock=stream` run works through the real state machine (not special-cased UI code)
- [ ] Cancel stops the mock run and shows the cancelled message
- [ ] Leaving the page mid-run stops the stream (no console errors)
- [ ] Warning and error mock runs show the right banners
- [ ] `npm run build` passes

---

## Phase 3 — Database + real budget guard

**Goal:** Supabase tables, real counters, real `/api/budget`, real meter.

**Owner prep:** create a **new** Supabase project; paste `sql/schema.sql` into the SQL editor and run it; put URL + service role key in `backend/.env`.

**Prompt:**
```
Do ONLY Phase 3 of docs/06-BUILD-PLAN.md. Read docs/04-BACKEND-SPEC.md §4, §5, §9 (budget endpoint), §10.
Create sql/schema.sql exactly as specified. Implement db.py, budget.py (RunBudget with all methods), ratelimit.py and the real GET /api/budget. Use the America/Los_Angeles day for the daily counter and compute resets_at.
Write scripts/test_budget.py that: reads status, reserves 3 fake "gemini" calls and 2 tavily credits, prints before/after, then verifies reserve_llm_call refuses at the per-run cap and that "notes" is refused when only 1 call is left. It must clearly tell me whether the test passed. Then make sure the header BudgetPill shows the real numbers. npm run build.
```

**Done when:**
- [ ] Tables exist in Supabase (owner sees them in Table Editor)
- [ ] `scripts/test_budget.py` prints PASS
- [ ] `/api/budget` returns real numbers and `resets_at`
- [ ] Header budget pill shows real numbers; tooltip shows local reset time
- [ ] Setting `DAILY_GEMINI_BUDGET=3` makes deeper depths report `allowed: false`
- [ ] Reset test counters (owner deletes test rows in `usage_daily`)

---

## Phase 4 — Tools + Gemini wrapper

**Goal:** Tavily search/extract and Gemini calls, all behind the guard.

**Owner prep:** Tavily key and Gemini key (new AI Studio project) in `backend/.env`. In AI Studio check the **rate limits page** for your chosen model and set `DAILY_GEMINI_BUDGET` to a **safe fraction** (suggestion: about a third of the daily limit; DocuMind must not share this key/project).

**Prompt:**
```
Do ONLY Phase 4 of docs/06-BUILD-PLAN.md. Read docs/04-BACKEND-SPEC.md §6, §7 and docs/03-PROMPTS.md §0.
Implement agent/tools.py (web_search, read_pages, URL normalization/dedupe, domain helper) and agent/llm.py (call_structured, call_text, one retry on 429/5xx, budget reservation before every call). Check current docs for tavily-python and langchain-google-genai; don't use memory for APIs.
Write scripts/smoke_tools.py as specified. It must print budget numbers before and after so I can see the counters move.
```

**Done when:**
- [ ] `smoke_tools.py` returns real search results and extracted text
- [ ] A tiny Gemini call works and returns text
- [ ] Budget counters increased by exactly the expected amounts (1 search credit, 1 extract credit, 1 Gemini call)
- [ ] With a wrong Tavily key the script fails with a friendly message (no stack trace dump, no key printed)

---

## Phase 5 — The LangGraph agent (terminal only)

**Goal:** the full agent loop works from the command line, within limits.

**Prompt:**
```
Do ONLY Phase 5 of docs/06-BUILD-PLAN.md. Read docs/01-ARCHITECTURE.md §2–§5, docs/03-PROMPTS.md fully, docs/04-BACKEND-SPEC.md §8.
Implement agent/state.py, prompts.py (exact prompts from 03), nodes.py, graph.py and events.py. Include code-side validation and zero-call fallbacks from 03 §3–§5, citation cleanup and the code-built Sources section. Enforce max_rounds, per-run caps, recursion_limit and the timeout.
Write scripts/run_agent_cli.py "topic" quick|standard|deep that prints every event and ends with a summary table (Gemini calls, Tavily credits, seconds, rounds, number of sources cited).
```

**Done when:**
- [ ] Quick run finishes with ≤ 4 Gemini calls (typical 3) and a report with `[n]` citations
- [ ] Standard run ≤ 6 calls; Deep ≤ 8 calls
- [ ] Sources section lists only real, cited sources with real URLs
- [ ] No `[n]` in the report points to a missing source
- [ ] Forcing `DAILY_GEMINI_BUDGET` low mid-run (e.g. 2) produces the "stopped early" behaviour or a clean budget error
- [ ] Summary table matches what Supabase `usage_daily` shows

---

## Phase 6 — Streaming API + saving + history endpoints

**Prompt:**
```
Do ONLY Phase 6 of docs/06-BUILD-PLAN.md. Read docs/04-BACKEND-SPEC.md §8–§10 and docs/01-ARCHITECTURE.md §6.
Implement POST /api/research as an SSE stream, with validation, rate limits, preflight, report row creation and a finally-block that always updates the row. Add GET /api/reports, GET /api/reports/{id}, DELETE /api/reports/{id} with client_id checks. Send ping events every 15 seconds. Detect client disconnect and save status "cancelled".
Give me 3 curl commands to test: a quick run (streaming), the report list, and a bad-input request.
```

**Done when:**
- [ ] `curl -N` shows events arriving live, one by one (not all at the end)
- [ ] Row in `reports` ends with status `done` and stats filled
- [ ] Bad input returns 422 with a friendly message
- [ ] 6th run in an hour from the same IP returns 429 (test with `MAX_RUNS_PER_HOUR_PER_IP=2` locally)
- [ ] A second run with the same `client_id` while one is active returns `busy`
- [ ] Closing curl mid-run leaves status `cancelled`, not `running`
- [ ] Reports of one `client_id` are not visible to another

---

## Phase 7: Go live (connect the designed frontend to the real API)

**Prompt:**
```
Do ONLY Phase 7 of docs/06-BUILD-PLAN.md. Read docs/05-FRONTEND-SPEC.md §3-§8.
Switch the Research page from mockStream to the real startResearch when NEXT_PUBLIC_API_URL is set. Connect History (list, open, delete with confirm), /reports/[id], the BudgetPill (real polling plus usage events), disabled depths from /api/budget, and the budget-exhausted message. Keep ?mock= working for design checks. Do not change the design. Run npm run build.
```

**Done when:**
- [ ] Quick run locally: progress rows appear live; report appears; history updates
- [ ] Citation pills scroll to and highlight the right source
- [ ] Cancel stops the run; history shows "cancelled"
- [ ] Opening a saved report from history works; delete works
- [ ] Header budget pill updates during/after the run without page reload
- [ ] Disabled depths show the budget message
- [ ] Animations still smooth with real (uneven) event timing
- [ ] `npm run build` passes

---

## Phase 8 — Quality test + hardening

**Prompt:**
```
Do ONLY Phase 8 of docs/06-BUILD-PLAN.md.
1. Run these 5 topics at Standard depth via scripts/run_agent_cli.py and give me a table: topic | gemini calls | tavily credits | seconds | sources cited | any warnings: (a) a current-events topic, (b) a technical topic, (c) a very narrow topic, (d) a topic in Hindi, (e) a vague one-word topic.
2. Run the prompt-injection test from docs/03-PROMPTS.md §6.
3. Test failures: wrong Tavily key, wrong Gemini key, daily budget = 0, Tavily returning nothing (simulate), timeout set to 10 s. Each must give a friendly error event and a correctly saved row.
4. Fix anything found. Do not add features.
```

**Done when:**
- [ ] Table of 5 runs delivered (owner reads the reports and judges quality honestly)
- [ ] Injection test passes
- [ ] All 5 failure cases show friendly messages, no stack traces, no stuck `running` rows
- [ ] Average Standard run uses ≤ 4 Gemini calls (note real number for the README)
- [ ] Owner has read at least 2 reports and checked 5 citations against the real pages

---

## Phase 9 — Final deploy + live checks

**Prompt:**
```
Do ONLY Phase 9 of docs/06-BUILD-PLAN.md. Prepare the production config: confirm requirements.txt and package.json are pinned, .env.example files are complete, ALLOWED_ORIGINS instructions are clear. Then give me a live test checklist and the exact curl CORS commands for my real URLs. Run npm run build one last time.
```

**Owner steps:** push; confirm Render and Vercel redeploy; set production env vars (`APP_ENV=production`, budgets); run the live checks.

**Done when:**
- [ ] Live site loads, server wakes, meter shows real numbers
- [ ] A Quick run works end to end **on the live site**
- [ ] CORS curl tests pass for the live Vercel URL
- [ ] Budget counters in Supabase match what the UI shows
- [ ] Opened the site on a phone: header, mobile menu, strips and page transitions work
- [ ] Logo/favicon show correctly in the browser tab and when sharing the link
- [ ] No secrets in GitHub (search repo for `AIza`, `tvly-`, `service_role`)

---

## Phase 10 — Docs, demo video, portfolio

**Prompt:**
```
Do ONLY Phase 10 of docs/06-BUILD-PLAN.md. Write the project README.md for GitHub: one-line pitch, live demo link placeholder, screenshot placeholders, features, architecture diagram (mermaid, from 01 §2), the cost-control section (the 10 layers in short form), tech stack, how to run locally, environment variables table, "what I learned" section with placeholders for me to fill in, known limitations. Include 3 screenshots (Home, a live run, a finished report). Then write a 90-second demo video script and a short LinkedIn post draft. Use only facts that are true of the finished app.
```

**Done when:**
- [ ] GitHub README complete with real numbers from Phase 8
- [ ] Demo video recorded (script followed)
- [ ] Live link + repo link added to portfolio and resume

---

## Stretch ideas (only after Phase 10)

- Native Gemini function-calling variant, compare call counts to the current design (great interview story)
- Mini eval: 10 topics, automatic check that every `[n]` maps to a source and that cited pages contain the claimed numbers
- Export report as Markdown/PDF
- Optional demo access code to protect the budget
- Streaming the final report token by token
