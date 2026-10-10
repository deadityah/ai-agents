"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Is it free?",
    answer: "The demo is free to use within a daily budget.",
  },
  {
    question: "Are my reports private?",
    answer:
      "Reports are saved only for this browser. There is no login, so don't enter private information.",
  },
  {
    question: "Can it be wrong?",
    answer: "Yes. Check the sources linked in every report.",
  },
  {
    question: "Why did it stop early?",
    answer: "To stay within the daily AI budget or the per-run limits.",
  },
  {
    question: "Which AI does it use?",
    answer: "Google Gemini for reasoning and Tavily for web search.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <GlassCard
            key={faq.question}
            className="overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display text-lg sm:text-xl font-medium text-ink hover:text-gold-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep rounded-2xl"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gold-deep transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-ink-2 text-sm sm:text-base leading-relaxed border-t border-glass-border/40 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        );
      })}
    </div>
  );
}
