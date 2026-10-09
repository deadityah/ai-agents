# 02 — DESIGN SYSTEM ("Earth & Ink")

**Look in one line:** warm beige / off-white / light-gold pages, a **black header with navigation**, frosted-glass cards, expressive fonts, and motion that moves **sideways (left ↔ right)** with **fading text**, not only up and down.

> **What changed from DocuMind:** ResearchPilot has its own identity. The pure-white page, the dot background and the Playwrite/Space Grotesk/Titillium fonts are **retired**. The tokens in this file are the single source of truth for **colors and fonts**.
>
> **Role of `reference/`:** it holds only the **logo** and the **Nexus UI add-ons** (including the `starfield-hero` background). If an add-on has hard-coded colors or fonts, **re-skin it with the tokens below**. Colors and fonts here always win.

---

## 1. Inputs the owner provides (put them in `reference/`)

| Folder | Content | Used for |
|--------|---------|----------|
| `reference/logo/` | The logo image (PNG or SVG; transparent background preferred; ideally ≥ 512 px) | Header, footer, favicon, social preview |
| `reference/ui-addons/` | **Everything from Nexus UI, including the background.** One folder per add-on, named for what it is (e.g. `starfield-hero/` = the site background). Each folder holds the usage `.tsx` file exactly as Nexus UI gave it, plus `install.txt` with the `npx shadcn@latest add …` line and the `npm install …` line | Background: §4.3. Others: §10 |

### Logo handling rules
1. Copy to `frontend/public/brand/` (keep the original, plus a header-size version if needed). Use `next/image`, `priority` in the header, fixed height 36 px (32 px on mobile), correct `alt="ResearchPilot logo"`.
2. **The header is black.** Check the logo on black. If it is dark or has dark text, either use/make a light version, or place it inside an off-white rounded badge (36×36 px, radius 10 px). Tell the owner which you chose and why.
3. Generate favicon/app icon (`app/icon.png`, `apple-icon.png`) from the logo.
4. Next to the logo show the wordmark "ResearchPilot" in the display font (hide the wordmark on very small screens if space is tight, never the logo).

---

## 2. Color tokens

