// Mock SSE stream simulator for Phase D3 design preview and development

import { SSEEvent, Depth } from "./types";
import { mockReportFull, mockSources20Plus } from "./mockData";

export interface StartResearchParams {
  topic: string;
  depth: Depth;
  signal?: AbortSignal;
  onEvent: (event: SSEEvent) => void;
  mockVariant?: "stream" | "warning" | "error";
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(() => {
      resolve();
    }, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });

export async function mockStream({
  topic,
  depth = "standard",
  signal,
  onEvent,
  mockVariant = "stream",
}: StartResearchParams): Promise<void> {
  const maxRounds = depth === "quick" ? 1 : depth === "standard" ? 2 : 4;
  const maxCalls = depth === "quick" ? 4 : depth === "standard" ? 6 : 8;

  const emit = (event: SSEEvent) => {
    if (signal?.aborted) return;
    onEvent(event);
  };

  // 1. Run Started
  emit({
    type: "run_started",
    run_id: `run-${Date.now().toString(36)}`,
    topic: topic || "Latest approaches to battery recycling",
    depth,
    limits: {
      max_rounds: maxRounds,
      max_gemini_calls: maxCalls,
    },
  });
  await sleep(700, signal);
  if (signal?.aborted) return;

  // Initial Usage
  emit({
    type: "usage",
    run_gemini_calls: 1,
    run_gemini_cap: maxCalls,
    run_tavily_credits: 0,
    daily_used: 13,
    daily_limit: 80,
  });

  // 2. Planning
  emit({
    type: "plan",
    sub_questions: [
      "What are the commercial recovery efficiencies of hydrometallurgy vs pyrometallurgy?",
      "How does direct cathode recycling preserve NMC crystal structures?",
      "What are the economic and regulatory drivers under the EU Battery Regulation and US IRA?",
    ],
    queries: [
      "battery recycling pyrometallurgical vs hydrometallurgical",
      "direct cathode recycling recovery efficiency 2024",
      "commercial scale LFP recycling economics",
    ],
  });
  await sleep(900, signal);
  if (signal?.aborted) return;

  // 3. Round 1 Start
  emit({
    type: "round_started",
    round: 1,
    max_rounds: maxRounds,
    queries: [
      "battery recycling pyrometallurgical vs hydrometallurgical",
      "direct cathode recycling recovery efficiency 2024",
      "commercial scale LFP recycling economics",
    ],
  });
  await sleep(800, signal);
  if (signal?.aborted) return;

  // Search Done
  emit({
    type: "search_done",
    round: 1,
    query: "battery recycling pyrometallurgical vs hydrometallurgical",
    results: mockSources20Plus.slice(0, 4),
  });
  emit({
    type: "usage",
    run_gemini_calls: 1,
    run_gemini_cap: maxCalls,
    run_tavily_credits: 3,
    daily_used: 13,
    daily_limit: 80,
  });
  await sleep(900, signal);
  if (signal?.aborted) return;

  // Reading pages
  emit({
    type: "reading",
    round: 1,
    pages: [
      { id: 1, title: "State of Global Battery Recycling Technology Review", domain: "nature.com" },
      { id: 2, title: "Direct Cathode Recycling for Electric Vehicles", domain: "energy.gov" },
      { id: 4, title: "Hydrometallurgical Recovery Efficiencies", domain: "sciencedirect.com" },
    ],
  });
  emit({
    type: "usage",
    run_gemini_calls: 1,
    run_gemini_cap: maxCalls,
    run_tavily_credits: 5,
    daily_used: 13,
    daily_limit: 80,
  });
  await sleep(1000, signal);
  if (signal?.aborted) return;

  // Notes Round 1
  emit({
    type: "notes",
    round: 1,
    notes: [
      { id: 1, text: "Hydrometallurgy achieves >95% lithium and cobalt extraction at 50% lower greenhouse emissions.", source_ids: [1, 4] },
      { id: 2, text: "Direct relithiation preserves single-crystal structures, eliminating energy-intensive precursor synthesis.", source_ids: [2] },
      { id: 3, text: "EU Battery Regulation 2023/1542 mandates minimum recycled content quotas by 2027.", source_ids: [3] },
    ],
    enough: depth === "quick",
    follow_up_queries:
      depth === "quick"
        ? []
        : ["solid-state battery recycling sulfide separation", "digital battery passport compliance 2026"],
  });
  emit({
    type: "usage",
    run_gemini_calls: 2,
    run_gemini_cap: maxCalls,
    run_tavily_credits: 5,
    daily_used: 14,
    daily_limit: 80,
  });
  await sleep(1000, signal);
  if (signal?.aborted) return;

  // Round 2 (if standard or deep)
  if (depth !== "quick") {
    emit({
      type: "round_started",
      round: 2,
      max_rounds: maxRounds,
      queries: ["solid-state battery recycling sulfide separation", "digital battery passport compliance 2026"],
    });
    await sleep(900, signal);
    if (signal?.aborted) return;

    emit({
      type: "search_done",
      round: 2,
      query: "solid-state battery recycling sulfide separation",
      results: mockSources20Plus.slice(4, 9),
    });
    emit({
      type: "usage",
      run_gemini_calls: 2,
      run_gemini_cap: maxCalls,
      run_tavily_credits: 7,
      daily_used: 14,
      daily_limit: 80,
    });
    await sleep(800, signal);
    if (signal?.aborted) return;

    emit({
      type: "reading",
      round: 2,
      pages: [
        { id: 8, title: "Solid-State Battery Disassembly Dynamics", domain: "sciencedirect.com" },
        { id: 11, title: "Ultrasonic Delamination of Spent Electrodes", domain: "nature.com" },
      ],
    });
    emit({
      type: "usage",
      run_gemini_calls: 2,
      run_gemini_cap: maxCalls,
      run_tavily_credits: 8,
      daily_used: 14,
      daily_limit: 80,
    });
    await sleep(1000, signal);
    if (signal?.aborted) return;

    emit({
      type: "notes",
      round: 2,
      notes: [
        { id: 4, text: "Solid-state sulfide electrolytes require inert gas shredding to prevent H2S emission.", source_ids: [8] },
        { id: 5, text: "Ultrasonic bathing selectively peels active materials without cross-contaminating current collector foils.", source_ids: [11] },
        { id: 6, text: "Digital battery passports create end-to-end traceability for closed-loop certification.", source_ids: [21] },
      ],
      enough: true,
      follow_up_queries: [],
    });
    emit({
      type: "usage",
      run_gemini_calls: 3,
      run_gemini_cap: maxCalls,
      run_tavily_credits: 8,
      daily_used: 15,
      daily_limit: 80,
    });
    await sleep(900, signal);
    if (signal?.aborted) return;
  }

  // Handle Mock Variants
  if (mockVariant === "warning") {
    emit({
      type: "warning",
      message:
        "Run stopped early: daily AI budget threshold reached. The final LLM call was reserved strictly for report synthesis.",
    });
    await sleep(600, signal);
  } else if (mockVariant === "error") {
    emit({
      type: "error",
      code: "no_results",
      message: "The web search returned nothing useful. Try rewording the topic.",
    });
    return;
  }

  // 4. Writing
  emit({ type: "writing" });
  await sleep(1200, signal);
  if (signal?.aborted) return;

  // 5. Final Report
  emit({
    type: "report",
    report_md: mockReportFull.report_md,
    sources: mockReportFull.sources,
  });
  emit({
    type: "usage",
    run_gemini_calls: 4,
    run_gemini_cap: maxCalls,
    run_tavily_credits: 8,
    daily_used: 16,
    daily_limit: 80,
  });
  await sleep(600, signal);
  if (signal?.aborted) return;

  // 6. Done
  emit({
    type: "done",
    report_id: mockReportFull.id,
    duration_ms: 31200,
  });
}
