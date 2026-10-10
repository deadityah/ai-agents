import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="w-full bg-header text-on-header-2 border-t border-white/10 py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-sm">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            <Image
              src="/brand/logo-mark.png"
              alt="ResearchPilot logo"
              width={32}
              height={32}
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <span className="font-display text-lg text-on-header font-medium">
            {siteConfig.name}
          </span>
        </div>

        {/* Center: Navigation & Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[14px]">
          <Link href="/" className="hover:text-gold-light transition-colors">
            Home
          </Link>
          <Link href="/research" className="hover:text-gold-light transition-colors">
            Research
          </Link>
          <Link href="/history" className="hover:text-gold-light transition-colors">
            History
          </Link>
          <Link href="/about" className="hover:text-gold-light transition-colors">
            About
          </Link>
          {siteConfig.githubUrl && (
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-light transition-colors"
            >
              GitHub
            </a>
          )}
          {siteConfig.linkedinUrl && (
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-light transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>

        {/* Right: Disclaimer note */}
        <div className="text-xs text-center md:text-right text-on-header-2/80 max-w-xs">
          Reports are saved in this browser. Don&apos;t enter private information.
        </div>
      </div>
    </footer>
  );
}
