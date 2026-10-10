// Mock data powering all design preview states (docs/05-FRONTEND-SPEC.md §8)

import { BudgetResponse, ReportFull, ReportSummary, SourceItem, NoteItem, Depth } from "./types";

export const mockBudgetNormal: BudgetResponse = {
  gemini: {
    used: 12,
    limit: 80,
    remaining: 68,
    resets_at: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
  },
  tavily: {
    used: 42,
    limit: 900,
    remaining: 858,
    month: "2026-10",
  },
  depths: {
    quick: { gemini_cap: 4, allowed: true },
    standard: { gemini_cap: 6, allowed: true },
    deep: { gemini_cap: 8, allowed: true },
  },
};

export const mockBudgetExhausted: BudgetResponse = {
  gemini: {
    used: 80,
    limit: 80,
    remaining: 0,
    resets_at: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
  },
  tavily: {
    used: 900,
    limit: 900,
    remaining: 0,
    month: "2026-10",
  },
  depths: {
    quick: { gemini_cap: 4, allowed: false },
    standard: { gemini_cap: 6, allowed: false },
    deep: { gemini_cap: 8, allowed: false },
  },
};

export const mockSources20Plus: SourceItem[] = [
  { id: 1, title: "State of Global Battery Recycling Technology Review", domain: "nature.com/articles/s41560-023", url: "https://nature.com" },
  { id: 2, title: "Direct Cathode Recycling for Electric Vehicles at Commercial Scale", domain: "energy.gov/eere/vehicles/articles", url: "https://energy.gov" },
  { id: 3, title: "EU Battery Regulation 2023/1542 Circular Economy Mandates", domain: "eur-lex.europa.eu/legal-content", url: "https://europa.eu" },
  { id: 4, title: "Hydrometallurgical Recovery Efficiencies of Critical Metals", domain: "sciencedirect.com/science/article", url: "https://sciencedirect.com" },
  { id: 5, title: "Global EV Outlook 2024: End-of-Life Material Streams", domain: "iea.org/reports/global-ev-outlook", url: "https://iea.org" },
  { id: 6, title: "Direct Relithiation Pathways for Degraded NMC622 & NMC811", domain: "cell.com/joule/fulltext", url: "https://cell.com" },
  { id: 7, title: "Pyrometallurgical vs Hydrometallurgical Carbon Intensity Audit", domain: "pubs.acs.org/doi/10.1021/es", url: "https://acs.org" },
  { id: 8, title: "Solid-State Battery Disassembly & Sulfide Separation Dynamics", domain: "sciencedirect.com/journal/nano-energy", url: "https://sciencedirect.com" },
  { id: 9, title: "Lithium Iron Phosphate (LFP) Economics: Hydrometallurgy Feasibility", domain: "bloomberg.com/hyperdrive/energy", url: "https://bloomberg.com" },
  { id: 10, title: "Closed-Loop Cathode Precursor Synthesis Standards", domain: "nist.gov/publications/battery-recycling", url: "https://nist.gov" },
  { id: 11, title: "Ultrasonic Delamination of Spent Lithium-Ion Electrodes", domain: "nature.com/articles/s41467-023", url: "https://nature.com" },
  { id: 12, title: "Black Mass Leaching Agents: Organic Acids vs Inorganic Acids", domain: "rsc.org/journals/green-chemistry", url: "https://rsc.org" },
  { id: 13, title: "US IRA Section 30D Domestic Sourcing & Recycled Content Rules", domain: "irs.gov/clean-vehicle-credits", url: "https://irs.gov" },
  { id: 14, title: "Battery Materials Sourcing Benchmark 2024", domain: "benchmarkminerals.com/data/recycling", url: "https://benchmarkminerals.com" },
  { id: 15, title: "Thermal Pre-Treatment Optimization for High-Nickel Cathodes", domain: "springer.com/article/journal-of-material-cycles", url: "https://springer.com" },
  { id: 16, title: "Graphite Anode Purification and Regeneration Strategies", domain: "wiley.com/doi/10.1002/aenm", url: "https://wiley.com" },
  { id: 17, title: "Techno-Economic Analysis of Decentralized Black Mass Shredding", domain: "nrel.gov/docs/fy24osti", url: "https://nrel.gov" },
  { id: 18, title: "Life Cycle Assessment of Closed-Loop Hydro Recycling Facilities", domain: "sciencedirect.com/journal/resources-conservation", url: "https://sciencedirect.com" },
  { id: 19, title: "Critical Materials Recovery: Federal Supply Chain Risk Index", domain: "whitehouse.gov/briefing-room/statements", url: "https://whitehouse.gov" },
  { id: 20, title: "Hydrothermal Healing of Polycrystalline Single-Crystal Cathodes", domain: "cell.com/matter/fulltext", url: "https://cell.com" },
  { id: 21, title: "Regulatory Compliance Audit: Battery Passport Digital Data Standards", domain: "battery-passport-consortium.org/spec", url: "https://battery-passport-consortium.org" },
];

