"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubQuestionChipsProps {
  questions: string[];
  className?: string;
}

export function SubQuestionChips({ questions, className }: SubQuestionChipsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className={cn("relative w-full my-3", className)}>
      {/* Edge fade mask on right */}
      <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-bg-soft/70 to-transparent z-10 hidden sm:block" />

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x snap-mandatory">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="snap-start flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-glass-border bg-sand/35 text-xs text-ink max-w-[280px] sm:max-w-[340px]"
          >
            <span className="font-mono text-[10px] text-gold-deep font-bold px-1.5 py-0.5 rounded bg-sand/60">
              Q{idx + 1}
            </span>
            <span className="line-clamp-1 text-ink-2 font-medium">{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubQuestionChips;
