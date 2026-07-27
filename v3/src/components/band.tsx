"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * The display line that opens How it works.
 *
 * Not a section of its own any more. It used to sit between the products and
 * the steps as a standalone "breath", which meant the page fired two headers
 * back to back — giant words, then a second small headline 200px later — and
 * the two competed. It is now the header of the steps section itself, which is
 * also what the reference does: the oversized words ARE the chapter title, and
 * the supporting line sits directly under them.
 *
 * Three things make it read as display type rather than a large headline:
 *
 *  1. It starts at the page gutter and runs OFF the right edge. Centering it
 *     with air on both sides is what made it look timid at any size.
 *  2. The size is driven off viewport width with no practical cap, so the bleed
 *     is proportional instead of disappearing on wide screens.
 *  3. The colored word arrives with the scroll — a flat grey copy sits exactly
 *     on top and wipes away left to right — and then keeps moving, slowly,
 *     under a drifting gradient. A gradient that lands and freezes reads as a
 *     picture of an effect.
 *
 * Progress is written straight to the DOM inside a rAF tick, so nothing
 * re-renders while the wipe plays.
 */

/**
 * Warm ramp, not the four product colors.
 *
 * Running orange → green → magenta → blue across the letters read as a rainbow.
 * This stays in one family — book amber through a hot vermilion into the bots
 * magenta — so the word reads as one object that happens to be lit.
 *
 * The midpoint used to be #d4622a, a brick that went muddy exactly where the
 * word is widest. #ee5528 keeps the saturation up through the middle.
 */
const FILL = "linear-gradient(98deg, #ef910a 0%, #ee5528 45%, #cf4f7e 100%)";

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function Band({
  lead = "Work",
  trail = "smarter",
  className,
}: {
  lead?: string;
  trail?: string;
  className?: string;
}) {
  const lineRef = useRef<HTMLParagraphElement>(null);
  const maskRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let sizeFrame = 0;

    /**
     * Size the line so it always overshoots the right edge by the same
     * fraction of the space it has, whatever the words are and whatever the
     * viewport is.
     *
     * A vw constant can't do this. The line starts at the page gutter, and
     * that gutter grows once the 72rem container starts centring, so a size
     * that bleeds correctly at 1240px sits well inside the edge at 1920px —
     * and the amount of bleed also depends on how many characters the caller
     * passed. So: measure the natural width once, then solve for the size.
     */
    function fit() {
      sizeFrame = 0;
      const el = lineRef.current;
      if (!el) return;
      el.style.fontSize = "";
      const natural = el.getBoundingClientRect().width;
      if (!natural) return;
      const base = parseFloat(getComputedStyle(el).fontSize);
      const available =
        document.documentElement.clientWidth - el.getBoundingClientRect().left;
      // 7.5% past the edge: enough that the last letter is unmistakably cut,
      // little enough that it never eats a second one.
      const target = available * 1.075;
      const next = Math.max(44, Math.min(520, (base * target) / natural));
      el.style.fontSize = `${next}px`;
    }

    let last = -1;

    /**
     * Driven by its own rAF loop, not a scroll listener.
     *
     * Lenis owns the scroll on this page and drives it by writing scroll
     * positions itself; a plain `window.addEventListener("scroll")` does not
     * reliably fire under it, so the wipe would sit at whatever value it had
     * on mount. One getBoundingClientRect per frame is cheaper than the bug,
     * and the write is skipped unless the value actually moved.
     */
    function apply() {
      frame = requestAnimationFrame(apply);
      // Read the refs live rather than closing over the nodes: under a
      // StrictMode double-mount the captured element can be the discarded one,
      // and the loop then spends its life styling a node nobody can see.
      const el = lineRef.current;
      const target = maskRef.current;
      if (!el || !target) return;
      const rect = el.getBoundingClientRect();
      // Zero when the line's top edge touches the bottom of the viewport, one
      // by the time the line is sitting at roughly the vertical middle. The
      // old window finished the wipe while the words were still low in frame,
      // so the colour had already arrived before anyone was looking at it.
      const vh = window.innerHeight;
      const start = vh;
      const end = vh * 0.42;
      const p = clamp01((start - rect.top) / (start - end));
      if (Math.abs(p - last) > 0.001) {
        last = p;
        // top right bottom left — the left edge marches right, uncovering the
        // colored copy underneath.
        target.style.clipPath = `inset(-20% 0 -20% ${p * 100}%)`;
      }
    }

    function onResize() {
      if (!sizeFrame) sizeFrame = requestAnimationFrame(fit);
    }

    fit();
    frame = requestAnimationFrame(apply);
    // Webfont swap changes the natural width under us; re-fit once Heebo has
    // actually landed rather than sizing off the fallback metrics.
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (sizeFrame) cancelAnimationFrame(sizeFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    /* One line, always. The moment it wraps it stops being a statement and
       starts being a paragraph, so the size is driven off the viewport width
       and the line is held with nowrap. The clipping happens on the section,
       not here — this element is deliberately allowed to overflow. */
    <p
      ref={lineRef}
      className={cn(
        "flex w-max items-baseline gap-x-[0.16em] whitespace-nowrap font-extrabold leading-[0.84] tracking-[-0.058em]",
        className,
      )}
      /* Server-render size: close enough to the fitted result at common
         widths that the correction isn't a visible jump, and a sane standalone
         value if the effect never runs. */
      style={{ fontSize: "clamp(3.25rem, 18.5vw, 26rem)" }}
    >
      <span className="text-espresso/[0.17]">{lead}</span>

      {/* The colored word, with a grey copy stacked exactly on top of it. Both
          are laid out in the same inline box so the wipe can never drift out of
          register with the letters underneath. The mask is inset vertically by
          a negative amount so the clip never shaves an ascender. */}
      <span className="relative">
        <span
          className="band-fill"
          style={{
            backgroundImage: FILL,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {trail}
        </span>
        <span
          ref={maskRef}
          aria-hidden="true"
          className="absolute inset-0 text-espresso/[0.17]"
          style={{ clipPath: "inset(-20% 0 -20% 0)" }}
        >
          {trail}
        </span>
      </span>
    </p>
  );
}
