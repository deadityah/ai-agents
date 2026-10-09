"use client";

import { motion } from "framer-motion";

export function FloatingNav() {
  return (
    <motion.header initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
      <span className="text-sm font-semibold text-white">Brand</span>
      <motion.button whileHover={{ scale: 1.03 }} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-900">Start</motion.button>
    </motion.header>
  );
}