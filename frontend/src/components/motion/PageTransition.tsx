"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={prefersReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReduced ? 0 : motionTokens.durations.pageEnter,
        ease: motionTokens.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
