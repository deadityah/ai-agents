"use client";

import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

interface FadeTextProps {
  text: string;
  className?: string;
  byWord?: boolean;
  delay?: number;
}

export function FadeText({ text, className = "", byWord = false, delay = 0 }: FadeTextProps) {
  const prefersReduced = useReducedMotion();

  if (byWord && !prefersReduced) {
    const lines = text.split("\n");
    return (
      <span className={`${className} block w-full`}>
        {lines.map((line, lineIdx) => {
          const words = line.split(" ");
          return (
            <span key={lineIdx} className="block leading-tight">
              {words.map((word, wordIdx) => (
                <motion.span
                  key={`${word}-${wordIdx}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: delay + (lineIdx * 4 + wordIdx) * 0.04,
                    ease: motionTokens.ease,
                  }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <motion.span
      initial={prefersReduced ? false : { opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: prefersReduced ? 0 : 0.4,
        delay,
        ease: motionTokens.ease,
      }}
      className={`${className} block w-full`}
    >
      {text}
    </motion.span>
  );
}
