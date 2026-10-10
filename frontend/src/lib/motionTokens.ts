// Framer Motion transition durations, easings, distances, and token helpers.

export const motionTokens = {
  durations: {
    fast: 0.15,
    base: 0.3,
    slow: 0.65,
    pageEnter: 0.45,
    pageExit: 0.25,
  },
  ease: [0.22, 1, 0.36, 1] as const,
  distances: {
    desktop: 48,
    mobile: 24,
  },
  stagger: {
    fast: 0.06,
    base: 0.08,
    slow: 0.12,
  },
};

/**
 * Returns slide distance honoring reduced motion and viewport width.
 */
export function getSlideDistance(isMobile = false, prefersReducedMotion = false): number {
  if (prefersReducedMotion) return 0;
  return isMobile ? motionTokens.distances.mobile : motionTokens.distances.desktop;
}
