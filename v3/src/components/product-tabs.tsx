"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ArrowUpRight, ArrowRight } from "lucide-react";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { PRODUCT_MOCKS } from "@/components/ui/product-mock";
import { PRODUCTS, type Product, type ProductId } from "@/lib/products";

const ACCENT: Record<ProductId, string> = {
  book: "#e8920a",
  social: "#d4622a",
  bots: "#1fa971",
  reach: "#2d6cf0",
};

/**
 * One line per product, in the owner's language — what changes for them, not
 * what the software does. Deliberately separate from the longer `description`
 * in products.ts: that one explains, this one lands.
 *
 * Each line is set in a different trade on purpose. The page sells to anyone who
 * books appointments — physios, groomers, tattoo studios, trainers — and four
 * lines all set in a barbershop quietly told everyone else this wasn't for them.
 */
const STATEMENT: Record<ProductId, string> = {
  book:
    "A client books a 2am slot from their phone, and your week fills in while you're with someone else.",
  bots:
    "Someone messages the clinic at midnight asking about prices. They get an answer in seconds — and the appointment is already in your calendar.",
  social:
    "A month of posts goes out on schedule, and every comment, DM and review lands in one inbox instead of five apps.",
  reach:
    "When someone nearby searches for a physio, a groomer, a studio like yours — you're the one they find first.",
};

/**
 * Viewport-heights of scroll spent on each product before it hands over.
 * At 85 this took ~800px of scrolling per tab, which read as a stuck page —
 * 50vh puts each hand-over at roughly one flick of the wheel.
 */
const VH_PER_PRODUCT = 50;

/** Tailwind `sm`. Below it the deck is a swipe rail, not a pinned sequence. */
const NARROW = "(max-width: 639px)";

function subscribeNarrow(onChange: () => void) {
  const mq = window.matchMedia(NARROW);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Read as an external store rather than effect-set state: the value decides
 * whether the section is 300vh of pinned scroll or an auto-height rail, and
 * getting that wrong for one frame reflows the whole page under the reader.
 */
function useNarrow() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
}

/**
 * The four products.
 *
 * On a laptop the section pins and each product gets its own stretch of scroll,
 * so reading down the page walks you through all four instead of asking you to
 * notice a tab row and click it.
 *
 * A phone can't hold that: the panel — statement, five features, CTA and the
 * product mock — is roughly twice the height of the screen, and a pinned element
 * taller than the viewport hides its own bottom half with no way to scroll to
 * it. So below `sm` the same four panels become a snap rail you swipe, which is
 * the gesture a phone already has. The tab row drives, and reflects, both.
 */
