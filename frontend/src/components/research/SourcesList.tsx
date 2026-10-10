"use client";

import React from "react";
import { ExternalLink, BookOpen } from "lucide-react";
import { SourceItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SourcesListProps {
  sources: SourceItem[];
  highlightedId?: number | null;
  className?: string;
}

export function SourcesList({ sources, highlightedId, className }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className={cn("pt-8 border-t border-glass-border", className)}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-gold-deep" />
        <h3 className="font-display text-lg font-bold text-ink">
          Referenced Sources ({sources.length})
        </h3>
      </div>

      <div className="flex flex-col gap-2.5">
        {sources.map((source) => {
          const isHighlighted = highlightedId === source.id;

          return (
            <a
              key={source.id}
              id={`source-${source.id}`}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-3 sm:p-3.5 rounded-xl border border-glass-border/70 transition-all duration-200 flex items-center justify-between gap-3 text-xs sm:text-sm group text-left",
                isHighlighted
                  ? "border-l-4 border-l-gold bg-sand/50 shadow-md ring-1 ring-gold/40 translate-x-1"
                  : "bg-bg-soft/60 hover:bg-sand/30 hover:border-gold/50"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-gold-deep font-bold text-xs flex-shrink-0 px-1.5 py-0.5 rounded bg-sand/60">
                  [{source.id}]
                </span>
                <span className="text-ink font-medium group-hover:text-gold-deep transition-colors truncate">
                  {source.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-ink-3 flex-shrink-0">
                <span className="max-w-[140px] truncate">{source.domain}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default SourcesList;
