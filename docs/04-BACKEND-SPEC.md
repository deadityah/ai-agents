# 04 — BACKEND SPEC (FastAPI + LangGraph + Supabase)

## 1. Packages (verify current versions and APIs from official docs, then pin)

`fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`, `langgraph`, `langchain-core`, `langchain-google-genai`, `tavily-python`, `supabase`, `httpx`, `python-dotenv`. No `sse-starlette` needed: use FastAPI `StreamingResponse`.

Pin Python via `backend/.python-version` (use the version you tested; also set `PYTHON_VERSION` on Render).

## 2. Config (`config.py`)

Pydantic settings reading all variables in 00-START-HERE §6. Rules:
- `ALLOWED_ORIGINS`: split on comma, strip whitespace, strip trailing `/`, drop empties. **Log the parsed list at startup.**
- Fail fast at startup with a clear message if `GEMINI_API_KEY`, `TAVILY_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` are missing (but never print their values).

## 3. CORS (`main.py`)

```
allow_origins   = parsed ALLOWED_ORIGINS
allow_methods   = ["GET", "POST", "DELETE", "OPTIONS"]
allow_headers   = ["Content-Type"]
allow_credentials = False
```
Response headers for SSE: `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`, `X-Accel-Buffering: no`.

**CORS test commands (used in Phase 1 and Phase 9; replace URLs):**
```
curl -i -X OPTIONS https://RENDER_URL/api/budget -H "Origin: https://VERCEL_URL" -H "Access-Control-Request-Method: GET"
curl -i https://RENDER_URL/api/budget -H "Origin: https://VERCEL_URL"
```
Both must include `access-control-allow-origin: https://VERCEL_URL`. Also test from the live site in the browser (open DevTools → Network).

## 4. Database (`sql/schema.sql`, run once in Supabase SQL editor)

```sql
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  topic text not null,
  depth text not null check (depth in ('quick','standard','deep')),
  status text not null default 'running'
    check (status in ('running','done','failed','failed_budget','cancelled')),
  plan jsonb,
  notes jsonb,
  sources jsonb,
  report_md text,
  warnings jsonb default '[]'::jsonb,
  stats jsonb default '{}'::jsonb,   -- {gemini_calls, tavily_credits, rounds, duration_ms}
  error text,
  created_at timestamptz not null default now()
);
create index if not exists reports_client_created on reports (client_id, created_at desc);

create table if not exists usage_daily (
  day date primary key,               -- America/Los_Angeles date
  gemini_calls integer not null default 0
);

create table if not exists usage_monthly (
  month text primary key,             -- 'YYYY-MM' (UTC)
  tavily_credits integer not null default 0
);

alter table reports enable row level security;
alter table usage_daily enable row level security;
alter table usage_monthly enable row level security;
-- No policies on purpose: only the service-role key (backend) can read/write.

-- Atomic counters (avoid read-then-write races)
create or replace function increment_gemini(p_day date, p_n integer)
returns integer language sql as $$
  insert into usage_daily(day, gemini_calls) values (p_day, p_n)
  on conflict (day) do update set gemini_calls = usage_daily.gemini_calls + p_n
  returning gemini_calls;
$$;

create or replace function increment_tavily(p_month text, p_n integer)
returns integer language sql as $$
  insert into usage_monthly(month, tavily_credits) values (p_month, p_n)
  on conflict (month) do update set tavily_credits = usage_monthly.tavily_credits + p_n
  returning tavily_credits;
$$;
```

## 5. Budget guard (`budget.py`) — the most important file

**Class `RunBudget`** created per run with: `depth limits`, `run_gemini_calls = 0`, `run_tavily_credits = 0`.

| Method | Behaviour |
|--------|-----------|
| `get_daily_status()` | Returns `{used, limit, remaining, resets_at}`. `day` = today in `America/Los_Angeles`; `resets_at` = next local midnight in that zone, as ISO-8601 with offset |
| `get_monthly_status()` | `{used, limit, remaining, month}` |
| `preflight(depth)` | Raises `BudgetError("daily_budget")` if `remaining < hard_cap[depth]`; raises `BudgetError("tavily_budget")` if monthly remaining < worst-case credits[depth] |
| `reserve_llm_call(kind)` | `kind` ∈ plan / notes / write. (1) If `run_gemini_calls >= hard_cap` → `BudgetError("run_cap")`. (2) If `kind == "notes"` and `run_gemini_calls >= hard_cap - 1` → `BudgetError("run_cap")` (last call reserved for write). (3) Check daily remaining ≥ 1 else `BudgetError("daily_budget")`. (4) Atomically increment daily via `increment_gemini`, increment `run_gemini_calls`. Count **before** making the call (failed calls still use quota) |
| `reserve_tavily(credits)` | Same pattern against the monthly cap; increments `run_tavily_credits` |
| `snapshot()` | Returns the numbers used in the SSE `usage` event |

**Worst-case Tavily credits** for preflight: Quick 4, Standard 8, Deep 20.

`BudgetError` carries `code` and a friendly message. The router (`graph.py`) catches it:
- from a `notes` reservation → go to `write` (emit `warning`: "Stopped early to stay within today's AI budget.")
- from `write` reservation or `plan` → end run with `error`.

## 6. Tools (`agent/tools.py`)

Two typed functions with docstrings (so they can be exposed as LangChain tools later):