Define as CSS variables in `globals.css` **and** map them in the Tailwind theme. **No hex values outside this table.**

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#F4EEE2` | Page background (warm beige/off-white) |
| `--bg-soft` | `#FAF6EE` | Lighter surfaces, inputs |
| `--sand` | `#E8DCC4` | Section bands, chips, track backgrounds |
| `--gold-light` | `#E6CF9C` | Light golden highlights, hover fills, header CTA |
| `--gold` | `#C9A24D` | Accent lines, active nav indicator, progress fills |
| `--gold-deep` | `#8A6420` | Gold used as **text** or focus ring on light backgrounds (contrast ≈ 4.7:1) |
| `--ink` | `#1B1814` | Primary text on light |
| `--ink-2` | `rgba(27,24,20,0.76)` | Secondary text |
| `--ink-3` | `rgba(27,24,20,0.62)` | Muted text (minimum allowed; don't go lighter) |
| `--header` | `#121110` | Header, footer, dark bands, primary buttons |
| `--on-header` | `#F4EEE2` | Text on black |
| `--on-header-2` | `rgba(244,238,226,0.70)` | Secondary text on black |
| `--glass` | `rgba(250,246,238,0.62)` | Glass card fill |
| `--glass-border` | `rgba(90,65,25,0.14)` | Glass border |
| `--glass-shadow` | `0 10px 30px rgba(60,40,10,0.07)` | Card shadow |
| `--ok` / `--warn` / `--bad` | `#5B7B3A` / `#B7791F` / `#A94438` | Tiny status dots, status text, banners (olive / amber / brick) |

**Contrast rule:** body text ≥ 4.5:1 on its background. Verify `--ink-3` on `--bg` and gold text on black/beige with a contrast checker and report the numbers.

**Usage balance:** ~70 % beige/off-white, ~20 % black (header, footer, one dark band, primary buttons), ~10 % gold. Gold is an accent, never a large fill except the single CTA band button and the header CTA.

---

## 3. Typography

Load with `next/font/google` in **one file** `src/lib/fonts.ts` so the owner can swap fonts by editing one place.

| Role | Font | Where |
|------|------|-------|
| **Display** | **Fraunces** (variable; enable `opsz`, `SOFT` axes; weight 400–600; use italic for emphasized words) | Hero h1, section h2/h3, report headings, wordmark, big numbers |
| **Body / UI** | **DM Sans** (400, 500, 700) | Paragraphs, nav links, buttons, inputs, report text |
| **Labels / data** | **Space Mono** (400, 700) | Eyebrow labels, step counters, budget numbers, source numbers `[1]`, tiny meta text |

Scale (desktop / mobile):
- Hero h1: `clamp(2.5rem, 6vw, 4.5rem)` · line-height 1.05 · letter-spacing -0.02em · weight 500
- h2: `clamp(1.75rem, 3.5vw, 2.75rem)` · h3: 1.375rem
- Body 1rem / 1.65 · Report body 1.0625rem / 1.75, max line width 70 characters
- Eyebrow label: Space Mono 0.75rem, uppercase, letter-spacing 0.12em, color `--gold-deep`
- Emphasis in headings: a single word in *Fraunces italic* colored `--gold-deep`

**Alternate pairings (only if the owner asks):** Display: *Playfair Display*, *Young Serif*, *Instrument Serif*. Body: *Manrope*, *Instrument Sans*. Labels: *JetBrains Mono*.

---

## 4. Surfaces and components

### 4.1 Page and bands
- Page background `--bg`, with the animated background add-on (§4.3) behind everything.
- **Bands** (section backgrounds) alternate: transparent (background visible) → `--sand` at 55 % → transparent → one `--header` black CTA band near the bottom.
- Footer is `--header` black (matches the header, bookends the page).

### 4.2 Header + navigation bar (BLACK) — required on every page
```
┌──────────────────────────────────────────────────────────────────────────┐
│ [logo] ResearchPilot     Home  Research  History  About   (12/80) [Start] │  ← #121110
└──────────────────────────────────────────────────────────────────────────┘
```
- `position: sticky; top: 0; z-index: 50;` height 64 px (56 px mobile), background `--header`.
- **Left:** logo + wordmark (Fraunces 20 px, `--on-header`). Click → `/`.
- **Nav links:** Home · Research · History · About. DM Sans 15 px, 500 weight. Default `--on-header-2`; hover `--on-header`; **active** = `--gold-light` text.
- **Active indicator:** a 2 px `--gold` underline that **slides horizontally** from the old link to the new one (shared layout animation, 350 ms). This is the first of the sideways motions.
- **Right:** `BudgetPill` (Space Mono "AI calls 12/80" + a 40 px gold progress bar on a dark track; amber when ≥ 80 %, brick when 100 %; tooltip "Resets at {local time}") and a **"Start research"** button (gold-light fill, `--ink` text; hidden on `/research`).
- **Scroll state:** after scrolling > 8 px add a 1 px bottom border `rgba(244,238,226,0.10)`. No height change, no hiding on scroll.
- **Mobile (< 768 px):** logo (+ wordmark if it fits), compact budget pill, hamburger. The menu is a full-height black panel that **slides in from the RIGHT** (350 ms); links (Fraunces 28 px) **fade in one after another** (60 ms stagger); Escape or tap-outside closes it (slides back right). Trap focus while open.
- "Skip to content" link as the first focusable element.
- Use the matching add-on from `reference/ui-addons/` for the menu/nav if one exists (see §10), re-skinned.

### 4.3 Background (Nexus UI add-on: `starfield-hero`)
There is **no dot background**. The site background is the `starfield-hero` add-on in `reference/ui-addons/starfield-hero/` (an interactive starfield whose particles react to the cursor). Other background add-ons the owner adds later (named accordingly, e.g. `...-background`) follow the same rules.

- **`SiteBackground` component** (in `layout.tsx`, behind all content): renders the approved background add-on. If no background add-on is approved/available, it renders nothing and the page is plain `--bg`.
- **Placement decision (made in the D1 inventory, with screenshots):** `starfield-hero` is a *hero* component (it also draws a title, subtitle and two buttons). Antigravity checks its props:
  - If the title/subtitle/buttons are optional → use it as a **fixed full-screen background** behind every page (`position: fixed; inset: 0; z-index: -1`).
  - If not optional → use it as the **Home hero** only (full-width section with our copy), and keep other pages plain `--bg`.
  - A starfield is designed for dark surfaces. Test it on the beige page and on a black band; show the owner both screenshots and recommend one (the owner decides).
- **Colors** passed as props come from `src/lib/designTokens.ts` (02 §10.1), never from the sample (the sample's orange `#f59e0b` is not part of our palette).
- **Cursor interaction must never block clicks:** the canvas has `pointer-events: none`; listen to the pointer on `window` if the add-on needs it.
- **Performance:** fewer particles on mobile (suggest ≤ 80 vs 180 on desktop), cap `devicePixelRatio`, pause when the tab is hidden, no jank while typing in the form.
- **Reduced motion and touch:** `prefers-reduced-motion` → static or very slow particles (`speed` near 0, no interaction).
- **Readability:** text sits on GlassCards or on solid bands. Plain text directly on the background must meet 4.5:1 contrast; if not, lower particle opacity or move the text into a card (don't make cards opaque).
- **Only one animated background is visible at a time.**

### 4.4 GlassCard
Fill `--glass`, `backdrop-filter: blur(14px)` (+ `-webkit-`), border `1px solid var(--glass-border)`, shadow `--glass-shadow`, radius 16 px, padding 20–28 px. Hover (interactive cards only): border darkens slightly and card shifts **4 px horizontally toward its content direction** (not up), 300 ms. No gradients, no glow.

### 4.5 Buttons
- **Primary:** `--header` fill, `--on-header` text, radius 12 px, height 46 px, DM Sans 600. Hover: fill transitions to `--gold-light` and text to `--ink` (250 ms); an arrow icon nudges 4 px to the right.
- **On dark backgrounds / header CTA:** `--gold-light` fill with `--ink` text; hover `--gold`.
- **Secondary:** glass fill + border; hover border `--gold`.
- Disabled: 40 % opacity, `cursor: not-allowed`. Focus ring (every interactive element): `2px solid var(--gold-deep)`, 2 px offset (on black surfaces use `--gold-light`).
- Button label changes (e.g. "Start research" → "Researching…") use **FadeSwap** (§5.4).

### 4.6 Inputs
`--bg-soft` fill, 1 px `--glass-border`, radius 12 px; focus: border `--gold-deep` + ring. Character counter in Space Mono.

### 4.7 Depth selector (Quick / Standard / Deep)
Three glass cards in a row. Selected: 1.5 px `--ink` border + a small gold dot. Each shows an estimate line in Space Mono ("~3 AI calls · ~4 searches"). Disabled (no budget): 40 % opacity + tooltip. Switching selection slides a gold highlight **horizontally** between the cards (shared layout animation).

### 4.8 Progress timeline (live run)
GlassCard with vertical rows: status icon (hollow circle / spinner / check / triangle), title (Fraunces 18 px), detail line (DM Sans, `--ink-3`), step counter in Space Mono. New rows **slide in from the left** with fade; a new *round* group slides in from the **right**. Sub-question chips sit in a **horizontally scrollable row** (snap, edge fades). Detail text updates use **FadeSwap**.

### 4.9 Report view
Wide GlassCard. h2 in Fraunces; body DM Sans 17 px / 1.75. Citation `[n]` = small pill in Space Mono (`--sand` fill, `--gold-deep` text); hover/click scrolls to and highlights the source row with a gold left border (slide-in 200 ms). Sections **fade in** one after another (120 ms stagger) when the report first appears. Sources list: numbered rows, domain in Space Mono, title in DM Sans.

### 4.10 Banners
Slim glass strip: icon + one sentence. Info (waking server), warning (stopped early), error (with "Try again"). Text fades in (FadeText). Colors from `--ok/--warn/--bad`.

### 4.11 Footer
Black band: logo + wordmark left; links (Home, Research, History, About, GitHub, LinkedIn) center; small print right ("Reports are saved in this browser. Don't enter private information."). All text `--on-header-2`; links hover to `--gold-light`.

---

## 5. Motion system

**Library:** `framer-motion` (required by the Nexus UI add-ons, so it is the one animation library for the whole site; do not also install the renamed `motion` package). CSS transitions for simple hovers. `lucide-react` for icons.

### 5.1 Tokens
| Name | Value |
|------|-------|
| `--dur-fast` | 150 ms |
| `--dur-base` | 300 ms |
| `--dur-slow` | 600–700 ms (reveals) |
| `--dur-page` | 450 ms enter / 250 ms exit |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (smooth, soft landing) for everything unless stated |
| Slide distance | 48 px desktop / 24 px mobile |
| Stagger | 60–120 ms |

**Rules:** animate only `transform` and `opacity` (plus short `color/background/border` transitions). Never animate `width/height/top/left` on large areas. No animation longer than 800 ms. Never block interaction while animating.

### 5.2 Left/right page transitions
- Page order: **Home (0) → Research (1) → History (2) → About (3)**. `/reports/[id]` counts as a child of History (index 2).
- Moving to a higher index: new page **enters from the right** (x: +48 → 0, opacity 0 → 1, 450 ms) and the old page exits to the left (x: 0 → −32, fade, 250 ms). Lower index: mirrored.
- Header and footer **never** animate during page change. Scroll position resets to top.
- Implement in `app/template.tsx` (or equivalent) with a `PageTransition` component and `lib/navOrder.ts` for direction.
- **Fallback (allowed and expected if needed):** exit animations with the Next.js App Router can be unreliable. If so, use **enter-only** animation (still left/right by direction), and note this in your report. Never let the transition cause a blank flash or double scroll bars.

### 5.3 Scroll reveals (sideways first)
Component `Reveal` (`from: "left" | "right" | "auto"`):
- `auto` alternates by order: 1st block from the left, 2nd from the right, and so on.
- Animate x ±48 px → 0 and opacity 0 → 1, `--dur-slow`, once per element, triggers when ~15 % visible (`whileInView`, `viewport={{ once: true, margin: "-10%" }}`).
- Groups (e.g. 3 depth cards) use stagger: left card from left, right card from right, center card fades in with a slight scale 0.97 → 1.
- Two-column sections: text column and visual column come from **opposite sides**.
- A little vertical movement is fine for small items, but **no section may use only upward reveals**.

### 5.4 Fade text
- `FadeText`: text block fades in (opacity 0 → 1 + 8 px horizontal slide) over 600 ms. Option `byWord` (40 ms word stagger) for hero headline and section headings only (max ~12 words).
- `FadeSwap`: cross-fades when its text/content changes (`AnimatePresence mode="wait"`; out 200 ms, in 350 ms; direction ±12 px sideways). Used for: hero rotating example topics (changes every 3.5 s, pauses on hover/focus and when tab hidden), progress step detail text, button labels, banner messages, budget numbers.
- Streaming/live data never re-animates already visible rows.

### 5.5 Horizontal strip (`HorizontalStrip`)
For "How it works" (5 steps) and the sub-question chips.
- CSS `scroll-snap-type: x mandatory`, `overflow-x: auto`, gap 20 px, hidden scrollbar (but still scrollable by touch, trackpad, shift+wheel, drag, and keyboard).
- Cards 320 px wide (80 vw on mobile). Edge fade masks (24 px) show there is more content.
- Prev/next arrow buttons (aria-labels) that scroll by one card with smooth behavior; progress dots below, active dot slides sideways.
- A hint label "Scroll sideways →" (Space Mono, FadeText) that disappears after the first scroll.
- **Do not hijack vertical scrolling** (no scroll-jacking/pinned horizontal scroll). Vertical wheel keeps scrolling the page.

### 5.6 Other motion
- Nav underline slide (§4.2), mobile menu from right (§4.2), depth highlight slide (§4.7), timeline rows (§4.8), citation highlight (§4.9).
- Skeleton loaders: a soft light sweep moving **left to right** across `--sand` blocks (1.4 s loop).
- Hover on cards: 4 px horizontal shift (§4.4). Hover on links: underline grows from left to right.

### 5.7 Reduced motion and performance
- `prefers-reduced-motion: reduce` → no slides, no word stagger, no marquee/strip auto-motion; only 150 ms opacity fades; background static; rotating hero text stops on the first topic.
- At most **one** attention-grabbing effect per viewport (an add-on's flashy effect counts).
- Mobile: halve slide distance, no `byWord` stagger.
- Test: no layout shift while animating; 60 fps scroll in a Chrome profile on desktop; no jank on a mid-range phone width emulation.

---

## 6. Layout and pages (blueprints)

Max content width 1200 px; side padding 20 px (mobile) / 32 px (desktop). Sections have 80–120 px vertical spacing (48–72 mobile).

### 6.1 Home `/`
1. **Hero**: the `starfield-hero` add-on (the animated background) with our copy: title "Ask anything.\nGet a researched, cited report.", subtitle = hero sub, primary CTA "Start research" → `/research`, secondary CTA "See how it works" → `#how-it-works`. Particle colors from tokens (§4.3).
2. **Watch it work** (two columns, opposite sides): *Left (from left):* eyebrow "AI RESEARCH AGENT", h2, short paragraph, a line "Try: **{rotating example topic}**" using FadeSwap. *Right (from right):* a glass "live run preview" card (static mock of the progress timeline with gentle sequential row fade-ins on a loop).
3. **How it works** (`sand` band, id `how-it-works`): eyebrow "HOW IT WORKS", h2, `HorizontalStrip` with 5 cards: **Plan → Search → Read → Take notes → Write report**. Each card: Space Mono number, Fraunces title, one sentence, small icon.
4. **Three depths** (cards reveal: left / center / right): Quick, Standard, Deep with estimates and "best for" lines.
5. **Built with limits** (two columns, opposite sides): text about hard limits (rounds, AI-call caps, daily budget, per-run time limit) + a glass mock of the budget meter.
6. **CTA band** (black): h2 "Give it a topic.", gold button "Start research".
7. Footer.

### 6.2 Research `/research` (the app)
Two columns ≥ 1024 px: left (360 px, enters from left) = "New research" card (topic, example chips, depth selector, Start, public-demo note). Right (enters from right) = run view (empty state → progress timeline → report). Mobile: single column. Under the form a small link "View history →".

### 6.3 History `/history`
Page heading + count. List of glass rows (topic, depth pill, status dot, relative date, delete). Rows fade in with a left-to-right stagger. Empty state with illustration slot + "Start your first research" button. `/reports/[id]` uses the same layout with a "← Back to history" link and the report view.

### 6.4 About `/about`
Sections alternating left/right: What it is · How the agent works (short, links to the five steps) · The limits and why · Privacy (reports are saved in this browser, no login, don't enter private info) · Tech used (text list: Gemini, Tavily, LangGraph, FastAPI, Next.js, Supabase) · **FAQ** (accordion; height animates smoothly, answer text fades in) · "Built by {ownerName}" with links from `lib/site.ts` (owner fills GitHub/LinkedIn/portfolio).

### 6.5 Copy deck (use exactly, owner edits later)
| Place | Text |
|-------|------|
| Hero title (starfield-hero, `\n` after the first sentence) | Ask anything. / Get a researched, cited report. |
| Hero sub | ResearchPilot plans its own research, searches the web, reads the pages, takes notes, and writes a report with numbered sources, within strict limits. |
| Example topics (rotate, also used as chips) | "How do heat pumps compare with gas furnaces?" · "What is retrieval-augmented generation and when should I use it?" · "Pros and cons of 4-day work weeks" · "Latest approaches to battery recycling" |
| Steps | Plan: "It breaks your topic into questions." · Search: "It runs focused web searches." · Read: "It opens the best pages." · Take notes: "It records facts with source numbers and checks if it knows enough." · Write: "It writes the report and lists only the sources it used." |
| Depths | Quick: "A fast overview." · Standard: "Balanced detail." · Deep: "More rounds, more sources." |
| Limits section | "Every run has hard limits: a maximum number of research rounds, a cap on AI calls, and a daily budget. When a limit is reached, ResearchPilot stops and tells you." |
| CTA band | "Give it a topic." |
| FAQ | **Is it free?** "The demo is free to use within a daily budget." · **Are my reports private?** "Reports are saved only for this browser. There is no login, so don't enter private information." · **Can it be wrong?** "Yes. Check the sources linked in every report." · **Why did it stop early?** "To stay within the daily AI budget or the per-run limits." · **Which AI does it use?** "Google Gemini for reasoning and Tavily for web search." |

---

## 7. Responsive
- Breakpoints: 375 / 768 / 1024 / 1280. Test all four.
- Touch targets ≥ 44 px. Header collapses at < 768 px. Strips and chips scroll horizontally on small screens.
- No horizontal page scroll anywhere (only inside strips/tables/code).

## 8. Accessibility
- Landmarks: `header`, `nav` (aria-label "Main"), `main`, `footer`. Current page link has `aria-current="page"`.
- Live progress container `aria-live="polite"`.
- Every icon button has `aria-label`. All animations respect reduced motion. Keyboard: full navigation, visible focus rings, Esc closes menus, Enter in topic box starts the run (Shift+Enter = newline).
- Rotating hero text must be pausable and not the only place the example topics appear (they're also chips on `/research`).

## 9. Copy tone
Calm, plain English, confident, no hype, no emojis. Short sentences.

---

## 10. UI add-ons: how to use them

The owner's add-on files live in `reference/ui-addons/`; **the file name says what it is.**

**Step 1: inventory (no integration yet).** List every add-on: file → what it is (from the name and code) → required packages → any hard-coded colors/fonts → license header if any. Then **propose a placement table** and **stop for the owner's approval** before using any add-on.

**Default placement heuristics (by name):**
| If the name suggests… | Use it for |
|-----------------------|-----------|
| button / cta | Primary CTAs (hero, CTA band, Start) |
| card / tilt / spotlight | Depth cards, "how it works" cards, history rows |
| nav / menu / dock / tabs | Header navigation or mobile menu, depth selector |
| text / typewriter / reveal / shimmer | Hero headline or section eyebrows (max one) |
| marquee / ticker / logos | A single strip, e.g. "Sources it reads" on Home |
| carousel / slider / scroller | "How it works" `HorizontalStrip` |
| accordion / faq | About FAQ |
| loader / spinner / progress | Timeline step icon, button loading state |
| background / starfield / grid / particles | Site or hero background per §4.3 (only one animated background at a time) |
| cursor | Skip unless owner explicitly wants it |

**Integration rules:**
1. Put add-ons in `src/components/addons/`. Keep their original file names.
2. **Re-skin** with design tokens (§2), fonts (§3) and motion tokens (§5). No hard-coded colors left.
3. Respect reduced motion and keyboard access; fix accessibility problems you find.
4. **Pre-approved packages:** `framer-motion`, `lucide-react`. Ask before installing anything else.
5. Don't use an add-on just to use it. Skipped add-ons are fine; say which and why.
6. Max one flashy effect per viewport.

---

### 10.1 Nexus UI add-ons (shadcn registry): exact procedure

Each Nexus UI add-on arrives as three things; here is what each one is for:

| What the owner pastes | What it is | What you do with it |
|---|---|---|
| `npx shadcn@latest add @nexus-labs/<name>` (from `install.txt`) | Downloads the component's source code into the project | Run it (once per approved add-on) from `frontend/` |
| `npm install framer-motion lucide-react` | Libraries the component needs | Run once; skip packages already installed |
| Usage example `.tsx` (e.g. `EmberStormHero`, from the add-on folder) | A small wrapper showing how to place the component and which **props** (title, colors, speed…) it accepts | Save as a file in `src/components/addons/`, then adapt it (below) |

**One-time setup (Phase D1):** run `npx shadcn@latest init` in `frontend/`. Ask the owner about any choice you are unsure of; use the `@/*` import alias so `@/components/...` works. If `add @nexus-labs/...` says the registry is unknown, follow the Nexus UI documentation to register `@nexus-labs` in `components.json` (check the current docs; don't guess).

**Protect the design tokens:** `shadcn init` writes its own CSS variables (`--background`, `--foreground`, `--primary`, `--border`…) into `globals.css`. Keep **our tokens (§2) as the source of truth** and map shadcn's variables to them (e.g. `--background` → `--bg`, `--primary` → `--header`, `--foreground` → `--ink`). Do not let shadcn's default grey/white theme override ours.

**Placement of files:** the installed component stays exactly where shadcn puts it (for example `src/components/starfield-hero.tsx`). **Do not move it** (imports use `@/components/...`). Only the **wrapper/usage file** goes in `src/components/addons/`.

**Adapting the usage example:**
1. Replace placeholder copy with our copy deck (§6.5). Example for the Home hero: title `"Ask anything.\nGet a researched, cited report."`, subtitle = hero sub, `primaryCTA = { label: "Start research", href: "/research" }`, `secondaryCTA = { label: "See how it works", href: "#how-it-works" }`. Remove irrelevant labels like "See pricing".
2. **Colors passed as props** (e.g. `particleColor="#f59e0b"`) must come from the tokens, not from the example. Put them in one file `src/lib/designTokens.ts` (the only place besides `globals.css` where hex values are allowed, kept in sync with §2) or read CSS variables at runtime. On our light beige page use dark/gold-deep particles (e.g. gold-deep for `particleColor`, ink for `activeColor`), then judge visually; if a component only looks right on a dark background, put it in a black band (like the CTA band) and tell the owner.
3. Check the component on mobile, with keyboard, and with `prefers-reduced-motion` (reduce particles/speed or render static). Keep it from blocking clicks on the page.
4. **Background rule:** see §4.3. Only one animated background is visible at a time. In the inventory table show where the background will be used (every page, or Home hero only) with screenshots, and let the owner decide.

## 11. Design QA checklist (used by phases D1–D3)

- [ ] Header is black, sticky, logo visible on black, active link gold, underline slides sideways
- [ ] Palette matches tokens; no hex values outside the token file
- [ ] Fonts: Fraunces / DM Sans / Space Mono load with no layout jump (`next/font`)
- [ ] Page changes slide left or right by nav order; header/footer stay still
- [ ] Every page has at least two sideways reveals; no page uses only upward reveals
- [ ] Hero topic text and button labels cross-fade
- [ ] Strip works with touch, trackpad, keyboard and arrows; vertical scroll is never hijacked
- [ ] Reduced-motion mode verified
- [ ] Contrast numbers reported for `--ink-3` on `--bg` and gold text on black
- [ ] Screenshots at 375 / 768 / 1280 px for every page
- [ ] `npm run build` passes
