"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap, Compass, Layers } from "lucide-react";
import { motionTokens } from "@/lib/motionTokens";

interface DepthItem {
  name: string;
  tagline: string;
  estimate: string;
  bestFor: string;
  rounds: string;
  icon: typeof Zap;
  featured?: boolean;
}

const depths: DepthItem[] = [
  {
    name: "Quick",
    tagline: "A fast overview.",
    estimate: "~3 AI calls · ~4 searches",
    bestFor: "Best for rapid summaries, definitions, and high-level questions.",
    rounds: "1 round · 300–450 words",
    icon: Zap,
  },
  {
    name: "Standard",
    tagline: "Balanced detail.",
    estimate: "~4 AI calls · ~8 searches",
    bestFor: "Best for comparisons, technology tradeoffs, and multi-angle analysis.",
    rounds: "2 rounds · 500–800 words",
    icon: Compass,
    featured: true,
  },
  {
    name: "Deep",
    tagline: "More rounds, more sources.",
    estimate: "~6 AI calls · ~20 searches",
    bestFor: "Best for extensive explorations, deep technical dives, and research synthesis.",
    rounds: "Up to 4 rounds · 900–1300 words",
    icon: Layers,
  },
];

export function DepthCards() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {depths.map((depth, idx) => {
        const Icon = depth.icon;

        // Reveal animations: left from left, center scale/fade, right from right
        let initialAnim: Record<string, number> = { opacity: 0 };
        if (!prefersReduced) {
          if (idx === 0) initialAnim = { opacity: 0, x: -36 };
          else if (idx === 1) initialAnim = { opacity: 0, scale: 0.97 };
          else if (idx === 2) initialAnim = { opacity: 0, x: 36 };
        }

        return (
          <motion.div
            key={depth.name}
            initial={initialAnim}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: prefersReduced ? 0.2 : motionTokens.durations.slow,
              delay: idx * 0.08,
              ease: motionTokens.ease,
            }}
            className={`relative p-7 rounded-2xl border shadow-glass transition-all duration-300 hover:translate-x-1 ${
              depth.featured
                ? "border-gold ring-1 ring-gold/30"
                : "border-glass-border"
            }`}
            style={{
              backgroundColor: "var(--glass)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {depth.featured && (
              <span className="absolute -top-3 right-6 font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gold text-header shadow-sm">
                Recommended
              </span>
            )}

            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  depth.featured ? "bg-gold/20 text-gold-deep" : "bg-sand text-ink-2"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs text-ink-3">
                {depth.rounds}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-ink mb-1">
              {depth.name}
            </h3>

            <p className="font-sans text-sm font-semibold text-gold-deep mb-3">
              {depth.tagline}
            </p>

            <div className="py-2.5 px-3 rounded-lg bg-sand/40 border border-glass-border font-mono text-xs text-ink-2 mb-4">
              {depth.estimate}
            </div>

            <p className="text-xs text-ink-2 leading-relaxed">
              {depth.bestFor}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
