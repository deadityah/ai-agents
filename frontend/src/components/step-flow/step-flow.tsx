"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StepFlowItem = {
  id?: string;
  serial?: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
};

export type StepFlowProps = {
  steps?: StepFlowItem[];
  defaultStep?: number;
  highlightColor?: string;
  className?: string;
  textClassName?: string;
  imageClassName?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

const defaultSteps: StepFlowItem[] = [
  {
    serial: "01",
    title: "Map the system",
    description: "Turn scattered product ideas into a clear structure your team can build from.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A focused workspace with a laptop and design notes",
  },
  {
    serial: "02",
    title: "Shape the interface",
    description: "Compose layouts, components, and states with a visual language that stays consistent.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Design wireframes and interface sketches on a desk",
  },
  {
    serial: "03",
    title: "Refine the motion",
    description: "Add purposeful transitions so every interaction feels responsive, calm, and premium.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Abstract architecture with strong perspective lines",
  },
  {
    serial: "04",
    title: "Ship the page",
    description: "Package the final experience into reusable React code that is ready for production.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Analytics dashboard on a monitor",
  },
];

export function StepFlow({
  steps = defaultSteps,
  defaultStep = 0,
  highlightColor = "rgb(229 229 229)",
  className,
  textClassName,
  imageClassName,
  autoPlay = false,
  autoPlayInterval = 3500,
}: StepFlowProps) {
  const reduceMotion = useReducedMotion() === true;
  const safeSteps = steps.length > 0 ? steps : defaultSteps;
  const initialStep = Math.min(Math.max(defaultStep, 0), safeSteps.length - 1);
  const [activeIndex, setActiveIndex] = React.useState(initialStep);
  const activeStep = safeSteps[activeIndex] ?? safeSteps[0];

  React.useEffect(() => {
    if (!autoPlay || safeSteps.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % safeSteps.length);
    }, Math.max(1200, autoPlayInterval));

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, safeSteps.length]);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-glass-border shadow-glass text-left",
        className,
      )}
      style={{
        backgroundColor: "var(--glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,1.15fr)] lg:gap-10 p-4 sm:p-6 lg:p-8">
        <div
          className={cn(
            "relative flex flex-col gap-2 rounded-xl p-1",
            textClassName,
          )}
        >
          {safeSteps.map((step, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={step.id ?? `${step.serial ?? index}-${step.title}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "group relative z-10 flex w-full cursor-pointer flex-col items-start rounded-xl px-4 py-3 sm:px-6 sm:py-3.5 text-left outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-gold-deep/30",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="step-flow-highlight"
                    className="absolute inset-0 -z-10 rounded-xl border border-glass-border bg-sand/60 shadow-xs"
                    transition={
                      reduceMotion
                        ? { duration: 0.1 }
                        : { type: "spring", bounce: 0.2, duration: 0.45 }
                    }
                  />
                )}
                <span
                  className={cn(
                    "font-mono text-xs sm:text-sm font-semibold tracking-wider transition-colors",
                    isActive ? "text-gold-deep" : "text-ink-3",
                  )}
                >
                  STEP {step.serial ?? String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-colors leading-tight",
                    isActive ? "text-ink" : "text-ink-2",
                  )}
                >
                  {step.title}
                </span>
                {step.description ? (
                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.span
                        className="mt-2 max-w-[34rem] font-sans text-xs sm:text-sm leading-relaxed text-ink-2"
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, filter: "blur(6px)" }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, filter: "blur(6px)" }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {step.description}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                ) : null}
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "relative flex min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] items-center justify-center rounded-xl bg-sand/30 border border-glass-border p-3 sm:p-4 overflow-hidden",
            imageClassName,
          )}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeStep.id ?? activeStep.title}
              src={activeStep.image}
              alt={activeStep.imageAlt ?? activeStep.title}
              className="h-full max-h-[460px] min-h-[260px] w-full rounded-lg border border-glass-border object-cover shadow-md"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02, filter: "blur(8px)" }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              transition={
                reduceMotion
                  ? { duration: 0.1 }
                  : { type: "spring", bounce: 0, duration: 0.5 }
              }
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default StepFlow;
