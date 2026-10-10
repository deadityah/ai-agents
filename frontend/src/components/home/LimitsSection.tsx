"use client";

import { Reveal } from "@/components/motion/Reveal";
import { ShieldCheck, Lock, Activity, CheckCircle2 } from "lucide-react";

export function LimitsSection() {
  return (
    <Reveal from="auto" className="w-full">
      <div
        className="w-full rounded-2xl border border-glass-border shadow-glass p-6 sm:p-8 lg:p-12 text-left"
        style={{
          backgroundColor: "var(--glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          {/* Left Column: Explanatory Copy */}
          <div className="flex flex-col text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep mb-3 px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block w-fit">
              Cost Control &amp; Safety
            </span>

            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight mb-4 leading-tight">
              Built with limits.
            </h2>

            <p className="text-ink-2 text-base sm:text-lg leading-relaxed mb-6">
              Every run has hard limits: a maximum number of research rounds, a cap on AI
              calls, and a daily budget. When a limit is reached, ResearchPilot stops and
              tells you.
            </p>

            <ul className="flex flex-col gap-3 font-sans text-sm text-ink-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ok flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink font-medium">Enforced round caps:</strong> Depth limits cannot be bypassed by prompts.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ok flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink font-medium">Guaranteed write reserve:</strong> The final Gemini call is always reserved for composing the final report.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ok flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink font-medium">Pacific midnight reset:</strong> Daily meter tracks Google&apos;s real quota cycle.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ok flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink font-medium">Wall-clock timeout:</strong> Strict 150-second limit guards against unresponsive network requests.
                </span>
              </li>
            </ul>
          </div>

          {/* Right Column: Glass Mock Budget Meter */}
          <div className="p-6 sm:p-7 rounded-xl border border-glass-border/70 bg-bg-soft/60 shadow-xs text-left">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-glass-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-deep" />
                <h3 className="font-display text-lg font-bold text-ink">
                  Live Budget Guard
                </h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-ok/10 text-ok border border-ok/20 font-medium">
                Operational
              </span>
            </div>

            {/* Primary Meter: Daily Gemini Quota */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-ink-2 font-medium">
                  DAILY GEMINI CALLS
                </span>
                <span className="font-mono font-bold text-ink">
                  12 / 80 calls (15%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-sand/60 overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: "15%" }}
                />
              </div>
              <p className="font-mono text-[11px] text-ink-3 mt-1.5">
                Quota resets at 12:00 AM America/Los_Angeles (Pacific Time)
              </p>
            </div>

            {/* Secondary Meter: Monthly Tavily Search */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-ink-2 font-medium">
                  MONTHLY TAVILY CREDITS
                </span>
                <span className="font-mono font-bold text-ink">
                  42 / 900 credits (5%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-sand/60 overflow-hidden">
                <div
                  className="h-full bg-gold/70 rounded-full transition-all duration-500"
                  style={{ width: "5%" }}
                />
              </div>
              <p className="font-mono text-[11px] text-ink-3 mt-1.5">
                1 credit per web search · 1 credit per 5 extracted pages
              </p>
            </div>

            {/* Rate Limit Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-glass-border/60">
              <div className="p-3 rounded-xl bg-bg-soft/70 border border-glass-border">
                <span className="font-mono text-[10px] text-ink-3 block">
                  IP RATE LIMIT
                </span>
                <span className="font-mono text-xs font-semibold text-ink">
                  Max 5 runs / hour
                </span>
              </div>
              <div className="p-3 rounded-xl bg-bg-soft/70 border border-glass-border">
                <span className="font-mono text-[10px] text-ink-3 block">
                  CONCURRENCY
                </span>
                <span className="font-mono text-xs font-semibold text-ink">
                  1 run per client
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
