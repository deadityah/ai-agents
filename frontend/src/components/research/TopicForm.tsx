"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, XCircle } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { DepthSelector, DepthOption } from "@/components/research/DepthSelector";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { siteConfig } from "@/lib/site";
import { Depth } from "@/lib/types";

interface TopicFormProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  depth: Depth;
  onDepthChange: (depth: Depth) => void;
  isRunning: boolean;
  isWaking?: boolean;
  onStart: () => void;
  onCancel: () => void;
  depthOptions?: DepthOption[];
  budgetExhausted?: boolean;
  budgetResetTime?: string;
  className?: string;
}

export function TopicForm({
  topic,
  onTopicChange,
  depth,
  onDepthChange,
  isRunning,
  isWaking = false,
  onStart,
  onCancel,
  depthOptions,
  budgetExhausted = false,
  budgetResetTime,
  className,
}: TopicFormProps) {
  const isValid = topic.trim().length >= 5 && !budgetExhausted && !isWaking;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isValid && !isRunning && !isWaking) {
        onStart();
      }
    }
  };

  return (
    <GlassCard className={`p-6 sm:p-7 text-left w-full ${className}`}>
      <h2 className="font-display text-xl font-bold text-ink mb-1">
        Topic &amp; Configuration
      </h2>
      <p className="text-xs text-ink-3 mb-5">
        Enter a subject, comparison, or specific inquiry.
      </p>

      {/* Topic Textarea */}
      <div className="flex flex-col gap-1.5 mb-5">
        <label htmlFor="topic-input" className="font-mono text-xs text-ink-2 font-medium">
          Research Topic
        </label>
        <textarea
          id="topic-input"
          rows={4}
          disabled={isRunning}
          value={topic}
          onChange={(e) => onTopicChange(e.target.value.slice(0, 300))}
          onKeyDown={handleKeyDown}
          placeholder="What do you want researched?"
          className="w-full p-3.5 rounded-xl border border-glass-border bg-bg-soft/80 text-ink placeholder:text-ink-3/70 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none font-sans disabled:opacity-60"
        />
        <div className="flex justify-between items-center text-[11px] text-ink-3 font-mono mt-0.5">
          <span>Minimum 5 characters (Enter to start)</span>
          <span className={topic.length >= 280 ? "text-warn font-semibold" : ""}>
            {topic.length}/300
          </span>
        </div>
      </div>

      {/* Example Topic Chips */}
      <div className="mb-6">
        <span className="font-mono text-[11px] text-ink-3 block mb-2 uppercase tracking-wider">
          Or pick an example:
        </span>
        <div className="flex flex-col gap-2">
          {siteConfig.exampleTopics.map((example) => (
            <button
              key={example}
              type="button"
              disabled={isRunning}
              onClick={() => onTopicChange(example)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 disabled:opacity-50 cursor-pointer ${
                topic === example
                  ? "border-gold bg-sand/50 text-ink font-medium shadow-xs"
                  : "border-glass-border/70 bg-bg-soft/50 text-ink-2 hover:bg-sand/30 hover:text-ink"
              }`}
            >
              <span className="line-clamp-1">&ldquo;{example}&rdquo;</span>
              <Sparkles className="w-3 h-3 text-gold-deep flex-shrink-0 opacity-70" />
            </button>
          ))}
        </div>
      </div>

      {/* Depth Selector */}
      <div className="mb-6">
        <label className="font-mono text-xs text-ink-2 font-medium block mb-2">
          Research Depth
        </label>
        <DepthSelector
          value={depth}
          onChange={onDepthChange}
          options={depthOptions}
          disabled={isRunning}
        />
      </div>

      {/* Action Button: Start or Cancel with FadeSwap */}
      {isRunning ? (
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md bg-bad text-white hover:bg-bad/90 cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <FadeSwap>Cancel Research</FadeSwap>
        </button>
      ) : (
        <button
          type="button"
          disabled={!isValid || isWaking}
          onClick={onStart}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            isValid && !isWaking
              ? "bg-header text-on-header hover:bg-gold-light hover:text-ink cursor-pointer"
              : "bg-header/40 text-on-header/50 cursor-not-allowed"
          }`}
        >
          <FadeSwap>
            {budgetExhausted
              ? "Budget Limit Reached"
              : isWaking
              ? "Waking up server…"
              : topic.trim().length < 5
              ? "Enter at least 5 chars"
              : "Start research"}
          </FadeSwap>
          <ArrowRight className="w-4 h-4 text-gold-light" />
        </button>
      )}

      {/* Budget Exhausted Note or Public Demo Note */}
      {budgetExhausted ? (
        <p className="mt-4 text-center font-sans text-xs text-warn leading-relaxed p-2.5 rounded-lg bg-warn/10 border border-warn/30">
          Today&apos;s AI budget is used up. It resets at {budgetResetTime || "Midnight Pacific"}. You can still read your saved reports.
        </p>
      ) : (
        <p className="mt-4 text-center font-sans text-xs text-ink-3 leading-relaxed">
          Reports are saved in this browser. Don&apos;t enter private information.
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-glass-border/60 text-center">
        <Link
          href="/history"
          className="font-mono text-xs text-ink-2 hover:text-gold-deep transition-colors inline-flex items-center gap-1"
        >
          <span>View history</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </GlassCard>
  );
}

export default TopicForm;
