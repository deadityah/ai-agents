"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, Clock, Zap, Globe, Share2, Check } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { SourcesList } from "@/components/research/SourcesList";
import { SourceItem, Depth } from "@/lib/types";
import { formatDuration } from "@/lib/format";

interface ReportViewProps {
  topic: string;
  depth?: Depth;
  reportMd: string;
  sources: SourceItem[];
  stats?: {
    gemini_calls: number;
    tavily_credits: number;
    rounds?: number;
    duration_ms: number;
  };
  warnings?: string[];
  className?: string;
}

export function ReportView({
  topic,
  depth = "standard",
  reportMd,
  sources,
  stats,
  warnings,
  className,
}: ReportViewProps) {
  const [highlightedSourceId, setHighlightedSourceId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleCitationClick = (id: number) => {
    setHighlightedSourceId(id);
    const target = document.getElementById(`source-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
    }
    setTimeout(() => {
      setHighlightedSourceId((curr) => (curr === id ? null : curr));
    }, 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to replace [n] citations inside text strings with interactive pills
  const renderTextWithCitations = (children: React.ReactNode): React.ReactNode => {
    if (typeof children !== "string") {
      if (Array.isArray(children)) {
        return children.map((child, idx) => (
          <React.Fragment key={idx}>{renderTextWithCitations(child)}</React.Fragment>
        ));
      }
      return children;
    }

    // Match [1], [2], etc.
    const parts = children.split(/(\[\d+\])/g);
    if (parts.length === 1) return children;

    return parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const sourceId = parseInt(match[1], 10);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleCitationClick(sourceId)}
            className="inline-flex items-center font-mono text-[11px] px-1.5 py-0.5 rounded bg-sand/60 text-gold-deep font-semibold cursor-pointer hover:bg-gold-light hover:text-ink transition-colors align-baseline mx-0.5 shadow-2xs"
            title={`Jump to Source [${sourceId}]`}
          >
            [{sourceId}]
          </button>
        );
      }
      return part;
    });
  };

  const depthLabels: Record<Depth, string> = {
    quick: "Quick",
    standard: "Standard",
    deep: "Deep",
  };

  return (
    <GlassCard className={`p-6 sm:p-10 lg:p-12 text-left w-full ${className}`}>
      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-glass-border font-mono text-xs text-ink-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 text-ink-2 font-medium">
            <Layers className="w-3.5 h-3.5 text-gold-deep" />
            <span className="capitalize">{depthLabels[depth]} Depth</span>
          </span>
          {stats && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-ink-2">
                <Zap className="w-3.5 h-3.5 text-gold-deep" />
                {stats.gemini_calls} AI calls
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-ink-2">
                <Globe className="w-3.5 h-3.5 text-gold-deep" />
                {stats.tavily_credits} search/read credits
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-ink-3">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(stats.duration_ms)}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-glass-border bg-bg-soft/70 hover:bg-sand/40 text-ink text-xs font-mono transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-ok" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-ink-3" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Warning Callout if present */}
      {warnings && warnings.length > 0 && (
        <div className="mb-8 p-4 rounded-xl border border-warn/40 bg-warn/10 text-warn text-xs sm:text-sm font-sans flex items-start gap-2.5">
          <span>⚠️</span>
          <span>{warnings[0]}</span>
        </div>
      )}

      {/* Markdown Content with Fraunces Headings and DM Sans Body */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReduced ? 0.1 : 0.45 }}
        className="prose prose-stone max-w-none text-ink text-base sm:text-[17px] leading-[1.75] font-sans space-y-6"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight mb-6 mt-2 leading-tight">
                {renderTextWithCitations(children)}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold tracking-tight mb-4 mt-8 pt-4 border-t border-glass-border/60 leading-snug">
                {renderTextWithCitations(children)}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-display text-xl sm:text-2xl text-ink font-semibold tracking-tight mb-3 mt-6">
                {renderTextWithCitations(children)}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-ink-2 leading-[1.75] mb-4">
                {renderTextWithCitations(children)}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-2 mb-4 text-ink-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-2 mb-4 text-ink-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-ink-2 leading-relaxed">
                {renderTextWithCitations(children)}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gold pl-4 py-1 italic text-ink-2 my-4 bg-sand/20 rounded-r-lg">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-8 border-glass-border" />,
            a: ({ href, children }) => {
              const isSafe = href?.startsWith("http://") || href?.startsWith("https://");
              return (
                <a
                  href={isSafe ? href : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-deep underline decoration-gold-light hover:decoration-gold font-medium"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {reportMd}
        </ReactMarkdown>
      </motion.div>

      {/* Sources Section */}
      <SourcesList sources={sources} highlightedId={highlightedSourceId} />
    </GlassCard>
  );
}

export default ReportView;
