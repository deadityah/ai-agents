"use client";

import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface HorizontalStripProps {
  children: ReactNode[];
  className?: string;
  cardWidth?: string; // e.g. "w-[280px] sm:w-[320px] flex-shrink-0"
}

export function HorizontalStrip({
  children,
  className = "",
  cardWidth = "w-[280px] sm:w-[320px] flex-shrink-0",
}: HorizontalStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDesktopMouse, setIsDesktopMouse] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const prefersReduced = useReducedMotion() === true;
  const count = children.length;

  // Physics refs for desktop mouse mode
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const maxTranslateRef = useRef(0);

  // Detect input mode: Desktop with mouse ((hover: hover) and (pointer: fine), motion allowed)
  useEffect(() => {
    setIsMounted(true);

    const updateMode = () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Desktop mouse mode: hover:hover & pointer:fine, NOT reduced-motion, NOT touch
      const desktop = finePointer && !reducedMotion && !hasTouch;
      setIsDesktopMouse(desktop);
    };

    updateMode();

    const mediaFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    mediaFine.addEventListener("change", updateMode);
    mediaReduced.addEventListener("change", updateMode);

    return () => {
      mediaFine.removeEventListener("change", updateMode);
      mediaReduced.removeEventListener("change", updateMode);
    };
  }, []);

  // Compute maximum scrollable distance
  const updateMetrics = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const viewportWidth = containerRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    maxTranslateRef.current = Math.max(0, trackWidth - viewportWidth);
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener("resize", updateMetrics, { passive: true });
    return () => window.removeEventListener("resize", updateMetrics);
  }, [updateMetrics, children]);

  // Update active index based on current translate
  const updateActiveIndex = useCallback(
    (x: number) => {
      if (count <= 1 || maxTranslateRef.current <= 0) return;
      const step = maxTranslateRef.current / (count - 1);
      const idx = Math.min(count - 1, Math.max(0, Math.round(x / step)));
      setActiveIndex(idx);
    },
    [count],
  );

  // Smooth lerp loop (lerp factor: 0.10, spring-like ease, no jumps)
  const startAnimationLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;

    const lerp = 0.10;
    const tick = () => {
      const diff = targetXRef.current - currentXRef.current;
      if (Math.abs(diff) > 0.3) {
        currentXRef.current += diff * lerp;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${currentXRef.current}px)`;
        }
        updateActiveIndex(currentXRef.current);
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        currentXRef.current = targetXRef.current;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${currentXRef.current}px)`;
        }
        updateActiveIndex(currentXRef.current);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [updateActiveIndex]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Desktop Mouse Movement Handler:
  // Mouse at left = first card in view (targetX = 0)
  // Mouse at right = last card in view (targetX = maxTranslate)
  // Middle 80% for mapping (10% dead zone at each end)
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDesktopMouse || !containerRef.current) return;
    if (!hasInteracted) setHasInteracted(true);

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;

    const relX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, relX / rect.width));

    // Middle 80% with 10% dead zones:
    let progress = 0;
    if (ratio <= 0.10) {
      progress = 0;
    } else if (ratio >= 0.90) {
      progress = 1;
    } else {
      progress = (ratio - 0.10) / 0.80;
    }

    targetXRef.current = progress * maxTranslateRef.current;
    startAnimationLoop();
  };

  // When the mouse leaves or stops, the strip stays exactly where it is
  const handleMouseLeave = () => {
    if (!isDesktopMouse) return;
    targetXRef.current = currentXRef.current;
  };

  // Touch device scroll handler
  const handleNativeScroll = () => {
    if (isDesktopMouse || !containerRef.current) return;
    const { scrollLeft } = containerRef.current;
    if (scrollLeft > 10 && !hasInteracted) {
      setHasInteracted(true);
    }

    const cardStep = 340;
    const idx = Math.min(count - 1, Math.max(0, Math.round(scrollLeft / cardStep)));
    setActiveIndex(idx);
  };

  // Step button / key action
  const goToIndex = (index: number) => {
    setHasInteracted(true);
    const clamped = Math.min(count - 1, Math.max(0, index));
    setActiveIndex(clamped);

    if (isDesktopMouse) {
      if (count > 1 && maxTranslateRef.current > 0) {
        const step = maxTranslateRef.current / (count - 1);
        targetXRef.current = clamped * step;
        startAnimationLoop();
      }
    } else {
      if (containerRef.current) {
        const cardStep = 340;
        containerRef.current.scrollTo({
          left: clamped * cardStep,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrev = () => goToIndex(activeIndex - 1);
  const handleNext = () => goToIndex(activeIndex + 1);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const hintLabel = isDesktopMouse
    ? "Move your mouse left and right \u2192"
    : "Swipe \u2192";

  return (
    <div
      className={`relative w-full text-left outline-none ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="How it works interactive horizontal strip"
      role="region"
    >
      {/* Top Header: Hint text (fades out after 1st interaction) + Prev/Next buttons */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span
          className={`font-mono text-xs uppercase tracking-wider text-gold-deep transition-opacity duration-300 ${
            hasInteracted ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-live="polite"
        >
          {isMounted ? hintLabel : "Move your mouse left and right \u2192"}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous step"
            className="p-2 rounded-full border border-glass-border bg-bg-soft/60 text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:bg-sand/40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex >= count - 1}
            aria-label="Next step"
            className="p-2 rounded-full border border-glass-border bg-bg-soft/60 text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:bg-sand/40 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewport Container:
          - Desktop mouse mode: overflow-hidden, no scroll-snap, transformed inner track
          - Touch / Reduced-motion: overflow-x-auto, native swipe with scroll-snap
          - Vertical wheel scrolling is never hijacked (no onWheel handler)
      */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onScroll={handleNativeScroll}
        onTouchStart={() => {
          if (!hasInteracted) setHasInteracted(true);
        }}
        className={`w-full pb-4 pt-1 px-1 select-none ${
          isDesktopMouse
            ? "overflow-hidden cursor-ew-resize"
            : "overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        }`}
        style={
          isDesktopMouse
            ? { overflow: "hidden" }
            : { scrollbarWidth: "none", msOverflowStyle: "none" }
        }
      >
        <div
          ref={trackRef}
          className={`flex gap-5 flex-nowrap w-max ${
            isDesktopMouse ? "will-change-transform" : ""
          }`}
          style={
            isDesktopMouse
              ? { transform: "translateX(0px)" }
              : undefined
          }
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={`${cardWidth} ${
                !isDesktopMouse ? "snap-start" : ""
              }`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Dots with sliding sideways active indicator */}
      {count > 1 && (
        <div className="flex justify-center items-center mt-6">
          <div className="relative inline-flex items-center gap-1.5 p-1 rounded-full bg-sand/30 border border-glass-border">
            {children.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToIndex(i)}
                aria-label={`Go to step ${i + 1}`}
                className="relative px-2.5 py-1 text-xs font-mono rounded-full focus:outline-none transition-colors"
              >
                {activeIndex === i && (
                  <motion.span
                    layoutId="strip-active-pill"
                    className="absolute inset-0 bg-gold rounded-full shadow-xs"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 font-semibold transition-colors ${
                    activeIndex === i ? "text-header" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