**`web_search(query) -> list[Result]`**
- Tavily `search`, `search_depth="basic"` (1 credit), `max_results=5`, `include_answer=False`, `include_raw_content=False`.
- Reserve 1 credit **before** each call. Run the round's queries **concurrently** (`asyncio.gather`), each reserved first.
- Result: title, url, domain (from URL), snippet (Tavily `content`), score.
- Deduplicate by normalized URL (lowercase host, strip `www.`, strip trailing `/`, strip tracking params `utm_*`). Assign new integer ids to new URLs only.
- Skip obviously useless domains (configurable small blocklist: e.g. social login pages). Keep it tiny.

**`read_pages(urls) -> dict[url, text]`**
- Tavily `extract`, format markdown, basic depth. Reserve `ceil(len(urls)/5)` credits **before**.
- Truncate each page to `page_char_limit`. Failed URLs: skip silently, fall back to the search snippet.
- Pick URLs in the `read` node: unread sources from the **current round**, sorted by Tavily `score`, max one per domain first, take top `pages_read_per_round`.

All Tavily calls: timeout 20 s; on failure return empty results and emit `warning`; never crash the run.

## 7. Gemini wrapper (`agent/llm.py`)

- `call_structured(kind, system, user, schema, temperature)` and `call_text(kind, system, user, temperature)`.
- Both: (1) `budget.reserve_llm_call(kind)`; (2) call Gemini with `GEMINI_MODEL`, timeout 40 s; (3) on 429/500/503 wait 2 s and **retry once** (retry also reserves a call); (4) parse/validate; return parsed object.
- Emit a `usage` event after each call.
- Never log prompts that contain page text at INFO level (log call kind, duration, token counts if available).

## 8. Graph (`agent/graph.py`, `nodes.py`)

Nodes as in 01-ARCHITECTURE §2. Routing function after `notes`:

```
if budget_error_on_notes or round >= max_rounds or enough or not follow_up_queries:
    → write
else:
    round += 1; queries = follow_up_queries; → search
```
- Compile with `recursion_limit = 3*max_rounds + 6`.
- Run with `astream(..., stream_mode="updates")` (or custom stream writer) and translate node outputs to SSE events (01 §6). Emit one `search_done` per query and a `reading` event before extraction.
- Wrap the whole run in `asyncio.timeout(RUN_TIMEOUT_SECONDS)`. On timeout: if notes exist and ≥1 call left → emit `warning` and try `write` once; else `error` code `timeout`.
- Check `request.is_disconnected()` between nodes; if the user left or pressed Cancel, stop, save `status="cancelled"` with what exists.

## 9. API

### `GET /health` → `{"status":"ok"}`

### `GET /api/budget` → 
```json
{"gemini":{"used":12,"limit":80,"remaining":68,"resets_at":"2026-10-06T00:00:00-07:00"},
 "tavily":{"used":34,"limit":900,"remaining":866,"month":"2026-10"},
 "depths":{"quick":{"gemini_cap":4,"allowed":true},"standard":{"gemini_cap":6,"allowed":true},"deep":{"gemini_cap":8,"allowed":false}}}
```
`allowed` = the preflight would pass.

### `POST /api/research` (SSE)
Body: `{ "topic": str (5–300 chars, trimmed), "depth": "quick"|"standard"|"deep", "client_id": str (UUID format) }`
Steps: validate → rate limit (IP, one active run per client) → preflight → insert `reports` row (`running`) → stream events → on finish update row (report, notes, sources, stats, warnings, status) → `done`.
Errors **before** streaming start return normal JSON with status: `422` bad input, `429` rate limit or budget (`{"code","message"}`). Errors **during** streaming are `error` events.
Always update the row in a `finally` block so a crash never leaves a run stuck in `running`.

### `GET /api/reports?client_id=…` → list `[ {id, topic, depth, status, created_at} ]` newest first, max 50.
### `GET /api/reports/{id}?client_id=…` → full row (404 if client_id doesn't match).
### `DELETE /api/reports/{id}?client_id=…` → `{ "ok": true }`.

### Error codes (used in `error` events and 429 bodies)
`bad_input`, `rate_limited`, `busy` (run already active), `daily_budget`, `tavily_budget`, `run_cap`, `no_results`, `llm_error`, `timeout`, `internal`. Messages are plain English; never include stack traces or keys.

## 10. Rate limiting (`ratelimit.py`)

In-memory (acceptable for a free-tier demo; resets on restart): sliding window per IP (`X-Forwarded-For` first value when behind Render's proxy), and a set of active `client_id`s.

## 11. Logging

Python `logging`, one line per node: run id, node, duration, gemini_calls so far, tavily_credits so far. No secrets. No full page text.

## 12. Scripts (for the owner to run in Phases 4–5)

- `scripts/smoke_tools.py`: 1 Tavily search, 1 Tavily extract, 1 tiny Gemini call; prints counts and the budget numbers before/after.
- `scripts/run_agent_cli.py "topic" quick`: runs the full agent without the web server, prints every event, ends with a table: Gemini calls used, Tavily credits used, seconds, report length.

## 13. Render deploy

- Root directory: `backend`. Build: `pip install -r requirements.txt`. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Health check path: `/health`.
- Set all env vars in Render. `ALLOWED_ORIGINS` includes the Vercel production URL exactly (scheme + host, no trailing slash). Add the Vercel preview URL only if needed.