export function ProductTabs() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const narrow = useNarrow();

  // ── Desktop: scroll position drives the active product ──
  useEffect(() => {
    if (narrow) return;
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
  }, [narrow]);

  // ── Mobile: the rail's own scroll position drives it ──
  useEffect(() => {
    if (!narrow) return;
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    function apply() {
      frame = 0;
      const card = rail!.firstElementChild as HTMLElement | null;
      if (!card) return;
      // Card width plus the flex gap — measured rather than assumed, so the
      // card width can stay a vw value in the markup.
      const step =
        (rail!.scrollWidth - card.offsetWidth) / (PRODUCTS.length - 1) || 1;
      const next = Math.min(
        PRODUCTS.length - 1,
        Math.max(0, Math.round(rail!.scrollLeft / step)),
      );
      setIndex((prev) => (prev === next ? prev : next));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(apply);
    }
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
    };
  }, [narrow]);

  /** Scroll to the middle of a product's stretch, so it lands settled. */
  function goTo(i: number) {
    if (narrow) {
      const rail = railRef.current;
      const card = rail?.children[i] as HTMLElement | undefined;
      if (!rail || !card) return;
      rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: "smooth" });
      return;
    }
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

  return (
    <section
      ref={sectionRef}
      id="products"
      className="wash-clay relative"
      style={
        narrow
          ? undefined
          : { height: `calc(100vh + ${VH_PER_PRODUCT * PRODUCTS.length}vh)` }
      }
    >
      {/* Pinned under the header (h-16) and sized in svh, so what's pinned is
          exactly what's on screen. Auto-height on a phone — see the note on the
          component. */}
      <div
        className={
          narrow
            ? "py-20"
            : "sticky top-16 flex min-h-[calc(100svh-4rem)] flex-col justify-center py-8"
        }
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
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
              Two core tools — Book and Social — with an add-on each. Take{" "}
              <Key>one or take all four</Key>. One login, one bill, and whatever
              you pick gets set up under your own name and colors.
            </Lede>
          </div>

          {/* Tab row — reflects scroll (or swipe) position, and still clickable.
              It scrolls horizontally on the narrowest phones rather than letting
              four labels crush into unreadable stubs. */}
          <div
            role="tablist"
            aria-label="Bapita products"
            className="rail mt-8 flex justify-start gap-1 overflow-x-auto border-b border-espresso/10 px-5 sm:justify-center sm:gap-2 sm:px-8"
          >
            {PRODUCTS.map((product, i) => {
              const isActive = i === index;
              const isAddOn = product.tier === "add-on";
              return (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={
                    isAddOn
                      ? `${product.name}, add-on to ${product.parent === "book" ? "Book" : "Social"}`
                      : product.name
                  }
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  /* Add-ons sit a size down and carry a caret. The row is read
                     left to right as two pairs — main, its add-on, main, its
                     add-on — so the hierarchy is in the row itself and doesn't
                     need a second line of labels under it.
                     min-h-11 keeps every tab a 44px touch target. */
                  className={`-mb-px flex min-h-11 shrink-0 items-center gap-1 border-b-2 pb-3 pt-2 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon/50 ${
                    isAddOn
                      ? "px-2.5 text-[0.8125rem] sm:px-4"
                      : "px-3 text-[0.9375rem] sm:px-6"
                  } ${
                    isActive
                      ? "text-espresso"
                      : `border-transparent hover:text-espresso/70 ${isAddOn ? "text-espresso/25" : "text-espresso/35"}`
                  }`}
                  style={isActive ? { borderColor: ACCENT[product.id] } : undefined}
                >
                  {isAddOn && (
                    <span aria-hidden="true" className="text-espresso/25">
                      ↳
                    </span>
                  )}
                  {product.name}
                </button>
              );
            })}
          </div>

          {narrow ? (
            <>
              {/* Snap rail. All four panels exist, one per card, and the browser
                  does the momentum and the snapping — no scroll listener drives
                  the motion, so a swipe stays on the compositor. */}
              <div
                ref={railRef}
                className="rail mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2"
              >
                {PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    role="tabpanel"
                    aria-label={`Bapita ${product.name}`}
                    className="w-[86vw] shrink-0 snap-center"
                  >
                    <Panel product={product} />
                  </div>
                ))}
              </div>
              <div
                aria-hidden="true"
                className="mt-4 flex justify-center gap-1.5"
              >
                {PRODUCTS.map((product, i) => (
                  <span
                    key={product.id}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === index ? 20 : 6,
                      background:
                        i === index ? ACCENT[product.id] : "rgba(20,20,19,0.15)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-[0.75rem] text-espresso/35">
                Swipe to see all four
              </p>
            </>
          ) : (
            <div
              role="tabpanel"
              aria-label={`Bapita ${active.name}`}
              className="mx-auto mt-6 px-5 sm:px-8"
            >
              <Panel product={active} crossFade />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * One product's case. `crossFade` is for the pinned desktop deck, where the copy
 * has to hand over inside a fixed frame; the mobile rail gives each product its
 * own card, so there is nothing to fade between.
 */
function Panel({ product, crossFade }: { product: Product; crossFade?: boolean }) {
  const accent = ACCENT[product.id];
  const isLive = product.status === "live";
  const parent = product.parent
    ? PRODUCTS.find((p) => p.id === product.parent)
    : undefined;
  const Mock = PRODUCT_MOCKS[product.id];

  return (
    <div className="grid h-full items-center gap-6 overflow-hidden rounded-3xl border border-espresso/[0.07] bg-paper-warm p-5 shadow-[0_20px_60px_-30px_rgba(60,34,12,0.35)] sm:p-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:p-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-pill px-3 py-1 text-[0.75rem] font-bold transition-colors duration-300"
            style={{ background: `${accent}1f`, color: accent }}
          >
            Bapita {product.name}
          </span>
          <span
            className={`rounded-pill px-2.5 py-1 text-[0.6875rem] font-bold ${
              isLive
                ? "bg-success/15 text-success"
                : "bg-espresso/[0.07] text-espresso/50"
            }`}
          >
            {product.statusLabel}
          </span>
          {parent && (
            /* Stated, not implied. Someone landing straight on this tab from
               the tab row needs to know Bots is bought on top of Book, not
               instead of it. */
            <span className="rounded-pill border border-espresso/10 px-2.5 py-1 text-[0.6875rem] font-bold text-espresso/40">
              ↳ Add-on to {parent.name}
            </span>
          )}
        </div>

        {/* Keyed so the copy cross-fades as scroll hands over to the next
            product, rather than swapping abruptly mid-sentence. */}
        <div
          key={product.id}
          className={crossFade ? "animate-[fadeIn_300ms_ease-out]" : undefined}
        >
          <p className="mt-4 text-[1.1875rem] font-bold leading-[1.32] tracking-[-0.02em] text-balance text-espresso sm:mt-5 sm:text-[1.5rem]">
            {STATEMENT[product.id]}
          </p>

          <ul className="mt-5 space-y-2 sm:mt-6 sm:space-y-2.5">
            {product.features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-2.5 text-[0.875rem] text-espresso/65 sm:gap-3 sm:text-[0.9375rem]"
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

        <div className="mt-6 sm:mt-7">
          {isLive ? (
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-bold text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso/70"
            >
              See Bapita {product.name} live
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ) : (
            <a
              href="#connect"
              className="group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-bold text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso/70"
            >
              Get on the list for {product.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>

      {/* What it actually looks like.
          In the pinned deck all four mocks share a single grid cell, so the
          container is as tall as the tallest one and nothing reflows on
          hand-over. The rail doesn't need that — each card owns its mock. */}
      <div
        className="grid rounded-2xl p-3 transition-colors duration-500 sm:p-5"
        style={{
          background: `linear-gradient(150deg, ${accent}14, ${accent}05 60%, transparent)`,
        }}
      >
        {crossFade ? (
          PRODUCTS.map((p) => {
            const Stacked = PRODUCT_MOCKS[p.id];
            const isActive = p.id === product.id;
            return (
              <div
                key={p.id}
                className={`col-start-1 row-start-1 self-center transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <Stacked />
              </div>
            );
          })
        ) : (
          <Mock />
        )}
      </div>
    </div>
  );
}
