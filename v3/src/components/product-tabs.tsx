"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ArrowUpRight, ArrowRight } from "lucide-react";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { PRODUCT_MOCKS } from "@/components/ui/product-mock";
import { PRODUCTS, type ProductId } from "@/lib/products";

const ACCENT: Record<ProductId, string> = {
  book: "#d4622a",
  social: "#1fa971",
  bots: "#e0457b",
  reach: "#2d6cf0",
};

/**
 * One line per product, in the owner's language — what changes for them, not
 * what the software does. Deliberately separate from the longer `description`
 * in products.ts: that one explains, this one lands.
 */
const STATEMENT: Record<ProductId, string> = {
  book:
    "Clients book themselves at 2am from their phone, and your calendar fills while you're cutting.",
  social:
    "A week of posts goes out on schedule, so you look active without opening Instagram once.",
  bots:
    "Every WhatsApp message gets an answer in seconds, and the booking lands in your calendar.",
  reach:
    "When someone nearby searches for what you do, you're the shop they find first.",
};

/**
 * Viewport-heights of scroll spent on each product before it hands over.
 * At 85 this took ~800px of scrolling per tab, which read as a stuck page —
 * 50vh puts each hand-over at roughly one flick of the wheel.
 */
const VH_PER_PRODUCT = 50;

/**
 * The four products, advanced by scroll.
 *
 * The section pins and each product gets its own stretch of scroll, so reading
 * down the page walks you through all four instead of asking you to notice a tab
 * row and click it. The tabs stay real controls — clicking one scrolls to that
 * product's stretch, which keeps the scroll position and the visible panel from
 * ever disagreeing.
 */
export function ProductTabs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    function apply() {
      frame = 0;
      const rect = section!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = -rect.top / scrollable;
      // Clamped so the first and last products hold while the section enters
      // and leaves, instead of flickering at the boundaries.
      const next = Math.min(
        PRODUCTS.length - 1,
        Math.max(0, Math.floor(p * PRODUCTS.length)),
      );
      setIndex((prev) => (prev === next ? prev : next));
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /** Scroll to the middle of a product's stretch, so it lands settled. */
  function goTo(i: number) {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    const top = section.offsetTop + scrollable * ((i + 0.5) / PRODUCTS.length);
    // Must go through Lenis when it's mounted: a raw window.scrollTo fights its
    // running animation and the scroll position oscillates, which makes the
    // active tab flicker between two products.
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    goTo((i + dir + PRODUCTS.length) % PRODUCTS.length);
  }

  const active = PRODUCTS[index];
  const accent = ACCENT[active.id];
  const isLive = active.status === "live";

  return (
    <section
      ref={sectionRef}
      id="products"
      className="wash-clay relative"
      style={{ height: `calc(100vh + ${VH_PER_PRODUCT * PRODUCTS.length}vh)` }}
    >
      {/* Everything in here has to fit inside one viewport — it's pinned, so
          anything taller than the screen can never be scrolled to. */}
      <div className="sticky top-0 flex min-h-screen flex-col justify-center py-10">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Products</Eyebrow>
            {/* Both lines stay one line each at every breakpoint — the moment the
                lead wraps, the two-tone device stops reading as two statements. */}
            <TwoTone
              size="sm"
              lead="Four tools you need."
              trail="Built, branded, running."
              className="mt-3"
            />
            <Lede className="mx-auto mt-4 text-base sm:text-lg">
              Four tools, one login, one bill. Take <Key>one or take all four</Key>.
              We set up whichever you pick, under your own name and colors.
            </Lede>
          </div>

          {/* Tab row — reflects scroll position, and still clickable. */}
          <div
            role="tablist"
            aria-label="Bapita products"
            className="mt-8 flex justify-center gap-1 border-b border-espresso/10 sm:gap-2"
          >
            {PRODUCTS.map((product, i) => {
              const isActive = i === index;
              return (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`-mb-px shrink-0 border-b-2 px-3 pb-3 pt-1 text-[0.9375rem] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon/50 sm:px-6 ${
                    isActive
                      ? "text-espresso"
                      : "border-transparent text-espresso/35 hover:text-espresso/70"
                  }`}
                  style={isActive ? { borderColor: ACCENT[product.id] } : undefined}
                >
                  {product.name}
                </button>
              );
            })}
          </div>

          {/* Active product panel */}
          <div
            role="tabpanel"
            aria-label={`Bapita ${active.name}`}
            className="mt-6 grid items-center gap-6 overflow-hidden rounded-3xl border border-espresso/[0.07] bg-paper-warm p-6 shadow-[0_20px_60px_-30px_rgba(60,34,12,0.35)] lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:p-8"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="rounded-pill px-3 py-1 text-[0.75rem] font-bold transition-colors duration-300"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  Bapita {active.name}
                </span>
                <span
                  className={`rounded-pill px-2.5 py-1 text-[0.6875rem] font-bold ${
                    isLive
                      ? "bg-success/15 text-success"
                      : "bg-espresso/[0.07] text-espresso/50"
                  }`}
                >
                  {active.statusLabel}
                </span>
              </div>

              {/* Keyed so the copy cross-fades as scroll hands over to the next
                  product, rather than swapping abruptly mid-sentence. */}
              <div key={active.id} className="animate-[fadeIn_300ms_ease-out]">
                <p className="mt-5 text-[1.25rem] font-bold leading-[1.32] tracking-[-0.02em] text-balance text-espresso sm:text-[1.5rem]">
                  {STATEMENT[active.id]}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {active.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-[0.9375rem] text-espresso/65"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: accent }}
                        strokeWidth={3}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7">
                {isLive ? (
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-bold text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso/70"
                  >
                    See Bapita Book live
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <a
                    href="#connect"
                    className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-bold text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso/70"
                  >
                    Get on the list for {active.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </div>

            {/* What it actually looks like.
                All four mocks share a single grid cell, so the container is as
                tall as the tallest one and nothing reflows on hand-over. An
                earlier version left the active mock in flow and absolutely
                positioned the rest, which made them overlap mid-fade. */}
            <div
              className="grid rounded-2xl p-3 transition-colors duration-500 sm:p-5"
              style={{
                background: `linear-gradient(150deg, ${accent}14, ${accent}05 60%, transparent)`,
              }}
            >
              {PRODUCTS.map((p) => {
                const Mock = PRODUCT_MOCKS[p.id];
                const isActive = p.id === active.id;
                return (
                  <div
                    key={p.id}
                    className={`col-start-1 row-start-1 self-center transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={!isActive}
                  >
                    <Mock />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
