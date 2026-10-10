"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

interface FadeSwapProps {
  itemKey?: string | number;
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
}

export function FadeSwap({
  itemKey,
  children,
  className = "",
  direction = "right",
}: FadeSwapProps) {
  const prefersReduced = useReducedMotion();
  const shift = prefersReduced ? 0 : direction === "right" ? 12 : -12;
  const key = itemKey ?? (typeof children === "string" ? children : "fade-swap-item");

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, x: shift }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -shift }}
        transition={{
          duration: prefersReduced ? 0.15 : 0.35,
          ease: motionTokens.ease,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
