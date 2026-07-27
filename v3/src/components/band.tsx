"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * The display line that opens How it works.
 *
 * It sits in a white strip of its own, above the section's eyebrow — the same
 * shape as the reference: one full-bleed white band, one oversized line inside
 * it, nothing else competing for the row.
 *
 * Three things make it read as display type rather than a large headline:
 *
 *  1. It is sized to fill the content column edge to edge. It used to overshoot
 *     the right edge on purpose; cutting the last letter reads as a crop on a
 *     dark full-bleed band, but inside a white strip it just read as broken.
 *     The size is solved for the container, so the fill is exact at any width.
 *  2. The colored word arrives with the scroll — a flat grey copy sits exactly
 *     on top and wipes away left to right.
 *  3. The colored word then keeps moving vertically with the scroll, riding a
 *     few percent up as the strip crosses the viewport, under a gradient that
 *     drifts on its own. A gradient that lands and freezes reads as a picture
 *     of an effect.
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
  const stripRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const maskRef = useRef<HTMLSpanElement>(null);
  const moverRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let sizeFrame = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /**
     * Size the line so it fills its column exactly, whatever the words are and
     * whatever the viewport is.
     *
     * A vw constant can't do this. The column stops growing once the 72rem
     * container starts centring, so a size that fills the row at 1240px leaves
     * a hand's width of air at 1920px — and how much air also depends on how
     * many characters the caller passed. So: measure the natural width once,
     * then solve for the size.
     */
    function fit() {
      sizeFrame = 0;
      const el = lineRef.current;
      const parent = el?.parentElement;
      if (!el || !parent) return;
      el.style.fontSize = "";
      const natural = el.getBoundingClientRect().width;
      if (!natural) return;
      const base = parseFloat(getComputedStyle(el).fontSize);
      // Content box of the column, not clientWidth: the container carries the
      // page gutter as padding, and sizing to include it overflows by exactly
      // that gutter.
      const cs = getComputedStyle(parent);
      const available =
        parent.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      if (available <= 0) return;
      // 0.5% shy of the edge. Text measurement rounds, and landing dead on the
      // boundary is what produces an occasional stray wrap or scrollbar.
      const next = Math.max(
        28,
        Math.min(340, (base * available * 0.995) / natural),
      );
      el.style.fontSize = `${next}px`;
    }

    let lastWipe = -1;
    let lastShift = Number.NaN;

    /**
     * Driven by its own rAF loop, not a scroll listener.
     *
     * Lenis owns the scroll on this page and drives it by writing scroll
     * positions itself; a plain `window.addEventListener("scroll")` does not
     * reliably fire under it, so the wipe would sit at whatever value it had
     * on mount. One getBoundingClientRect per frame is cheaper than the bug,
     * and the writes are skipped unless the values actually moved.
     */
    function apply() {
      frame = requestAnimationFrame(apply);
      // Read the refs live rather than closing over the nodes: under a
      // StrictMode double-mount the captured element can be the discarded one,
      // and the loop then spends its life styling a node nobody can see.
      const el = lineRef.current;
      const strip = stripRef.current;
      const target = maskRef.current;
      const mover = moverRef.current;
      if (!el || !strip || !target || !mover) return;
      const rect = el.getBoundingClientRect();
      const stripRect = strip.getBoundingClientRect();
      const vh = window.innerHeight;

      // Wipe: zero when the line's top edge touches the bottom of the viewport,
      // one by the time the line is sitting at roughly the vertical middle. A
      // wider window finished the colour while the words were still low in
      // frame, so it had already arrived before anyone was looking at it.
      const p = clamp01((vh - rect.top) / (vh - vh * 0.42));
      if (Math.abs(p - lastWipe) > 0.001) {
        lastWipe = p;
        // top right bottom left — the left edge marches right, uncovering the
        // colored copy underneath.
        target.style.clipPath = `inset(-20% 0 -20% ${p * 100}%)`;
      }

      // Drift: measured across the strip's whole passage through the viewport,
      // not the wipe's window, so the word is still moving long after the
      // colour has landed. Down-page scrolling carries it up.
      const q = clamp01((vh - stripRect.top) / (vh + stripRect.height));
      // The word runs the full height of the strip and stops there: at the top
      // of the scroll range its cap-line sits on the strip's top edge, at the
      // bottom its baseline sits on the strip's bottom edge. That range is
      // exactly the air the strip has around the line — the strip's height
      // minus the line's — so it is measured rather than guessed, and the word
      // is never clipped however tall the strip is or however large the fitted
      // size came out. GUARD keeps a hair of white so the letters graze the
      // edges instead of colliding with them.
      const GUARD = 3;
      const travel = Math.max(0, stripRect.height - rect.height - GUARD * 2);
      const shift = (0.5 - q) * travel;
      if (!(Math.abs(shift - lastShift) < 0.25)) {
        lastShift = shift;
        mover.style.transform = `translateY(${shift.toFixed(2)}px)`;
      }
    }

    function onResize() {
      if (!sizeFrame) sizeFrame = requestAnimationFrame(fit);
    }

    fit();
    if (!reduced) frame = requestAnimationFrame(apply);
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
    /* The strip is the component's own, not the caller's. The word's travel is
       measured against it — it rides from the strip's top edge to its bottom
       edge — so the element that defines that range has to be the one this
       component can measure. The padding here IS the travel: it is the only
       air the line has, and all of it is used. */
    <div
      ref={stripRef}
      className={cn(
        "border-b border-espresso/[0.06] bg-white py-11 sm:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* One line, always. The moment it wraps it stops being a statement and
            starts being a paragraph, so the size is solved against the column
            width and the line is held with nowrap. */}
        <p
          ref={lineRef}
          className="flex w-max items-baseline gap-x-[0.16em] whitespace-nowrap font-extrabold leading-[0.84] tracking-[-0.058em]"
          /* Server-render size: close enough to the fitted result at common
             widths that the correction isn't a visible jump, and a sane
             standalone value if the effect never runs. */
          style={{ fontSize: "clamp(2.5rem, 15vw, 20rem)" }}
        >
          <span className="text-espresso/[0.17]">{lead}</span>

          {/* The colored word, with a grey copy stacked exactly on top of it.
              Both are laid out in the same inline box so the wipe can never
              drift out of register with the letters underneath — including
              while the pair is being translated, which is why the transform
              goes on the wrapper and not on either copy. The mask is inset
              vertically by a negative amount so the clip never shaves an
              ascender. */}
          <span
            ref={moverRef}
            className="relative inline-block will-change-transform"
          >
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
      </div>
    </div>
  );
}
