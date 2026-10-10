"use client";

import React from "react";
import { GlassCard } from "@/components/layout/GlassCard";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <GlassCard className={cn("p-10 sm:p-14 text-center flex flex-col items-center justify-center w-full", className)}>
      <div className="w-14 h-14 rounded-2xl bg-sand/60 flex items-center justify-center text-gold-deep mb-5">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display text-2xl font-bold text-ink mb-2">
        {title}
      </h3>
      <p className="text-ink-2 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <a
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-header text-on-header font-semibold text-sm hover:bg-gold-light hover:text-ink transition-colors shadow-md"
          >
            {actionText}
          </a>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-header text-on-header font-semibold text-sm hover:bg-gold-light hover:text-ink transition-colors shadow-md cursor-pointer"
          >
            {actionText}
          </button>
        )
      )}
    </GlassCard>
  );
}

export default EmptyState;