export const mockReportFull: ReportFull = {
  id: "rep-battery-recycling-2026",
  topic: "Latest approaches to battery recycling and commercial viability",
  depth: "standard",
  status: "done",
  created_at: new Date(Date.now() - 3600 * 2000).toISOString(),
  duration_ms: 31200,
  sources_count: 21,
  word_count: 890,
  stats: {
    gemini_calls: 4,
    tavily_credits: 8,
    rounds: 2,
    duration_ms: 31200,
  },
  report_md: `## Executive Overview

Industrial electrification has intensified demand for critical battery minerals, elevating closed-loop recycling into a geopolitical and economic imperative [1][5]. Over the last twenty-four months, commercial recycling has shifted from primitive pyrometallurgical smelting toward sophisticated hydrometallurgical processing and direct cathode regeneration [2][7]. 

Strict regulatory mandates, specifically the **EU Battery Regulation 2023/1542** [3] requiring minimum recycled cobalt, lithium, and nickel content by 2027, along with domestic production tax credits under the **US Inflation Reduction Act** [13], have spurred multi-billion dollar domestic infrastructure deployments [14][19].

---

## 1. Pyrometallurgical vs. Hydrometallurgical Processing

Traditional pyrometallurgy operates at extreme temperatures exceeding 1400°C. While effective at smelting cobalt, nickel, and copper into an alloy matte, pyrometallurgy loses almost all lithium and aluminum into slag [4][7]. 

In contrast, hydrometallurgical processing leaches shredded "black mass" through aqueous acid baths:

* **Extraction Yield:** Recovers >95% of battery-grade lithium carbonate or lithium hydroxide, together with near-complete recovery of cobalt, nickel, and manganese [4][12].
* **Carbon Profile:** Emits 35% to 52% lower greenhouse gases than pyrometallurgical facilities and up to 70% lower emissions compared to virgin mining [7][18].
* **Reagent Innovation:** Novel facilities employ mild organic acids (such as citric and oxalic acids) [12] and closed-loop water regeneration systems, eliminating hazardous sulfur dioxide effluents.

---

## 2. Direct Cathode Recycling & Relithiation

The most significant technological frontier is **direct recycling** [2][6]. Rather than dissolving cathodes down to raw metal salts and resynthesizing precursor chemicals, direct recycling extracts the active cathode material intact.

1. **Selective Delamination:** High-frequency ultrasonic bathing strips intact cathode films from aluminum current collectors without shredding contamination [11].
2. **Relithiation Annealing:** Thermal relithiation under controlled atmosphere infuses fresh lithium ions into degraded crystal lattices, restoring specific capacity equal to virgin NMC622 and NMC811 [6][20].
3. **Economics:** Direct recycling slashes energy consumption by over 60% compared to hydrometallurgical precipitation [2][17].

---

## 3. The LFP Economics Challenge

While high-nickel NMC chemistries carry strong intrinsic salvage value from cobalt and nickel content, **Lithium Iron Phosphate (LFP)** batteries represent a distinct economic challenge [9]. LFP contains no expensive cobalt or nickel.

When lithium commodity prices dropped from 2022 peaks, stand-alone LFP recycling margins compressed sharply [9][14]. To remain profitable, modern recyclers co-extract secondary value streams:
* Regenerating battery-grade synthetic graphite anodes [16].
* Converting iron phosphate into agricultural fertilizers or industrial salts [9].
* Leveraging decentralized regional hub-and-spoke shredding facilities to cut transport logistics costs [17].

---

## 4. Solid-State Batteries & Digital Passports

Next-generation solid-state architectures introduce lithium-metal anodes and sulfide or oxide ceramic solid electrolytes [8]. These require inert gas shredding environments to prevent toxic hydrogen sulfide gas generation [8]. Emerging pilot facilities have proven continuous magnetic and density-based separation of ceramic solid electrolytes [8].

Concurrently, European **Digital Battery Passports** [21] now mandate tamper-proof tracking of battery chemistry, recycled percentages, and supply-chain origins from manufacture through certified decommissioning [3][21].`,
  sources: mockSources20Plus,
};

