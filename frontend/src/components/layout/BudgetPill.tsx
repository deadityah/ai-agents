"use client";

import { useState, useEffect } from "react";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { getBudget } from "@/lib/api";
import { formatResetTime } from "@/lib/format";

interface BudgetPillProps {
  used?: number;
  total?: number;
  resetsAtTime?: string;
  className?: string;
}

export function BudgetPill({
  used: initialUsed = 12,
  total: initialTotal = 80,
  resetsAtTime: initialResetsAtTime = "12:00 AM PST",
  className = "",
}: BudgetPillProps) {
  const [budget, setBudget] = useState<{
    used: number;
    total: number;
    resetsAtTime: string;
  }>({
    used: initialUsed,
    total: initialTotal,
    resetsAtTime: initialResetsAtTime,
  });

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchBudget() {
      try {
        const res = await getBudget();
        if (isMounted && res?.gemini) {
          setBudget({
            used: res.gemini.used,
            total: res.gemini.limit,
            resetsAtTime: res.gemini.resets_at
              ? formatResetTime(res.gemini.resets_at)
              : "12:00 AM PST",
          });
        }
      } catch {
        // quiet fallback
      }
    }

    fetchBudget();
    const interval = setInterval(fetchBudget, 60000);
    const handleRefresh = () => {
      fetchBudget();
    };
    window.addEventListener("rp:refresh-budget", handleRefresh);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("rp:refresh-budget", handleRefresh);
    };
  }, []);

  const percentage = Math.min(100, Math.round((budget.used / budget.total) * 100));

  // Amber if >= 80%, Brick if 100%, else Gold
  const progressColor =
    percentage >= 100 ? "bg-bad" : percentage >= 80 ? "bg-warn" : "bg-gold";

  return (
    <div
      className={`relative inline-flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono select-none cursor-help w-[104px] sm:w-[146px] flex-shrink-0 ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      aria-label={`AI calls budget: ${budget.used} of ${budget.total} used`}
    >
      <span className="text-on-header-2 text-[11px] sm:text-xs whitespace-nowrap tabular-nums">
        <span className="hidden sm:inline">AI calls </span>
        <FadeSwap itemKey={`${budget.used}/${budget.total}`} className="inline-block">
          <strong className="text-on-header font-semibold tabular-nums">
            {budget.used}/{budget.total}
          </strong>
        </FadeSwap>
      </span>
      {/* Progress Bar (visible on sm+) */}
      <div className="hidden xs:block sm:block w-8 h-1.5 rounded-full bg-black/60 overflow-hidden flex-shrink-0">
        <div
          className={`h-full ${progressColor} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg bg-header border border-glass-border shadow-glass text-[11px] text-on-header-2 whitespace-nowrap z-50">
          Resets at {budget.resetsAtTime}
        </div>
      )}
    </div>
  );
}

export default BudgetPill;
