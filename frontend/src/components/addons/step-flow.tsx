"use client";

import { StepFlow, type StepFlowItem } from "@/components/step-flow";
import { designTokens } from "@/lib/designTokens";

const researchSteps: StepFlowItem[] = [
  {
    serial: "01",
    title: "Plan",
    description: "It breaks your topic into questions.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Planning research sub-questions and search outline",
  },
  {
    serial: "02",
    title: "Search",
    description: "It runs focused web searches.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Autonomous Tavily web search across multiple sources",
  },
  {
    serial: "03",
    title: "Read",
    description: "It opens the best pages.",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Extracting content and filtering untrusted web text",
  },
  {
    serial: "04",
    title: "Take notes",
    description:
      "It records facts with source numbers and checks if it knows enough.",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Synthesizing evidence and checking termination criteria",
  },
  {
    serial: "05",
    title: "Write",
    description:
      "It writes the report and lists only the sources it used.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Writing synthesized markdown report with citations",
  },
];

export function StepFlowAddon({ className = "" }: { className?: string }) {
  return (
    <StepFlow
      steps={researchSteps}
      highlightColor="var(--gold-light)"
      className={className}
      autoPlay={false}
    />
  );
}
