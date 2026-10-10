# ResearchPilot: Your Step-by-Step Guide

You give it a topic. An AI agent plans, searches the web, reads pages, takes notes and writes a cited report. You build it with Antigravity, one phase at a time.

**How to use this file:** do the steps in order and tick each box. Don't skip ahead.

---

## Part A: Accounts and keys (about 30 minutes)

- [ ] **A1. Tavily key.** Go to app.tavily.com, sign up (free, no card). Copy your API key. Free plan = 1,000 credits per month (1 search = 1 credit; reading 5 pages = 1 credit).
- [ ] **A2. Gemini key from a NEW project.** Go to Google AI Studio → create a **new project** → create an API key. Do NOT reuse DocuMind's key. Gemini limits are per project, so DocuMind and ResearchPilot would eat each other's quota.
- [ ] **A3. Check your Gemini limits.** In AI Studio open the rate-limits/usage page and note the **requests per day** for your model. Limits change often, so always check yours. Your daily budget for this app should be about **one third** of that number (the default in the kit is 80).
- [ ] **A4. New Supabase project** named `researchpilot`. Save the **Project URL** and the **service_role key** (Project Settings → API). The service_role key is secret. Never paste it in chat or in the frontend.
- [ ] **A5. New empty GitHub repo** named `researchpilot` (private is fine until it's ready).
- [ ] **A6. Render and Vercel** are already set up from DocuMind. You will create **new** services in them (not reuse DocuMind's).

Keep all keys in a private notes file for now. They only go into `.env` files and the Render/Vercel settings pages.

---

## Part B: Set up your project folder (15 minutes)

- [ ] **B1.** Create a folder named `researchpilot` on your PC.
- [ ] **B2.** Copy the `docs/` folder and this `README.md` into it.
- [ ] **B3.** Create these folders inside it and fill them:
  - `reference/logo/`: your logo image (PNG or SVG; transparent background is best; at least 512 px).
  - `reference/ui-addons/`: your UI add-ons. **Name each file so the name says what it is** (for example `animated-button.tsx`, `marquee-ticker.tsx`, `faq-accordion.tsx`). Antigravity decides where to use each one from its name, and shows you a table to approve first.
  - `reference/dot-background/`: the dot-background file(s) from DocuMind (only the behavior is reused; colors change).
- [ ] **B4.** Open the `researchpilot` folder in Antigravity.

---

## Part C: Build, one phase at a time

**The loop for every phase (0, then D1 to D3, then 1 to 10):**

1. Open `docs/06-BUILD-PLAN.md` and find the phase.
2. Copy the **Prompt for Antigravity** from that phase and paste it into Antigravity.
3. Wait for the report. If something is unclear, answer its question.
4. Do the testing steps it gives you.
5. Tick the **Done when** checklist **in that file** (you can edit it, or just keep score here).
6. Make sure `npm run build` passed (frontend phases).
7. Commit and push (ask Antigravity: *"commit with a clear message and push"*).
8. Only then start the next phase.

If a phase fails a checklist item, paste the exact error into Antigravity and say: *"Fix this. Do not start the next phase."*

### Phase tracker

- [ ] **Phase 0:** Prep and reference check
- **Design track (the website is designed first, with fake data):**
  - [ ] **Phase D1:** Colors, fonts, logo, black header with nav, footer, page transitions, add-on inventory (you approve the add-on table)
  - [ ] **Phase D2:** Home and About pages
  - [ ] **Phase D3:** Research, History and Report screens with mock data. **You say "design approved".**
- [ ] **Phase 1:** Backend skeleton, live deploy, **CORS test on the live site**
- [ ] **Phase 2:** Real stream client + run state machine (tested with the mock stream)
- [ ] **Phase 3:** Database and real budget guard
- [ ] **Phase 4:** Tools (Tavily) and Gemini wrapper
- [ ] **Phase 5:** The LangGraph agent in the terminal
- [ ] **Phase 6:** Streaming API, saving, history endpoints
- [ ] **Phase 7:** Live frontend
- [ ] **Phase 8:** Quality test and hardening
- [ ] **Phase 9:** Final deploy and live checks
- [ ] **Phase 10:** README, demo video, portfolio

---

## Part D: Where each key goes

| Key / setting | Local file | Live place |
|---------------|-----------|-----------|
| `GEMINI_API_KEY`, `TAVILY_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, budgets, `ALLOWED_ORIGINS` | `backend/.env` | Render → Environment |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Vercel → Settings → Environment Variables |

- [ ] `ALLOWED_ORIGINS` on Render = your exact Vercel URL, like `https://researchpilot-xyz.vercel.app` (no slash at the end), plus `http://localhost:3000` for local testing.
- [ ] `NEXT_PUBLIC_API_URL` on Vercel = your Render URL (https, no slash at the end).
- [ ] After changing any env var, **redeploy** that service.

---

## Part D2: The new look in 30 seconds

- **Colors:** warm beige / off-white page, light golden accents, black header and footer.
- **Fonts:** Fraunces (headings), DM Sans (text), Space Mono (small labels and numbers). Don't like them? In D1 say "swap the fonts to X" and Antigravity changes one file.
- **Navigation:** black header with Home · Research · History · About. The gold underline slides between links.
- **Motion:** pages slide left or right depending on where you navigate; sections slide in from alternating sides; text fades in and cross-fades when it changes; "How it works" scrolls sideways. Everything switches to plain fades if your device has "reduce motion" on.
- **Your inputs:** logo image + UI add-ons (see B3). Fill in your own GitHub/LinkedIn/portfolio links later in `frontend/src/lib/site.ts`.

---

## Part E: Your 5 safety rules (lessons from DocuMind)

- [ ] **CORS is tested on the live site in Phase 1**, not at the end.
- [ ] Before every push, `git ls-files frontend/src/lib` must list files (the `lib` folder must never be ignored).
- [ ] `npm run build` passes before every push.
- [ ] Keys only in `.env` files and the Render/Vercel settings. Never in GitHub. Never in chat.
- [ ] Never ask Antigravity to remove the budget limits "just to test". Lower them instead.
- [ ] Don't let Antigravity install extra packages for add-ons without telling you first.

---

## Part F: Good to know

- **Your Gemini quota resets at midnight Pacific time.** That is about **12:30 PM IST** while the US is on daylight time, and **1:30 PM IST** after the US clocks change in early November. The meter in the app shows the exact time in your timezone.
- **Render free tier sleeps.** The first visit after a while can take up to a minute. The app shows a "waking up" message. That's normal.
- **Estimated cost per run:** Quick ≈ 3 AI calls, Standard ≈ 3–4, Deep ≈ 4–6. Hard caps: 4 / 6 / 8. After Phase 8 you'll have the real averages. Put them in your GitHub README.
- **Reports are saved per browser** (no login). The app tells users not to enter private info.
- **If you hit the daily AI budget,** the app says so and disables runs until the reset. You can still read saved reports.

---

## Part G: Finishing

- [ ] Record the demo video (Phase 10 gives you a 90-second script).
- [ ] Add the live link and repo link to your portfolio, resume and LinkedIn.
- [ ] Write 3 sentences in your own words for "What I learned" (what is an agent, what is a tool, why limits matter). If you can explain the agent graph out loud, you can answer interview questions about it.

---

## If something breaks

Paste this into Antigravity:

> Read docs/00-START-HERE.md. Here is the exact error: [paste it]. Explain in plain English what caused it, fix it without changing the budget limits, and tell me how to verify the fix. Do not start the next phase.
"# ai-agents" 