export const mockReportWarning: ReportFull = {
  id: "rep-warning-preview",
  topic: "Hydrogen fuel cells vs sodium-ion batteries in long-haul freight",
  depth: "standard",
  status: "warning",
  created_at: new Date(Date.now() - 1800 * 1000).toISOString(),
  duration_ms: 22400,
  sources_count: 8,
  word_count: 510,
  stats: {
    gemini_calls: 3,
    tavily_credits: 5,
    rounds: 1,
    duration_ms: 22400,
  },
  warnings: [
    "Run stopped early: daily AI budget threshold reached. The final LLM call was reserved strictly for report synthesis.",
  ],
  report_md: `## Preliminary Synthesis (Early Completion)

Due to project cost boundaries, ResearchPilot concluded investigation after Round 1 and synthesized available evidence [1][3].

Sodium-ion chemistry demonstrates extreme temperature resilience and low bill-of-materials costs, making it ideal for stationary storage and medium-duty transit [2][4]. However, for Class-8 heavy-duty long-haul trucking (>500 mile range), hydrogen fuel cell electric systems maintain higher gravimetric energy density despite lower round-trip efficiency [5][7].`,
  sources: mockSources20Plus.slice(0, 8),
};

export const mockReportsList: ReportSummary[] = [
  {
    id: "rep-battery-recycling-2026",
    topic: "Latest approaches to battery recycling and commercial viability",
    depth: "standard",
    status: "done",
    created_at: new Date(Date.now() - 3600 * 2000).toISOString(),
    duration_ms: 31200,
    sources_count: 21,
    word_count: 890,
  },
  {
    id: "rep-heat-pumps-comparison",
    topic: "How do heat pumps compare with gas furnaces in cold climates?",
    depth: "standard",
    status: "done",
    created_at: new Date(Date.now() - 3600 * 24000).toISOString(),
    duration_ms: 28400,
    sources_count: 12,
    word_count: 640,
  },
  {
    id: "rep-rag-architectures",
    topic: "What is retrieval-augmented generation and when should I use it?",
    depth: "deep",
    status: "done",
    created_at: new Date(Date.now() - 3600 * 48000).toISOString(),
    duration_ms: 44100,
    sources_count: 18,
    word_count: 1040,
  },
  {
    id: "rep-four-day-workweek",
    topic: "Pros and cons of 4-day work weeks empirical studies 2024",
    depth: "quick",
    status: "done",
    created_at: new Date(Date.now() - 3600 * 96000).toISOString(),
    duration_ms: 17800,
    sources_count: 6,
    word_count: 420,
  },
];
