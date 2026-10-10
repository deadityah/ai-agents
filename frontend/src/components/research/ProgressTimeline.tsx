"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Search,
  BookOpen,
  FileText,
  FileCheck2,
} from "lucide-react";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { SubQuestionChips } from "@/components/research/SubQuestionChips";
import { NoteItem, SourceItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export type StepStatus = "pending" | "active" | "complete" | "warning" | "error";

export interface TimelineStepItem {
  id: string;
  stepNumber: string;
  title: string;
  detail: string;
  status: StepStatus;
  round?: number;
  subQuestions?: string[];
  queries?: string[];
  sources?: SourceItem[];
  notes?: NoteItem[];
  noteSnippet?: string;
  isRoundGroup?: boolean;
}

interface ProgressTimelineProps {
  steps: TimelineStepItem[];
  className?: string;
}

export function ProgressTimeline({ steps, className }: ProgressTimelineProps) {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const prefersReduced = useReducedMotion();

  const toggleNotes = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "active":
        return <Loader2 className="w-4 h-4 text-gold-deep animate-spin" />;
      case "complete":
        return <CheckCircle2 className="w-4 h-4 text-ok" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warn" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-bad" />;
      case "pending":
      default:
        return <Circle className="w-4 h-4 text-ink-3/40" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, idx) => {
        const isFromRight = step.isRoundGroup;
        const initialX = prefersReduced ? 0 : isFromRight ? 24 : -24;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: initialX }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: prefersReduced ? 0.15 : 0.4,
              ease: [0.22, 1, 0.36, 1],
              delay: prefersReduced ? 0 : idx * 0.04,
            }}
            className={cn(
              "p-4 sm:p-5 rounded-xl border transition-all text-left",
              step.status === "active"
                ? "border-gold/60 bg-sand/40 shadow-xs ring-1 ring-gold/30"
                : "border-glass-border/70 bg-bg-soft/60"
            )}
          >
            {/* Top row: Status icon, Title, Step counter */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center flex-shrink-0 mt-0.5">
                  {renderStatusIcon(step.status)}
                </div>
                <h4 className="font-display text-[17px] sm:text-[18px] font-bold text-ink leading-snug">
                  {step.title}
                </h4>
              </div>
              <span className="font-mono text-[11px] text-ink-3 flex-shrink-0 uppercase tracking-wider">
                {step.stepNumber}
              </span>
            </div>

            {/* Sub-question chips if available */}
            {step.subQuestions && step.subQuestions.length > 0 && (
              <SubQuestionChips questions={step.subQuestions} />
            )}

            {/* Detail line with FadeSwap */}
            <div className="mt-2 text-xs sm:text-sm text-ink-2 font-sans pl-6.5 leading-relaxed">
              <FadeSwap>{step.detail}</FadeSwap>
            </div>

            {/* Query items list if search_done */}
            {step.queries && step.queries.length > 0 && (
              <div className="mt-2.5 pl-6.5 space-y-1 font-mono text-[11px] text-ink-3">
                {step.queries.map((q, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <Search className="w-3 h-3 text-gold-deep flex-shrink-0" />
                    <span className="truncate">&ldquo;{q}&rdquo;</span>
                  </div>
                ))}
              </div>
            )}

            {/* Expandable Notes toggle */}
            {step.notes && step.notes.length > 0 && (
              <div className="mt-3 pl-6.5">
                <button
                  type="button"
                  onClick={() => toggleNotes(step.id)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-gold-deep hover:underline cursor-pointer"
                >
                  <span>
                    {expandedNotes[step.id] ? "Hide notes" : `Show ${step.notes.length} cited notes`}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      expandedNotes[step.id] ? "rotate-180" : ""
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expandedNotes[step.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden space-y-2 mt-2 pt-2 border-t border-glass-border/50"
                    >
                      {step.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-lg bg-sand/30 border border-glass-border/40 text-xs text-ink-2"
                        >
                          <span className="leading-relaxed">{note.text}</span>
                          <span className="ml-1.5 font-mono text-[10px] text-gold-deep font-semibold">
                            {note.source_ids.map((sid) => `[${sid}]`).join("")}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default ProgressTimeline;
