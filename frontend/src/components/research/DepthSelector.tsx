"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Depth } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface DepthOption {
  id: Depth;
  name: string;
  tagline: string;
  estimate: string;
  allowed: boolean;
}

interface DepthSelectorProps {
  value: Depth;
  onChange: (depth: Depth) => void;
  options?: DepthOption[];
  disabled?: boolean;
}

const defaultOptions: DepthOption[] = [
  {
    id: "quick",
    name: "Quick",
    tagline: "Fast overview",
    estimate: "~3 calls · ~4 searches",
    allowed: true,
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Balanced detail",
    estimate: "~4 calls · ~8 searches",
    allowed: true,
  },
  {
    id: "deep",
    name: "Deep",
    tagline: "Exhaustive",
    estimate: "~6 calls · ~20 searches",
    allowed: true,
  },
];

export function DepthSelector({
  value,
  onChange,
  options = defaultOptions,
  disabled = false,
}: DepthSelectorProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2.5 relative">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          const isDisabled = disabled || !opt.allowed;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) onChange(opt.id);
              }}
              title={!opt.allowed ? "Not enough budget left today for this depth." : undefined}
              className={cn(
                "relative p-3 rounded-xl text-left flex flex-col justify-between transition-colors border outline-none min-h-[92px]",
                isDisabled
                  ? "opacity-40 cursor-not-allowed border-glass-border bg-bg-soft/30 text-ink-3"
                  : isSelected
                  ? "border-ink text-ink shadow-xs"
                  : "border-glass-border hover:border-gold/60 text-ink-2 hover:text-ink cursor-pointer bg-bg-soft/50"
              )}
              style={
                isSelected
                  ? { borderWidth: "1.5px" }
                  : undefined
              }
            >
              {/* Sliding Gold Highlight between cards (shared layout animation) */}
              {isSelected && (
                <motion.div
                  layoutId="depth-selector-highlight"
                  className="absolute inset-0 rounded-xl bg-sand/40 -z-10 border border-gold/40 shadow-xs"
                  transition={{
                    type: prefersReduced ? "tween" : "spring",
                    duration: prefersReduced ? 0.15 : 0.35,
                    bounce: 0.15,
                  }}
                />
              )}

              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display font-bold text-xs sm:text-sm text-ink block">
                    {opt.name}
                  </span>
                  {/* Small gold dot when selected per 02 §4.7 */}
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-gold shadow-xs flex-shrink-0 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-ink-3 block leading-tight mt-0.5">
                  {opt.tagline}
                </span>
              </div>

              <span className="font-mono text-[9px] sm:text-[10px] text-gold-deep mt-2 block font-medium">
                {opt.estimate}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DepthSelector;
