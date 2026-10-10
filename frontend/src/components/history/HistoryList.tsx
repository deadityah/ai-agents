"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Trash2, ArrowRight, FileText, Check, X } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { ReportSummary } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format";

interface HistoryListProps {
  reports: ReportSummary[];
  onDelete?: (id: string) => void;
  className?: string;
}

export function HistoryList({ reports, onDelete, className }: HistoryListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(id);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setConfirmDeleteId(null);
  };

  return (
    <GlassCard className={`p-6 sm:p-8 text-left w-full ${className}`}>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gold-deep" />
          <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
            Saved Reports ({reports.length})
          </span>
        </div>
        <span className="font-mono text-xs text-ink-3">
          Browser Local Storage
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {reports.map((entry, idx) => {
          const isConfirming = confirmDeleteId === entry.id;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: prefersReduced ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: prefersReduced ? 0.15 : 0.35,
                delay: prefersReduced ? 0 : idx * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-4 rounded-xl border border-glass-border/70 bg-bg-soft/70 hover:bg-sand/30 hover:border-gold/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left group"
            >
              <Link
                href={`/reports/${entry.id}`}
                className="space-y-1.5 flex-1 min-w-0 pr-2 block"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      entry.status === "done"
                        ? "bg-ok"
                        : entry.status === "warning"
                        ? "bg-warn"
                        : "bg-bad"
                    }`}
                  />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sand text-ink-2">
                    {entry.depth}
                  </span>
                  <span className="font-mono text-xs text-ink-3">
                    {formatRelativeTime(entry.created_at)}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-ink leading-snug group-hover:text-gold-deep transition-colors line-clamp-2 sm:line-clamp-1">
                  {entry.topic}
                </h3>
                <p className="font-mono text-xs text-ink-3">
                  {entry.sources_count || 12} sources · {entry.word_count || 680} words
                </p>
              </Link>

              {/* Action buttons: Read + Delete confirmation */}
              <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                {isConfirming ? (
                  <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-bad/10 border border-bad/30 font-mono text-xs">
                    <span className="text-bad px-1">Delete?</span>
                    <button
                      type="button"
                      onClick={(e) => handleConfirmDelete(e, entry.id)}
                      className="px-2 py-1 rounded bg-bad text-white hover:bg-bad/90 font-bold cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      className="px-2 py-1 rounded bg-sand/60 text-ink hover:bg-sand cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/reports/${entry.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-header text-on-header hover:bg-gold-light hover:text-ink font-mono text-xs transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(e, entry.id)}
                      title="Delete this report"
                      className="p-2 rounded-lg text-ink-3 hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

export default HistoryList;
