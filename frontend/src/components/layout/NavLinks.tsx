"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/lib/navOrder";

export function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={`flex items-center gap-6 ${className}`} aria-label="Main">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative py-2 text-[15px] font-medium transition-colors duration-200 ${
              isActive
                ? "text-gold-light"
                : "text-on-header-2 hover:text-on-header"
            }`}
          >
            {item.label}
            {isActive && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                  duration: 0.35,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
