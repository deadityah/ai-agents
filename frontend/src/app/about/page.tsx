"use client";

import Link from "next/link";
import { ArrowRight, Code2, Shield, EyeOff, Cpu, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/layout/GlassCard";
import { FaqAccordion } from "@/components/about/FaqAccordion";
import { siteConfig } from "@/lib/site";

interface TechItem {
  name: string;
  role: string;
  badge: string;
}

const techStack: TechItem[] = [
  { name: "Google Gemini", role: "Planning, structured notes, and synthesis", badge: "LLM" },
  { name: "Tavily AI", role: "Autonomous web search and clean text extraction", badge: "Search & Extract" },
  { name: "LangGraph", role: "Plan-act-reflect graph orchestration and state machine", badge: "Agent Framework" },
  { name: "FastAPI", role: "Asynchronous backend with live SSE streaming", badge: "Backend" },
  { name: "Supabase", role: "PostgreSQL database for reports and budget counters", badge: "Database" },
  { name: "Next.js & Tailwind", role: "Responsive App Router with Earth & Ink tokens", badge: "Frontend" },
];

export function AboutPage() {
  return (
    <div className="flex-1 flex flex-col items-center w-full px-4 sm:px-6 md:px-8 py-12 sm:py-20 max-w-[1200px] mx-auto">
      {/* ── Page Header ── */}
      <Reveal from="auto" className="w-full flex justify-center mb-16 sm:mb-24">
        <GlassCard className="text-center max-w-3xl w-full mx-auto p-8 sm:p-12">
          <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-3 px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block">
            About The Project
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink font-bold tracking-tight mb-6">
            Autonomous research, strictly bounded.
          </h1>
          <p className="text-ink-2 text-base sm:text-lg leading-relaxed">
            ResearchPilot is designed to prove production-grade agent engineering:
            combining iterative multi-step research with rigorous budget guards and cost controls.
          </p>
        </GlassCard>
      </Reveal>

      {/* ── Section 1: What it is (Alternating: Left Text, Right Visual) ── */}
      <section className="w-full mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <Reveal from="left" className="h-full">
            <GlassCard className="p-8 sm:p-10 h-full flex flex-col justify-center text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-2 block">
                01 · WHAT IT IS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-5">
                An autonomous AI research agent.
              </h2>
              <p className="text-ink-2 text-base leading-relaxed mb-4">
                When given a topic, standard LLMs tend to fabricate details or summarize outdated training weights.
                ResearchPilot takes a different approach: it behaves like a diligent research assistant.
              </p>
              <p className="text-ink-2 text-base leading-relaxed">
                It formulates sub-questions, executes targeted web searches using Tavily, reads and extracts
                verified text, takes cited notes, reflects on whether it has sufficient information, and composes
                a comprehensive report citing only verified, discovered URLs.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal from="right" className="h-full">
            <GlassCard className="p-8 sm:p-10 h-full text-left flex flex-col justify-center">
              <div className="w-10 h-10 rounded-xl bg-sand/60 flex items-center justify-center text-gold-deep mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">
                Plan-Act-Reflect Loop
              </h3>
              <p className="text-ink-2 text-sm leading-relaxed mb-4">
                Instead of unbounded ReAct loops that make 10–20 uncoordinated LLM calls, ResearchPilot batches
                tool choices into structured rounds. Each round executes multiple searches, reads top pages,
                and reflects in a single structured reasoning call.
              </p>
              <div className="p-3 rounded-lg bg-bg-soft/70 border border-glass-border font-mono text-xs text-ink-3">
                Result: 3–6 LLM calls per run vs. 15+ in traditional agents.
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ── Section 2: How the agent works (Alternating: Left Visual, Right Text) ── */}
      <section className="w-full mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <Reveal from="left" className="order-2 lg:order-1 h-full">
            <GlassCard className="p-8 sm:p-10 h-full text-left">
              <div className="w-10 h-10 rounded-xl bg-sand/60 flex items-center justify-center text-gold-deep mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                The 5 Core Graph Nodes
              </h3>
              <ol className="flex flex-col gap-3 font-mono text-xs text-ink-2">
                <li className="flex items-center justify-between p-2 rounded-lg bg-bg-soft/70 border border-glass-border">
                  <span>1. plan (Structured JSON)</span>
                  <span className="text-gold-deep">LLM Call 1</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-bg-soft/70 border border-glass-border">
                  <span>2. search (Tavily Search)</span>
                  <span className="text-ink-3">Tool (No LLM)</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-bg-soft/70 border border-glass-border">
                  <span>3. read (Tavily Extract)</span>
                  <span className="text-ink-3">Tool (No LLM)</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-bg-soft/70 border border-glass-border">
                  <span>4. notes (Evaluate &amp; Reflect)</span>
                  <span className="text-gold-deep">LLM Call 2</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-bg-soft/70 border border-glass-border">
                  <span>5. write (Markdown Report)</span>
                  <span className="text-gold-deep">LLM Call 3</span>
                </li>
              </ol>
            </GlassCard>
          </Reveal>

          <Reveal from="right" className="order-1 lg:order-2 text-left h-full">
            <GlassCard className="p-8 sm:p-10 h-full flex flex-col justify-center text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-2 block">
                02 · THE ARCHITECTURE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-5">
                LangGraph state machine.
              </h2>
              <p className="text-ink-2 text-base leading-relaxed mb-4">
                The agent is modeled as an explicit state graph. A shared state container tracks
                the topic, depth limits, discovered sources, sanitized extracts, and numbered notes.
              </p>
              <p className="text-ink-2 text-base leading-relaxed">
                If the agent discovers sufficient answers early, it routes directly to synthesis.
                If more investigation is needed, it loops back to execute follow-up queries until
                the round limit is reached.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ── Section 3: The Limits and Why (Alternating: Left Text, Right Visual) ── */}
      <section className="w-full mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <Reveal from="left" className="text-left h-full">
            <GlassCard className="p-8 sm:p-10 h-full flex flex-col justify-center text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-2 block">
                03 · COST CONTROL
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-5">
                The limits and why.
              </h2>
              <p className="text-ink-2 text-base leading-relaxed mb-4">
                Building autonomous agents without cost boundaries leads to runaway API bills or rate limits.
                ResearchPilot implements 10 distinct layers of protection:
              </p>
              <p className="text-ink-2 text-base leading-relaxed">
                Round limits, per-run Gemini caps, daily project-level budgets resetting at Pacific midnight,
                monthly Tavily credit limits, wall-clock timeouts, and IP rate limits ensure that the system
                runs reliably and economically.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal from="right" className="h-full">
            <GlassCard className="p-8 sm:p-10 h-full text-left flex flex-col justify-center">
              <div className="w-10 h-10 rounded-xl bg-sand/60 flex items-center justify-center text-gold-deep mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">
                Zero-Call Graceful Degradation
              </h3>
              <p className="text-ink-2 text-sm leading-relaxed mb-4">
                If the daily budget runs low mid-run, the agent reserves its final call strictly for writing
                the report with the evidence gathered so far. It never abandons the user with an empty error.
              </p>
              <div className="p-3 rounded-lg bg-sand/40 border border-glass-border font-mono text-xs text-ink-2">
                &ldquo;Every run has hard limits. When a limit is reached, ResearchPilot stops and tells you.&rdquo;
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ── Section 4: Privacy ── */}
      <section className="w-full mb-20 sm:mb-28">
        <Reveal from="auto">
          <GlassCard className="p-8 sm:p-12 text-left w-full">
            <div className="flex items-center gap-3 mb-4">
              <EyeOff className="w-6 h-6 text-gold-deep" />
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep">
                04 · PRIVACY &amp; DATA
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-4">
              Privacy and storage.
            </h2>
            <p className="text-ink-2 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
              Reports are saved only for this browser. There is no login, so don&apos;t enter private information.
            </p>
            <p className="text-ink-3 text-sm leading-relaxed max-w-3xl">
              Each browser generates a random client UUID stored in your local storage. Reports are indexed by
              this client ID so that in a public demo, your saved research history is visible only on your device.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      {/* ── Section 5: Tech Stack ── */}
      <section className="w-full mb-20 sm:mb-28 text-left">
        <Reveal from="auto">
          <GlassCard className="max-w-xl p-6 sm:p-8 text-left mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-2 block">
              05 · TECH STACK
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold">
              Technologies used.
            </h2>
          </GlassCard>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {techStack.map((tech, idx) => (
            <Reveal key={tech.name} from="auto" orderIndex={idx}>
              <GlassCard className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-bold text-ink">
                      {tech.name}
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sand text-ink-2 font-medium">
                      {tech.badge}
                    </span>
                  </div>
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {tech.role}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Section 6: FAQ Accordion ── */}
      <section className="w-full mb-20 sm:mb-28 text-left">
        <Reveal from="auto">
          <GlassCard className="max-w-xl p-6 sm:p-8 text-left mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-2 block">
              06 · FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold">
              Common questions.
            </h2>
          </GlassCard>
        </Reveal>

        <Reveal from="auto">
          <FaqAccordion />
        </Reveal>
      </section>

      {/* ── Section 7: Built by Creator ── */}
      <section className="w-full pt-8 pb-12 text-center flex flex-col items-center">
        <Reveal from="auto">
          <GlassCard className="max-w-2xl w-full mx-auto p-8 sm:p-10 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-3 block">
              CREATOR
            </span>
            <h2 className="font-display text-3xl text-ink font-bold mb-4">
              Built by {siteConfig.ownerName}.
            </h2>
            <p className="text-ink-2 text-sm sm:text-base max-w-md mx-auto mb-6">
              Demonstrating autonomous AI agents, tool loops, state machines, and cost controls with LangGraph.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-header text-on-header hover:bg-gold-light hover:text-ink transition-colors shadow-sm"
              >
                <span>Launch ResearchPilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {siteConfig.portfolioUrl && (
                <a
                  href={siteConfig.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-glass-border bg-bg-soft/70 text-ink hover:border-gold transition-colors"
                >
                  <span>Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-3" />
                </a>
              )}
              {siteConfig.githubUrl && (
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-glass-border bg-bg-soft/70 text-ink hover:border-gold transition-colors"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-3" />
                </a>
              )}
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </div>
  );
}

export default AboutPage;
