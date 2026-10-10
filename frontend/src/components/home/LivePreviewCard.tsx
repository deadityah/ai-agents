"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Sparkles, Search, BookOpen, FileText, Check, Globe } from "lucide-react";
import { motionTokens } from "@/lib/motionTokens";

interface TimelineStep {
  icon: typeof Search;
  title: string;
  detail: string;
  counter: string;
  badge?: string;
  queries?: string[];
  sources?: string[];
  noteSnippet?: string;
}

const completedSteps: TimelineStep[] = [
  {
    icon: Sparkles,
    title: "1. Planning research",
    detail: "Formulated 3 sub-questions: recovery rates, hydrometallurgy vs pyrometallurgy, and industrial economics.",
    counter: "LLM Call 1",
    badge: "Complete",
  },
  {
    icon: Search,
    title: "2. Autonomous web search",
    detail: "Ran 3 targeted search queries across 15 web sources via Tavily.",
    counter: "Tavily Search",
    badge: "8 Sources",
    queries: [
      "battery recycling pyrometallurgical vs hydrometallurgical",
      "direct cathode recycling recovery efficiency 2024",
      "commercial scale LFP recycling economics",
    ],
    sources: ["nature.com", "sciencedirect.com", "energy.gov", "iea.org"],
  },
  {
    icon: BookOpen,
    title: "3. Reading source pages",
    detail: "Extracted and sanitized 5 authoritative technical papers and industry reports.",
    counter: "Tavily Extract",
    badge: "Sanitized",
    sources: [
      "nature.com/articles/s41560-023",
      "energy.gov/eere/vehicles/articles",
      "sciencedirect.com/science/article",
    ],
  },
  {
    icon: CheckCircle2,
    title: "4. Synthesizing evidence & notes",
    detail: "Recorded 8 verified facts with source citations [1]–[5]. Determined evidence is sufficient to answer all questions.",
    counter: "LLM Call 2",
    badge: "Sufficient",
    noteSnippet:
      "Hydrometallurgy achieves >95% lithium recovery at lower energy than pyrometallurgy; direct recycling preserves NMC crystal structures.",
  },
  {
    icon: FileText,
    title: "5. Composing report",
    detail: "Synthesized a 740-word referenced report with numbered citations and verified source links.",
    counter: "LLM Call 3",
    badge: "Final Report",
  },
];

export function LivePreviewCard({ className = "" }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.09,
        delayChildren: prefersReduced ? 0 : 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.15 : 0.4,
        ease: motionTokens.ease,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerVariants}
      className={`w-full h-full rounded-2xl border border-glass-border shadow-glass p-6 sm:p-8 text-left flex flex-col justify-between ${className}`}
      style={{
        backgroundColor: "var(--glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Header bar: Finished snapshot state */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-ok flex items-center justify-center">
            <Check className="w-2 h-2 text-white stroke-[3]" />
          </span>
          <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
            Finished Run Snapshot
          </span>
        </div>
        <span className="font-mono text-[11px] text-ink-3">
          Topic: &ldquo;Battery recycling&rdquo;
        </span>
      </div>

      {/* Finished timeline rows */}
      <div className="flex flex-col gap-3">
        {completedSteps.map((step) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              variants={rowVariants}
              className="p-3.5 rounded-xl border border-glass-border/70 bg-bg-soft/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sand/60 text-gold-deep flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-ink">
                      {step.title}
                    </h4>
                    <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                      {step.detail}
                    </p>

                    {/* Sample Search Queries */}
                    {step.queries && (
                      <div className="mt-2 flex flex-col gap-1">
                        <span className="font-mono text-[10px] text-ink-3 uppercase tracking-wider">
                          Sample Queries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.queries.map((q) => (
                            <span
                              key={q}
                              className="font-mono text-[10px] text-ink-2 bg-sand/40 border border-glass-border px-2 py-0.5 rounded"
                            >
                              &ldquo;{q}&rdquo;
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sample Website Domains */}
                    {step.sources && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <Globe className="w-3 h-3 text-ink-3 flex-shrink-0" />
                        <span className="font-mono text-[10px] text-ink-3">
                          Sources:
                        </span>
                        {step.sources.map((domain) => (
                          <span
                            key={domain}
                            className="font-mono text-[10px] text-gold-deep bg-sand/40 border border-glass-border px-1.5 py-0.2 rounded"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Note Snippet */}
                    {step.noteSnippet && (
                      <div className="mt-2 p-2 rounded-lg bg-sand/25 border border-glass-border/60 text-[11px] text-ink-2 italic font-sans leading-snug">
                        &ldquo;{step.noteSnippet}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-mono text-[10px] text-ink-3">
                    {step.counter}
                  </span>
                  {step.badge && (
                    <span className="mt-1 font-mono text-[9px] px-1.5 py-0.5 rounded bg-ok/10 text-ok border border-ok/20 font-medium">
                      {step.badge}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer metadata: static summary */}
      <div className="mt-4 pt-3 border-t border-glass-border/60 flex items-center justify-between text-[11px] text-ink-3 font-mono">
        <span className="flex items-center gap-1.5 text-ok">
          <Check className="w-3.5 h-3.5 text-ok" />
          <span>Completed in 18.4s</span>
        </span>
        <span>Depth: Standard · 3 AI Calls · 8 Searches</span>
      </div>
    </motion.div>
  );
}
