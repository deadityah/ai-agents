"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ReportView } from "@/components/research/ReportView";
import { mockReportFull } from "@/lib/mockData";

export default function ReportDetailPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-10 sm:py-16 max-w-[1200px] mx-auto w-full">
      <div className="w-full max-w-4xl">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gold-deep" />
          <span>Back to saved history</span>
        </Link>

        <Reveal from="auto">
          <ReportView
            topic={mockReportFull.topic}
            depth={mockReportFull.depth}
            reportMd={mockReportFull.report_md}
            sources={mockReportFull.sources}
            stats={mockReportFull.stats}
            warnings={mockReportFull.warnings}
          />
        </Reveal>
      </div>
    </div>
  );
}
