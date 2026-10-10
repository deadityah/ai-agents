"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export type BannerVariant = "info" | "warning" | "error" | "success";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function Banner({
  variant = "info",
  message,
  actionText,
  onAction,
  className,
  ...props
}: BannerProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle2,
  };
  const Icon = icons[variant];

  const variantStyles = {
    info: "border-gold-deep/30 text-gold-deep",
    warning: "border-warn/40 text-warn",
    error: "border-bad/40 text-bad",
    success: "border-ok/40 text-ok",
  };

  return (
    <div
      className={cn(
        "w-full px-4 py-3 rounded-xl border border-glass-border shadow-glass flex items-center justify-between gap-3 text-xs sm:text-sm transition-all",
        className
      )}
      style={{
        backgroundColor: "var(--glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      {...props}
    >
      <div className="flex items-center gap-2.5 text-ink">
        <Icon className={cn("w-4 h-4 flex-shrink-0", variantStyles[variant])} />
        <span className="leading-snug">{message}</span>
      </div>
      {actionText && (
        <button
          type="button"
          onClick={onAction}
          className="font-mono text-xs font-semibold text-gold-deep hover:underline flex-shrink-0 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default Banner;
