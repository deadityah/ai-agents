// Shared TypeScript contracts for ResearchPilot SSE stream, budget, and reports

export type Depth = "quick" | "standard" | "deep";

export interface DepthLimit {
  max_rounds: number;
  max_gemini_calls: number;
  max_searches: number;
}

export interface DepthConfig {
  id: Depth;
  name: string;
  tagline: string;
  estimate: string;
  gemini_cap: number;
  allowed: boolean;
  reason?: string;
}

export interface BudgetResponse {
  gemini: {
    used: number;
    limit: number;
    remaining: number;
    resets_at: string; // ISO 8601 string
  };
  tavily: {
    used: number;
    limit: number;
    remaining: number;
    month: string;
  };
  depths: {
    quick: { gemini_cap: number; allowed: boolean };
    standard: { gemini_cap: number; allowed: boolean };
    deep: { gemini_cap: number; allowed: boolean };
  };
}

export interface SourceItem {
  id: number;
  title: string;
  url: string;
  domain: string;
}

export interface NoteItem {
  id: number;
  text: string;
  source_ids: number[];
}

// SSE Event Discriminated Union (docs/01-ARCHITECTURE.md §6)
export interface RunStartedEvent {
  type: "run_started";
  run_id: string;
  topic: string;
  depth: Depth;
  limits: {
    max_rounds: number;
    max_gemini_calls: number;
    max_searches?: number;
  };
}

export interface PlanEvent {
  type: "plan";
  sub_questions: string[];
  queries: string[];
}

export interface RoundStartedEvent {
  type: "round_started";
  round: number;
  max_rounds: number;
  queries: string[];
}

export interface SearchDoneEvent {
  type: "search_done";
  round: number;
  query: string;
  results: SourceItem[];
}

export interface ReadingEvent {
  type: "reading";
  round: number;
  pages: { id: number; title: string; domain: string }[];
}

export interface NotesEvent {
  type: "notes";
  round: number;
  notes: NoteItem[];
  enough: boolean;
  follow_up_queries: string[];
}

export interface WritingEvent {
  type: "writing";
}

export interface ReportEvent {
  type: "report";
  report_md: string;
  sources: SourceItem[];
}

export interface UsageEvent {
  type: "usage";
  run_gemini_calls: number;
  run_gemini_cap: number;
  run_tavily_credits: number;
  daily_used: number;
  daily_limit: number;
}

export interface WarningEvent {
  type: "warning";
  message: string;
}

export interface ErrorEvent {
  type: "error";
  code: string;
  message: string;
}

export interface DoneEvent {
  type: "done";
  report_id: string;
  duration_ms: number;
}

export interface PingEvent {
  type: "ping";
}

export type SSEEvent =
  | RunStartedEvent
  | PlanEvent
  | RoundStartedEvent
  | SearchDoneEvent
  | ReadingEvent
  | NotesEvent
  | WritingEvent
  | ReportEvent
  | UsageEvent
  | WarningEvent
  | ErrorEvent
  | DoneEvent
  | PingEvent;

// Report Storage Types
export type ReportStatus = "running" | "done" | "warning" | "failed" | "failed_budget" | "cancelled";

export interface ReportSummary {
  id: string;
  topic: string;
  depth: Depth;
  status: ReportStatus;
  created_at: string;
  duration_ms?: number;
  sources_count?: number;
  word_count?: number;
}

export interface ReportFull extends ReportSummary {
  report_md: string;
  sources: SourceItem[];
  notes?: NoteItem[];
  stats?: {
    gemini_calls: number;
    tavily_credits: number;
    rounds: number;
    duration_ms: number;
  };
  warnings?: string[];
}

export type RunState = "idle" | "waking" | "running" | "done" | "error" | "cancelled";
