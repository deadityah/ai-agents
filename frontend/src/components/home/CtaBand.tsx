"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBand() {
  return (
    <section className="w-full bg-header text-on-header py-16 sm:py-24 px-4 sm:px-8 border-y border-white/10 rounded-3xl my-12 overflow-hidden shadow-2xl relative">
      <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
        <Reveal from="auto">
          <span className="font-mono text-xs uppercase tracking-widest text-gold-light mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 inline-block">
            Start Exploring
          </span>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-on-header font-bold tracking-tight mb-6">
            Give it a topic.
          </h2>

          <p className="text-on-header-2 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            ResearchPilot breaks down your query, searches Tavily, extracts evidence, and writes a cited report within strict boundaries.
          </p>

          <Link
            href="/research"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-light text-ink font-semibold text-base hover:bg-gold transition-all duration-200 shadow-lg hover:shadow-gold/20"
          >
            <span>Start research</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
