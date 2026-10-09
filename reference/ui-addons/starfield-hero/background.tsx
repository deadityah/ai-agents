"use client";
import { InteractiveStarfieldHero } from "@/components/starfield-hero";

export function DefaultHero() {
  return (
    <InteractiveStarfieldHero
      title={"Ship faster.\nBuild better."}
      subtitle="A motion-native component library for React — animated, accessible, and production-ready."
      primaryCTA={{ label: "Get started",      href: "/components" }}
      secondaryCTA={{ label: "View components", href: "/components" }}
    />
  );
}