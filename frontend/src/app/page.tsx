"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";
import { GlassCard } from "@/components/layout/GlassCard";
import { StepFlowAddon } from "@/components/addons/step-flow";
import { LivePreviewCard } from "@/components/home/LivePreviewCard";
import { DepthCards } from "@/components/home/DepthCards";
import { LimitsSection } from "@/components/home/LimitsSection";
import { CtaBand } from "@/components/home/CtaBand";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center w-full overflow-hidden">
      {/* ── 1. Hero Section (Frosted-glass card on top of starfield) ── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center flex flex-col items-center">
        <Reveal from="auto">
          <GlassCard className="w-full max-w-4xl mx-auto p-8 sm:p-12 md:p-14 text-center flex flex-col items-center">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-sand/40 px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-deep" />
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep">
                AI RESEARCH AGENT
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink mb-6 max-w-3xl mx-auto leading-[1.08]">
              Ask anything.
              <br />
              <span className="text-ink-2 font-normal">Get a researched, cited report.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-ink-2 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              ResearchPilot plans its own research, searches the web, reads the pages, takes notes, and writes a report with numbered sources, within strict limits.
            </p>

            {/* Static example topic link */}
            <Link
              href={`/research?topic=${encodeURIComponent(siteConfig.exampleTopics[0])}`}
              className="group mb-10 px-5 py-2.5 rounded-full bg-bg-soft/70 border border-glass-border hover:border-gold/50 hover:bg-sand/40 transition-all inline-flex items-center gap-2 text-sm sm:text-base text-ink"
            >
              <span className="text-ink-3">Try:</span>
              <span className="font-medium text-ink">
                &ldquo;{siteConfig.exampleTopics[0]}&rdquo;
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-deep ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-header text-on-header font-semibold text-sm sm:text-base hover:bg-gold-deep hover:text-white transition-all duration-200 shadow-md"
              >
                <span>Start research</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-gold-light" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-glass-border bg-bg-soft/60 text-ink text-sm sm:text-base font-medium hover:bg-sand/40 transition-all duration-200"
              >
                See how it works
              </a>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* ── 2. Watch It Work (Two equal frosted-glass panels, 50/50 stretch) ── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch w-full">
          {/* Left Column (enters from left, frosted-glass panel with vertically centered text) */}
          <Reveal from="left" className="h-full w-full flex flex-col">
            <GlassCard className="w-full h-full p-6 sm:p-8 flex flex-col justify-center text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-3 px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block w-fit">
                AI Research Agent
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight mb-4 leading-tight">
                Watch research happen live.
              </h2>
              <p className="text-ink-2 text-base sm:text-lg leading-relaxed mb-6">
                Type any question and watch the agent break it down into focused sub-questions,
                search Tavily across authoritative sources, read pages, extract notes, and assemble
                a referenced report in real time.
              </p>

              {/* 4 Static Example-Topic Chips */}
              <div className="flex flex-col gap-2.5 my-2">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-3">
                  Try an example topic:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {siteConfig.exampleTopics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/research?topic=${encodeURIComponent(topic)}`}
                      className="group p-3 rounded-xl border border-glass-border bg-bg-soft/60 hover:bg-sand/40 hover:border-gold/50 transition-all text-xs sm:text-sm text-ink text-left flex items-start justify-between gap-2 shadow-xs"
                    >
                      <span className="leading-snug line-clamp-2 font-medium">
                        &ldquo;{topic}&rdquo;
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold-deep flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/research"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-header text-on-header font-semibold text-sm sm:text-base hover:bg-gold-light hover:text-ink transition-all duration-200 shadow-md w-fit"
                >
                  <span>Try a live run</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </GlassCard>
          </Reveal>

          {/* Right Column (enters from right, equal frosted-glass panel) */}
          <Reveal from="right" className="h-full w-full flex flex-col">
            <LivePreviewCard />
          </Reveal>
        </div>
      </section>

      {/* ── 3. How It Works (Frosted-glass header + StepFlow card) ── */}
      <section
        id="how-it-works"
        className="w-full bg-sand/35 py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-y border-glass-border"
      >
        <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center">
          <Reveal from="auto" className="w-full flex justify-center">
            <GlassCard className="max-w-3xl w-full p-6 sm:p-8 text-center mb-8 sm:mb-10">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-3 px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block">
                How It Works
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink font-bold tracking-tight mb-4">
                Five steps to a cited report.
              </h2>
              <p className="text-ink-2 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                The agent works through an iterative loop of planning, searching, reading, reflecting, and synthesizing.
              </p>
            </GlassCard>
          </Reveal>

          {/* Interactive Step Flow (5 steps with detail and visual preview) */}
          <Reveal from="right" className="w-full max-w-5xl">
            <StepFlowAddon />
          </Reveal>
        </div>
      </section>

      {/* ── 4. Three Depths ── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
        <Reveal from="auto" className="w-full flex justify-center">
          <GlassCard className="max-w-2xl w-full p-6 sm:p-8 text-center mb-10 sm:mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-3 px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block">
              Depth Presets
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink font-bold tracking-tight mb-4">
              Three depths for every task.
            </h2>
            <p className="text-ink-2 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Choose how deeply the agent searches and synthesizes based on your time and needs.
            </p>
          </GlassCard>
        </Reveal>

        <DepthCards />
      </section>

      {/* ── 5. Built With Limits ── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <LimitsSection />
      </section>

      {/* ── 6. Black CTA Band (Solid per rules) ── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-16">
        <CtaBand />
      </section>
    </div>
  );
}
