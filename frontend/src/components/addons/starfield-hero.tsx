"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { InteractiveStarfieldHero } from "@/components/starfield-hero";
import { designTokens } from "@/lib/designTokens";
import { motionTokens } from "@/lib/motionTokens";

export function HeroStarfieldAddon() {
  const [particleCount, setParticleCount] = useState(160);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Fewer particles on mobile for 60fps performance (02 §4.3)
    if (window.innerWidth < 768) {
      setParticleCount(75);
    }
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-header border border-white/10 shadow-2xl">
      <InteractiveStarfieldHero
        particleColor={designTokens.particles.particleColor}
        activeColor={designTokens.particles.activeColor}
        particleCount={prefersReduced ? 30 : particleCount}
        speed={prefersReduced ? 0.05 : 0.4}
        className="min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] bg-header"
      >
        <motion.div
          className="max-w-3xl"
          initial={prefersReduced ? false : "hidden"}
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: prefersReduced ? 0 : 0.1 },
            },
          }}
        >
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: motionTokens.ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-gold-light">
              AI RESEARCH AGENT
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: motionTokens.ease }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]"
          >
            Ask anything.
            <br />
            <span className="text-white/55">Get a researched, cited report.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: motionTokens.ease }}
            className="font-sans text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed mb-10"
          >
            ResearchPilot plans its own research, searches the web, reads the pages, takes notes, and writes a report with numbered sources, within strict limits.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: motionTokens.ease }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 rounded-xl bg-gold text-ink font-semibold px-7 py-3.5 text-sm sm:text-base hover:bg-gold-light shadow-[0_0_24px_rgba(230,175,46,0.25)] hover:shadow-[0_0_32px_rgba(230,175,46,0.45)] transition-all duration-200"
            >
              <span>Start research</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm sm:text-base font-medium text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all duration-200"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>
      </InteractiveStarfieldHero>
    </div>
  );
}
