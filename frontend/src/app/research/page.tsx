"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/layout/GlassCard";
import { Banner } from "@/components/layout/Banner";
import { TopicForm } from "@/components/research/TopicForm";
import { RunView } from "@/components/research/RunView";
import { TimelineStepItem } from "@/components/research/ProgressTimeline";
import { mockStream } from "@/lib/mockStream";
import {
  mockReportFull,
  mockReportWarning,
  mockBudgetNormal,
  mockBudgetExhausted,
  mockSources20Plus,
} from "@/lib/mockData";
import { formatResetTime } from "@/lib/format";
import { ping } from "@/lib/api";
import { Depth, RunState, SSEEvent, ReportFull } from "@/lib/types";

function ResearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mockParam = searchParams.get("mock");
  const topicParam = searchParams.get("topic");

  const [topic, setTopic] = useState(
    topicParam || "Latest approaches to battery recycling and commercial viability"
  );
  const [depth, setDepth] = useState<Depth>("standard");
  const [runState, setRunState] = useState<RunState>("idle");
  const [timelineSteps, setTimelineSteps] = useState<TimelineStepItem[]>([]);
  const [report, setReport] = useState<ReportFull | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [wakingBanner, setWakingBanner] = useState<boolean>(false);
  const [isBudgetExhausted, setIsBudgetExhausted] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    gemini_calls: number;
    gemini_cap: number;
    tavily_credits: number;
    daily_used?: number;
    daily_limit?: number;
  }>({
    gemini_calls: 0,
    gemini_cap: 6,
    tavily_credits: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Stop stream if component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Update topic if ?topic= parameter changes
  useEffect(() => {
    if (topicParam) {
      setTopic(topicParam);
    }
  }, [topicParam]);

  // Handle ?mock= query parameter states (docs/05-FRONTEND-SPEC.md §8)
  useEffect(() => {
    // Reset state first
    abortControllerRef.current?.abort();
    setErrorMessage(null);
    setWarningMessage(null);
    setWakingBanner(false);
    setIsBudgetExhausted(false);
    setReport(null);

    if (mockParam === "running") {
      setRunState("running");
      setStats({ gemini_calls: 2, gemini_cap: 6, tavily_credits: 5 });
      setTimelineSteps([
        {
          id: "step-1",
          stepNumber: "LLM Call 1",
          title: "1. Planning research",
          detail: "Formulated 3 sub-questions and search outline across battery recycling chemistry.",
          status: "complete",
          subQuestions: [
            "What are the commercial recovery efficiencies of hydrometallurgy vs pyrometallurgy?",
            "How does direct cathode recycling preserve NMC crystal structures?",
            "What are the economic and regulatory drivers under the EU Battery Regulation and US IRA?",
          ],
        },
        {
          id: "step-2",
          stepNumber: "Tavily Search",
          title: "2. Autonomous web search",
          detail: "Ran 3 targeted search queries across 12 authoritative sources.",
          status: "complete",
          queries: [
            "battery recycling pyrometallurgical vs hydrometallurgical",
            "direct cathode recycling recovery efficiency 2024",
            "commercial scale LFP recycling economics",
          ],
        },
        {
          id: "step-3",
          stepNumber: "Tavily Extract",
          title: "3. Reading source pages",
          detail: "Extracted and sanitized technical papers from nature.com, energy.gov, and sciencedirect.com.",
          status: "complete",
        },
        {
          id: "step-4",
          stepNumber: "LLM Call 2",
          title: "4. Synthesizing evidence & notes",
          detail: "Extracting structured facts, validating source links, and checking sufficiency criteria...",
          status: "active",
        },
      ]);
    } else if (mockParam === "done") {
      setRunState("done");
      setStats({ gemini_calls: 4, gemini_cap: 6, tavily_credits: 8 });
      setTimelineSteps([
        {
          id: "step-1",
          stepNumber: "LLM Call 1",
          title: "1. Planning research",
          detail: "Formulated 3 sub-questions and search outline.",
          status: "complete",
        },
        {
          id: "step-2",
          stepNumber: "Tavily Search",
          title: "2. Autonomous web search",
          detail: "Queried 21 verified sources via Tavily.",
          status: "complete",
        },
        {
          id: "step-3",
          stepNumber: "Tavily Extract",
          title: "3. Reading source pages",
          detail: "Extracted verified technical excerpts without hallucinated text.",
          status: "complete",
        },
        {
          id: "step-4",
          stepNumber: "LLM Call 2",
          title: "4. Synthesizing evidence & notes",
          detail: "Recorded 8 verified notes with citation mappings. Sufficiency reached.",
          status: "complete",
        },
        {
          id: "step-5",
          stepNumber: "LLM Call 3",
          title: "5. Composing report",
          detail: "Composed referenced markdown report with 21 cited sources.",
          status: "complete",
        },
      ]);
      setReport(mockReportFull);
    } else if (mockParam === "warning") {
      setRunState("done");
      setWarningMessage(
        "Run stopped early: daily AI budget threshold reached. The final LLM call was reserved strictly for report synthesis."
      );
      setStats({ gemini_calls: 3, gemini_cap: 6, tavily_credits: 5 });
      setTimelineSteps([
        {
          id: "step-1",
          stepNumber: "LLM Call 1",
          title: "1. Planning research",
          detail: "Formulated research queries.",
          status: "complete",
        },
        {
          id: "step-2",
          stepNumber: "Tavily Search",
          title: "2. Autonomous web search",
          detail: "Queried sources across technical literature.",
          status: "complete",
        },
        {
          id: "step-3",
          stepNumber: "LLM Call 2",
          title: "3. Notes (Budget Reserve Triggered)",
          detail: "Daily budget low. Jumping directly to write with evidence gathered so far.",
          status: "warning",
        },
      ]);
      setReport(mockReportWarning);
    } else if (mockParam === "error") {
      setRunState("error");
      setErrorMessage("The web search returned nothing useful. Try rewording the topic.");
      setTimelineSteps([
        {
          id: "step-1",
          stepNumber: "LLM Call 1",
          title: "1. Planning research",
          detail: "Formulated search queries.",
          status: "complete",
        },
        {
          id: "step-2",
          stepNumber: "Tavily Search",
          title: "2. Autonomous web search",
          detail: "0 results returned from query.",
          status: "error",
        },
      ]);
    } else if (mockParam === "waking") {
      setRunState("waking");
      setWakingBanner(true);
      setTimelineSteps([]);
    } else if (mockParam === "budget") {
      setRunState("idle");
      setIsBudgetExhausted(true);
      setTimelineSteps([]);
    } else if (mockParam === "empty") {
      setRunState("idle");
      setTopic("");
      setTimelineSteps([]);
    } else if (mockParam === "stream") {
      // Automatically launch live animated mock stream
      handleStartRun("stream");
    } else {
      // Default idle state
      setRunState("idle");
      setTimelineSteps([]);
    }
  }, [mockParam]);

  // Check backend server availability on load if NEXT_PUBLIC_API_URL is configured (docs/05-FRONTEND-SPEC.md §5)
  useEffect(() => {
    if (mockParam || !process.env.NEXT_PUBLIC_API_URL) return;

    let isMounted = true;
    const wakingTimer = setTimeout(() => {
      if (isMounted) {
        setWakingBanner(true);
        setRunState("waking");
      }
    }, 3000);

    ping()
      .then(() => {
        if (!isMounted) return;
        clearTimeout(wakingTimer);
        setWakingBanner(false);
        setRunState((prev) => (prev === "waking" ? "idle" : prev));
      })
      .catch(() => {
        if (!isMounted) return;
        clearTimeout(wakingTimer);
        setWakingBanner(false);
        setRunState((prev) => (prev === "waking" ? "idle" : prev));
      });

    return () => {
      isMounted = false;
      clearTimeout(wakingTimer);
    };
  }, [mockParam]);

  // Execute Live Mock Stream (plays realistic run)
  const handleStartRun = async (variant: "stream" | "warning" | "error" = "stream") => {
    abortControllerRef.current?.abort();
    const ac = new AbortController();
    abortControllerRef.current = ac;

    setRunState("running");
    setErrorMessage(null);
    setWarningMessage(null);
    setReport(null);
    setTimelineSteps([]);

    const stepsMap = new Map<string, TimelineStepItem>();

    try {
      await mockStream({
        topic,
        depth,
        signal: ac.signal,
        mockVariant: variant,
        onEvent: (event: SSEEvent) => {
          if (ac.signal.aborted) return;

          switch (event.type) {
            case "run_started":
              setStats((s) => ({
                ...s,
                gemini_cap: event.limits.max_gemini_calls,
              }));
              break;

            case "usage":
              setStats((s) => ({
                ...s,
                gemini_calls: event.run_gemini_calls,
                gemini_cap: event.run_gemini_cap,
                tavily_credits: event.run_tavily_credits,
                daily_used: event.daily_used,
                daily_limit: event.daily_limit,
              }));
              break;

            case "plan":
              stepsMap.set("plan", {
                id: "plan",
                stepNumber: "LLM Call 1",
                title: "1. Planning research",
                detail: `Extracted ${event.sub_questions.length} sub-questions and ${event.queries.length} search queries.`,
                status: "complete",
                subQuestions: event.sub_questions,
              });
              setTimelineSteps(Array.from(stepsMap.values()));
              break;

            case "round_started":
              stepsMap.set(`round-${event.round}`, {
                id: `round-${event.round}`,
                stepNumber: `Round ${event.round}/${event.max_rounds}`,
                title: `Round ${event.round}: Deepening evidence`,
                detail: `Executing ${event.queries.length} queries across Tavily search and extract...`,
                status: "active",
                isRoundGroup: event.round > 1,
                queries: event.queries,
              });
              setTimelineSteps(Array.from(stepsMap.values()));
              break;

            case "search_done":
              stepsMap.set(`search-${event.round}`, {
                id: `search-${event.round}`,
                stepNumber: "Tavily Search",
                title: `${event.round === 1 ? "2" : "5"}. Autonomous web search`,
                detail: `Found ${event.results.length} sources for query: "${event.query}"`,
                status: "complete",
                sources: event.results,
              });
              setTimelineSteps(Array.from(stepsMap.values()));
              break;

            case "reading":
              stepsMap.set(`reading-${event.round}`, {
                id: `reading-${event.round}`,
                stepNumber: "Tavily Extract",
                title: `${event.round === 1 ? "3" : "6"}. Reading source pages`,
                detail: `Sanitizing ${event.pages.length} web pages without untrusted instructions.`,
                status: "active",
              });
              setTimelineSteps(Array.from(stepsMap.values()));
              break;

            case "notes":
              stepsMap.set(`notes-${event.round}`, {
                id: `notes-${event.round}`,
                stepNumber: `LLM Call ${event.round + 1}`,
                title: `${event.round === 1 ? "4" : "7"}. Synthesizing notes`,
                detail: `Recorded ${event.notes.length} verified facts. ${
                  event.enough ? "Sufficient information to answer all questions." : "Formulating follow-up queries."
                }`,
                status: "complete",
                notes: event.notes,
              });
              setTimelineSteps(Array.from(stepsMap.values()));
              break;

            case "writing":
              stepsMap.set("writing", {
                id: "writing",
                stepNumber: "Final LLM Call",
                title: "Synthesizing markdown report",
                detail: "Composing structured sections with verified citations [1]–[21]...",
                status: "active",
              });
              setTimelineSteps(Array.from(stepsMap.values()));
              break;

            case "warning":
              setWarningMessage(event.message);
              break;

            case "error":
              setRunState("error");
              setErrorMessage(event.message);
              break;

            case "report":
              setReport({
                id: "rep-streamed",
                topic,
                depth,
                status: "done",
                created_at: new Date().toISOString(),
                report_md: event.report_md,
                sources: event.sources,
                duration_ms: 31200,
                stats: {
                  gemini_calls: 4,
                  tavily_credits: 8,
                  rounds: depth === "quick" ? 1 : 2,
                  duration_ms: 31200,
                },
              });
              break;

            case "done":
              setRunState("done");
              break;
          }
        },
      });
    } catch (err: unknown) {
      if (ac.signal.aborted) {
        setRunState("cancelled");
      } else {
        setRunState("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  };

  const handleCancelRun = () => {
    abortControllerRef.current?.abort();
    setRunState("cancelled");
  };

  // Depth selector options mapping
  const depthOptions = [
    {
      id: "quick" as Depth,
      name: "Quick",
      tagline: "Fast overview",
      estimate: "~3 calls · ~4 searches",
      allowed: !isBudgetExhausted,
    },
    {
      id: "standard" as Depth,
      name: "Standard",
      tagline: "Balanced detail",
      estimate: "~4 calls · ~8 searches",
      allowed: !isBudgetExhausted,
    },
    {
      id: "deep" as Depth,
      name: "Deep",
      tagline: "Exhaustive",
      estimate: "~6 calls · ~20 searches",
      allowed: !isBudgetExhausted,
    },
  ];

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16">
      {/* Page Header on Frosted Glass */}
      <Reveal from="auto" className="w-full">
        <GlassCard className="p-6 sm:p-8 text-left mb-6 w-full">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-deep px-3 py-1 rounded-full bg-sand/40 border border-glass-border inline-block">
              Autonomous Research Studio
            </span>

            {/* Quick Mock State Switcher Pills for Testing 05 §8 */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] bg-sand/35 p-1 rounded-xl border border-glass-border">
              <span className="text-ink-3 px-1.5 uppercase font-bold text-[9px]">Preview:</span>
              {(["empty", "stream", "running", "done", "warning", "error", "waking", "budget"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => router.push(`/research?mock=${m}`)}
                  className={`px-2 py-0.5 rounded-md transition-all capitalize cursor-pointer ${
                    mockParam === m || (m === "empty" && !mockParam)
                      ? "bg-header text-on-header font-bold shadow-xs"
                      : "text-ink-2 hover:text-ink hover:bg-sand/60"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink font-bold tracking-tight mt-1">
            New Research Run
          </h1>
          <p className="text-ink-2 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Provide any research topic. ResearchPilot plans sub-questions, queries Tavily across authoritative sources, extracts evidence, and composes a cited report.
          </p>
        </GlassCard>
      </Reveal>

      {/* Waking Server Banner (docs/05-FRONTEND-SPEC.md §7) */}
      {wakingBanner && (
        <Banner
          variant="info"
          message="Waking up the server (free hosting can take up to a minute)…"
          className="mb-8"
        />
      )}

      {/* Main Two-Column Layout (≥ 1024px: left 380px, right run view) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: TopicForm */}
        <Reveal from="left" className="lg:col-span-5 w-full">
          <TopicForm
            topic={topic}
            onTopicChange={setTopic}
            depth={depth}
            onDepthChange={setDepth}
            isRunning={runState === "running"}
            isWaking={runState === "waking"}
            onStart={() => handleStartRun("stream")}
            onCancel={handleCancelRun}
            depthOptions={depthOptions}
            budgetExhausted={isBudgetExhausted}
            budgetResetTime={formatResetTime(mockBudgetExhausted.gemini.resets_at)}
          />
        </Reveal>

        {/* Right Column: RunView */}
        <Reveal from="right" className="lg:col-span-7 w-full">
          <RunView
            state={runState}
            topic={topic}
            depth={depth}
            timelineSteps={timelineSteps}
            report={report}
            errorMessage={errorMessage || undefined}
            warningMessage={warningMessage || undefined}
            stats={stats}
            onCancel={handleCancelRun}
          />
        </Reveal>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <span className="font-mono text-xs text-ink-3 animate-pulse">
            Loading research studio...
          </span>
        </div>
      }
    >
      <ResearchContent />
    </Suspense>
  );
}
