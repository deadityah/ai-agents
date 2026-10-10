"use client";

import React from "react";
import { Search, Loader2, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { ProgressTimeline, TimelineStepItem } from "@/components/research/ProgressTimeline";
import { ReportView } from "@/components/research/ReportView";
import { Banner } from "@/components/layout/Banner";
import { RunState, Depth, ReportFull, SourceItem } from "@/lib/types";

interface RunViewProps {
  state: RunState;
  topic: string;
  depth: Depth;
  timelineSteps: TimelineStepItem[];
  report?: ReportFull | null;
  errorMessage?: string;
  warningMessage?: string;
  stats?: {
    gemini_calls: number;
    gemini_cap: number;
    tavily_credits: number;
    daily_used?: number;
    daily_limit?: number;
    duration_ms?: number;
  };
  onCancel?: () => void;
  className?: string;
}

export function RunView({
  state,
  topic,
  depth,
  timelineSteps,
  report,
  errorMessage,
  warningMessage,
  stats,
  onCancel,
  className,
}: RunViewProps) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* State Banners if applicable */}
      {warningMessage && (
        <Banner
          variant="warning"
          message={warningMessage}
        />
      )}

      {errorMessage && (
        <Banner
          variant="error"
          message={errorMessage}
        />
      )}

      {state === "cancelled" && (
        <Banner
          variant="warning"
          message="Run cancelled. Partial progress is saved in history."
        />
      )}

      {/* Main Container */}
      {state === "idle" && !report ? (
        <GlassCard className="p-8 sm:p-12 text-left">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-glass-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sand-border border border-gold" />
              <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
                Run Status: Idle
              </span>
            </div>
            <span className="font-mono text-xs text-ink-3">
              Ready for research
            </span>
          </div>

          <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-sand/60 flex items-center justify-center text-gold-deep mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">
              No active research run
            </h3>
            <p className="text-ink-2 text-sm max-w-md mx-auto leading-relaxed mb-6">
              Select an example topic on the left or type your own question to launch an autonomous research round.
            </p>
          </div>

          {/* Architecture Pipeline Preview */}
          <div className="space-y-3 pt-6 border-t border-glass-border">
            <span className="font-mono text-xs text-ink-3 uppercase tracking-wider block">
              Execution Pipeline:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-ink-2">
              <div className="p-3.5 rounded-lg bg-bg-soft/60 border border-glass-border">
                <span className="text-gold-deep block font-bold mb-1">01. Plan</span>
                <p className="text-[11px] text-ink-3 leading-snug">
                  Gemini plans sub-questions &amp; search queries
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-bg-soft/60 border border-glass-border">
                <span className="text-gold-deep block font-bold mb-1">02. Search &amp; Read</span>
                <p className="text-[11px] text-ink-3 leading-snug">
                  Tavily queries web &amp; extracts clean text
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-bg-soft/60 border border-glass-border">
                <span className="text-gold-deep block font-bold mb-1">03. Synthesize</span>
                <p className="text-[11px] text-ink-3 leading-snug">
                  Composes cited markdown report
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {/* Active / Finished Run Header */}
          <GlassCard className="p-5 sm:p-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-glass-border">
              <div className="flex items-center gap-2">
                {state === "running" ? (
                  <>
                    <Loader2 className="w-4 h-4 text-gold-deep animate-spin" />
                    <span className="font-mono text-xs font-bold text-gold-deep uppercase tracking-wider">
                      Research in progress...
                    </span>
                  </>
                ) : state === "error" ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-bad" />
                    <span className="font-mono text-xs font-bold text-bad uppercase tracking-wider">
                      Stopped with error
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-ok" />
                    <span className="font-mono text-xs font-bold text-ok uppercase tracking-wider">
                      Research Complete
                    </span>
                  </>
                )}
              </div>

              {stats && (
                <div className="flex items-center gap-3 font-mono text-xs text-ink-3">
                  <span>
                    AI calls: <strong className="text-ink">{stats.gemini_calls}</strong>/{stats.gemini_cap}
                  </span>
                  <span>·</span>
                  <span>
                    Credits: <strong className="text-ink">{stats.tavily_credits}</strong>
                  </span>
                </div>
              )}
            </div>

            <p className="font-display text-lg sm:text-xl font-bold text-ink truncate">
              &ldquo;{topic}&rdquo;
            </p>
          </GlassCard>

          {/* Progress Timeline */}
          {timelineSteps.length > 0 && (
            <ProgressTimeline steps={timelineSteps} />
          )}

          {/* Generated Report View */}
          {report && (
            <ReportView
              topic={report.topic}
              depth={report.depth}
              reportMd={report.report_md}
              sources={report.sources}
              stats={report.stats}
              warnings={report.warnings}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RunView;
