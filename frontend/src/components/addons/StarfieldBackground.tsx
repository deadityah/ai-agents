"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { designTokens } from "@/lib/designTokens";

// ── Types ─────────────────────────────────────────────────────────────────────
type Star = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
  rot: number;
};

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) || 138,
    parseInt(h.slice(2, 4), 16) || 100,
    parseInt(h.slice(4, 6), 16) || 32,
  ];
}

function lerpRgb(a: RGB, b: RGB, t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(
    a[1] + (b[1] - a[1]) * t,
  )}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

export function StarfieldBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mouseRef = React.useRef({ x: -9999, y: -9999, active: false });
  const starsRef = React.useRef<Star[]>([]);
  const rafRef = React.useRef<number>(0);
  const influenceRef = React.useRef(0);

  const prefersReduced = useReducedMotion() === true;

  // Star colors strictly derived from design tokens (gold-deep base)
  const baseRgb = React.useMemo<RGB>(() => {
    return hexToRgb(designTokens.colors.goldDeep || "#8A6420");
  }, []);

  const activeRgb = React.useMemo<RGB>(() => {
    // Darker warm gold / bronze for active cursor repulsion
    return [90, 65, 25];
  }, []);

  React.useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const isStatic = prefersReduced || isTouch;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const MAX_STRETCH = 14;
    const REPULSE_STR = 1.6;
    const springK = 0.045;
    const damping = 0.84;
    const interactionRadius = 140;
    const ir2 = interactionRadius * interactionRadius;

    function seedStars(width: number, height: number): Star[] {
      // Mobile: about 80 particles; Desktop: about 180 particles
      const count = width < 768 ? 80 : 180;
      return Array.from({ length: count }, () => {
        const ox = Math.random() * width;
        const oy = Math.random() * height;
        return {
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          // Visible particle radius (1.2 - 2.6px) for crisp visibility on light beige
          r: 1.2 + Math.random() * 1.4,
          // Moderate opacity (0.40 - 0.80)
          alpha: 0.4 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI * 2,
        };
      });
    }

    function renderStaticFrame() {
      ctx!.clearRect(0, 0, W, H);
      for (const s of starsRef.current) {
        ctx!.save();
        ctx!.translate(s.ox, s.oy);
        ctx!.rotate(s.rot);
        ctx!.globalAlpha = s.alpha * 0.85;
        ctx!.fillStyle = lerpRgb(baseRgb, activeRgb, 0);

        const sw = s.r * 2;
        const sh = s.r * 2;
        const hw = sw / 2;
        const hh = sh / 2;
        const cr = Math.min(hw, hh);

        ctx!.beginPath();
        ctx!.moveTo(-hw + cr, -hh);
        ctx!.lineTo(hw - cr, -hh);
        ctx!.quadraticCurveTo(hw, -hh, hw, -hh + cr);
        ctx!.lineTo(hw, hh - cr);
        ctx!.quadraticCurveTo(hw, hh, hw - cr, hh);
        ctx!.lineTo(-hw + cr, hh);
        ctx!.quadraticCurveTo(-hw, hh, -hw, hh - cr);
        ctx!.lineTo(-hw, -hh + cr);
        ctx!.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      }
    }

    function resize() {
      // devicePixelRatio capped at 2
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cvs!.width = W * dpr;
      cvs!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = seedStars(W, H);

      if (isStatic) {
        renderStaticFrame();
      }
    }

    // Passive mouse tracking on window ensures zero click/selection interference
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    if (!isStatic) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    let t0 = performance.now();

    function draw(now: number) {
      // Pause when tab is hidden
      if (document.hidden) {
        rafRef.current = 0;
        return;
      }

      const elapsed = (now - t0) / 1000;
      ctx!.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active;

      if (active) {
        influenceRef.current = Math.min(1, influenceRef.current + 0.06);
      } else {
        influenceRef.current = Math.max(0, influenceRef.current - 0.03);
      }
      const inf = influenceRef.current;

      for (const s of starsRef.current) {
        // Physics repulsion from cursor
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist2 = dx * dx + dy * dy;
        const dist = Math.sqrt(dist2);

        let t = 0;
        if (inf > 0.01 && dist2 < ir2) {
          t = (1 - dist / interactionRadius) ** 2 * inf;
        }

        if (t > 0.01 && dist > 0.1) {
          s.vx += (dx / dist) * REPULSE_STR * t;
          s.vy += (dy / dist) * REPULSE_STR * t;
        }
        s.vx += (s.ox - s.x) * springK;
        s.vy += (s.oy - s.y) * springK;
        s.vx *= damping;
        s.vy *= damping;
        s.x += s.vx;
        s.y += s.vy;

        // Visual twinkle
        const twinkle = Math.sin(elapsed * 1.5 + s.phase) * 0.4 + 0.6;
        const baseA = s.alpha * twinkle;
        const drawAlpha = Math.min(0.95, baseA + t * 0.3);

        const stretchH = s.r * 2 + t * MAX_STRETCH;
        const stretchW = s.r * 2;

        const velMag = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const drawRot =
          velMag > 0.25 ? Math.atan2(s.vy, s.vx) + Math.PI / 2 : s.rot;

        const color = lerpRgb(baseRgb, activeRgb, t);

        ctx!.save();
        ctx!.translate(s.x, s.y);
        ctx!.rotate(drawRot);
        ctx!.globalAlpha = drawAlpha;
        ctx!.fillStyle = color;

        if (t > 0.35) {
          ctx!.shadowBlur = 4 + t * 6;
          ctx!.shadowColor = color;
        } else {
          ctx!.shadowBlur = 0;
        }

        const hw = stretchW / 2;
        const hh = stretchH / 2;
        const cr = Math.min(hw, hh);

        ctx!.beginPath();
        ctx!.moveTo(-hw + cr, -hh);
        ctx!.lineTo(hw - cr, -hh);
        ctx!.quadraticCurveTo(hw, -hh, hw, -hh + cr);
        ctx!.lineTo(hw, hh - cr);
        ctx!.quadraticCurveTo(hw, hh, hw - cr, hh);
        ctx!.lineTo(-hw + cr, hh);
        ctx!.quadraticCurveTo(-hw, hh, -hw, hh - cr);
        ctx!.lineTo(-hw, -hh + cr);
        ctx!.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      }

      ctx!.globalAlpha = 1;
      ctx!.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      } else if (!isStatic && !rafRef.current) {
        t0 = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (!isStatic) {
      t0 = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [baseRgb, activeRgb, prefersReduced]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-[100dvh] -z-10 pointer-events-none overflow-hidden bg-bg"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
