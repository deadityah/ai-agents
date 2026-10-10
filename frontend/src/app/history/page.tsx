"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { FadeText } from "@/components/motion/FadeText";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/layout/GlassCard";
import { HistoryList } from "@/components/history/HistoryList";
import { EmptyState } from "@/components/layout/EmptyState";
import { SkeletonCard } from "@/components/layout/Skeleton";
import { mockReportsList } from "@/lib/mockData";
import { ReportSummary } from "@/lib/types";

function HistoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mockParam = searchParams.get("mock");

  const [reports, setReports] = useState<ReportSummary[]>(mockReportsList);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (mockParam === "empty") {
      setReports([]);
      setIsLoading(false);
    } else if (mockParam === "loading") {
      setIsLoading(true);
    } else {
      setReports(mockReportsList);
      setIsLoading(false);
    }
  }, [mockParam]);

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto w-full">
      {/* ── Page Header ── */}
      <Reveal from="auto" className="w-full flex justify-center mb-8">
        <GlassCard className="text-center max-w-2xl w-full mx-auto p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block">
              Saved Reports
            </span>

            {/* Quick Mock State Switcher for Testing */}
            <div className="inline-flex items-center gap-1 font-mono text-[11px] bg-sand/35 p-1 rounded-xl border border-glass-border">
              <span className="text-ink-3 px-1.5 uppercase font-bold text-[9px]">State:</span>
              {(["list", "empty", "loading"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => router.push(`/history?mock=${m}`)}
                  className={`px-2 py-0.5 rounded-md transition-all capitalize cursor-pointer ${
                    mockParam === m || (m === "list" && !mockParam)
                      ? "bg-header text-on-header font-bold shadow-xs"
                      : "text-ink-2 hover:text-ink hover:bg-sand/60"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-ink font-bold tracking-tight mb-4">
            <FadeText text="Research History" />
          </h1>
          <p className="text-ink-2 text-base leading-relaxed">
            Access your past research reports, key findings, and citations stored privately in this browser session.
          </p>
        </GlassCard>
      </Reveal>

      {/* ── Content View ── */}
      <div className="w-full max-w-2xl">
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : reports.length === 0 ? (
          <Reveal from="auto">
            <EmptyState
              icon={Clock}
              title="No saved reports yet"
              description="Every research run you launch is automatically saved to your local browser storage so you can re-open citations anytime."
              actionText="Start your first research"
              actionHref="/research"
            />
          </Reveal>
        ) : (
          <Reveal from="left">
            <HistoryList reports={reports} onDelete={handleDelete} />
          </Reveal>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <span className="font-mono text-xs text-ink-3 animate-pulse">
            Loading saved reports...
          </span>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
