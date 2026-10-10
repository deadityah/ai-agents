"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { navItems } from "@/lib/navOrder";
import { motionTokens } from "@/lib/motionTokens";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />

          {/* Sliding Black Panel from Right */}
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.35,
              ease: motionTokens.ease,
            }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-header border-l border-white/10 p-6 flex flex-col justify-between md:hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div>
              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-display text-xl text-on-header">ResearchPilot</span>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-on-header-2 hover:text-on-header hover:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Staggered Navigation Links */}
              <nav className="flex flex-col gap-5 mt-8" aria-label="Mobile Navigation">
                {navItems.map((item, index) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.06,
                        duration: 0.35,
                        ease: motionTokens.ease,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`font-display text-[26px] block transition-colors ${
                          isActive
                            ? "text-gold-light font-semibold"
                            : "text-on-header-2 hover:text-on-header"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions inside menu */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/research"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gold-light text-ink font-semibold text-center hover:bg-gold transition-colors"
              >
                Start research
              </Link>
              <p className="text-xs text-on-header-2 text-center">
                Reports saved locally in this browser.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
