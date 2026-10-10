// Backend and mock API client for budget, reports, and ping checks
// Phase 1: getBudget and ping connected; everything else mock data (docs/05-FRONTEND-SPEC.md §3)

import { BudgetResponse, ReportFull, ReportSummary } from "./types";
import { getClientId } from "./clientId";
import { mockBudgetNormal, mockReportFull, mockReportsList } from "./mockData";

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const getApiBase = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

/**
 * Pings GET /health on the backend with configurable timeout (default 60s for cold wake).
 * In mock mode (no NEXT_PUBLIC_API_URL), returns true immediately.
 */
export async function ping(timeoutMs = 60000): Promise<boolean> {
  const base = getApiBase();
  if (!base) return true;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${base}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetches real budget status from GET /api/budget.
 * In mock mode or on network failure, falls back cleanly to mockBudgetNormal.
 */
export async function getBudget(): Promise<BudgetResponse> {
  const base = getApiBase();
  if (!base) {
    return mockBudgetNormal;
  }

  try {
    const res = await fetch(`${base}/api/budget`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new ApiError("budget_fetch_failed", `Server responded with ${res.status}`);
    }
    return (await res.json()) as BudgetResponse;
  } catch (err) {
    console.warn("getBudget fallback to mock data:", err);
    return mockBudgetNormal;
  }
}

/**
 * Lists saved reports for the current client_id.
 * Stays on mock data in Phase 1.
 */
export async function listReports(): Promise<ReportSummary[]> {
  const base = getApiBase();
  const clientId = getClientId();

  if (!base) {
    return mockReportsList;
  }

  try {
    const res = await fetch(`${base}/api/reports?client_id=${encodeURIComponent(clientId)}`);
    if (!res.ok) throw new ApiError("list_reports_failed", `Server responded with ${res.status}`);
    return (await res.json()) as ReportSummary[];
  } catch {
    return mockReportsList;
  }
}

/**
 * Retrieves a single report by id.
 * Stays on mock data in Phase 1.
 */
export async function getReport(id: string): Promise<ReportFull | null> {
  const base = getApiBase();
  const clientId = getClientId();

  if (!base) {
    if (id === mockReportFull.id || id === "sample-1") {
      return mockReportFull;
    }
    const found = mockReportsList.find((r) => r.id === id);
    if (found) {
      return {
        ...mockReportFull,
        id: found.id,
        topic: found.topic,
        depth: found.depth,
        status: found.status,
        created_at: found.created_at,
      };
    }
    return mockReportFull;
  }

  try {
    const res = await fetch(`${base}/api/reports/${id}?client_id=${encodeURIComponent(clientId)}`);
    if (!res.ok) return null;
    return (await res.json()) as ReportFull;
  } catch {
    return null;
  }
}

/**
 * Deletes a report by id.
 * Stays on mock data in Phase 1.
 */
export async function deleteReport(id: string): Promise<boolean> {
  const base = getApiBase();
  const clientId = getClientId();

  if (!base) {
    return true;
  }

  try {
    const res = await fetch(`${base}/api/reports/${id}?client_id=${encodeURIComponent(clientId)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}
