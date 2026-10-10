"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { BudgetPill } from "./BudgetPill";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isResearchPage = pathname.startsWith("/research");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-light focus:text-ink focus:rounded-md focus:font-medium"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 w-full h-14 md:h-16 bg-header transition-colors duration-200 ${
          isScrolled ? "border-b border-[rgba(244,238,226,0.10)]" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo & Wordmark (fixed width for symmetry) */}
          <div className="flex items-center justify-start flex-shrink-0 md:w-[164px] lg:w-[278px]">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep rounded-lg py-1 flex-shrink-0"
              aria-label="ResearchPilot home"
            >
              <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/brand/logo-mark.png"
                  alt="ResearchPilot logo"
                  width={36}
                  height={36}
                  priority
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-display text-lg md:text-xl font-medium text-on-header tracking-tight hidden sm:inline-block whitespace-nowrap">
                ResearchPilot
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links (fixed position, dead-centered on desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <NavLinks />
          </div>

          {/* Right: BudgetPill + Start research CTA + Mobile Hamburger (fixed width) */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0 md:w-[278px]">
            <BudgetPill />

            {/* Start research button (hidden with visibility on /research so its space is always reserved) */}
            <Link
              href="/research"
              tabIndex={isResearchPage ? -1 : 0}
              aria-hidden={isResearchPage}
              className={`hidden sm:inline-flex items-center justify-center h-9 w-[122px] rounded-xl bg-gold-light text-ink text-sm font-semibold hover:bg-gold transition-colors duration-200 shadow-sm flex-shrink-0 whitespace-nowrap ${
                isResearchPage ? "invisible pointer-events-none" : "visible"
              }`}
            >
              Start research
            </Link>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg text-on-header-2 hover:text-on-header hover:bg-white/5 md:hidden transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
