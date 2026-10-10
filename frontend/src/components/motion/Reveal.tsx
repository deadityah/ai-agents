"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

interface RevealProps {
  children: ReactNode;
  from?: "left" | "right" | "auto";
  orderIndex?: number;
  delay?: number;
  className?: string;
}

export function Reveal({
  children,
  from = "left",
  orderIndex = 0,
  delay = 0,
  className = "",
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  let direction: "left" | "right" = "left";
  if (from === "auto") {
    direction = orderIndex % 2 === 0 ? "left" : "right";
  } else {
    direction = from;
  }

  const distance = prefersReduced ? 0 : 36;
  const initialX = direction === "left" ? -distance : distance;

  return (
    <motion.div
      initial={prefersReduced ? false : { x: initialX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: prefersReduced ? 0 : motionTokens.durations.slow,
        delay,
        ease: motionTokens.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
