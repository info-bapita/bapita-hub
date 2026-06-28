import { cn } from "@/lib/cn";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "ghost" | "outline";

interface BaseProps {
  size?: Size;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.9375rem] gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-ink/85 active:bg-ink/95 shadow-soft",
  ghost:
    "bg-transparent text-ink/75 hover:bg-ink/[0.06] hover:text-ink active:bg-ink/10",
  outline:
    "bg-transparent border border-ink/20 text-ink hover:bg-ink/[0.05] active:bg-ink/10",
};

const base =
  "inline-flex items-center justify-center rounded-pill font-semibold leading-none tracking-[-0.01em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap";

export function Button({
  size = "md",
  variant = "primary",
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(base, sizeClasses[size], variantClasses[variant], className);

  if (href !== undefined) {
    return (
      <a href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
