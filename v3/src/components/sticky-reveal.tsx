"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Reveal for an element that is itself `position: sticky`.
 *
 * <Reveal> can't be used here, and neither can a wrapper around these cards: it
 * holds a translateY while hidden, and a transformed ancestor becomes the
 * containing block for position sticky, which silently kills the pinning. Even
 * putting the transform on the sticky element itself breaks it, so this
 * component animates opacity only and hands the lift to the card's children via
 * `.step-in` in globals.css — a transform on a sticky element's *descendants*
 * costs nothing.
 *
 * Same reliability contract as <Reveal>: the card is visible by default (server
 * render, no-JS, reduced motion, and if the observer never fires). It is only
 * hidden once an observer is wired that will un-hide it.
 */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const DURATION = 620; // ms
const FAILSAFE_MS = 1600;

type Phase = "static" | "hidden" | "shown";

export function StickyReveal({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setPhase("shown");
      return;
    }

    setPhase("hidden");

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setPhase("shown");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            io.disconnect();
            break;
          }
        }
      },
      // A quarter of the viewport of bottom inset: the card has to be genuinely
      // arriving, not merely one pixel past the fold. Threshold 0 rather than a
      // percentage because these boxes are taller than the viewport and could
      // never satisfy one.
      { threshold: 0, rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);

    // Mount race: if the card is already on screen but the observer hasn't
    // reported, show it. Scoped to in-view elements so the ones further down
    // still get their reveal.
    const timer = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh && rect.bottom > 0) reveal();
    }, FAILSAFE_MS);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <li
      ref={ref}
      className={className}
      data-shown={phase === "hidden" ? "false" : "true"}
      style={{
        ...style,
        ...(phase === "static"
          ? {}
          : {
              opacity: phase === "shown" ? 1 : 0,
              transition: `opacity ${DURATION}ms ${EASE}`,
            }),
      }}
    >
      {children}
    </li>
  );
}
