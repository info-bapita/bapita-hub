import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "live" | "soon";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-ink/[0.07] text-ink/60",
  live: "bg-seo/15 text-seo",
  soon: "bg-social/15 text-social",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
