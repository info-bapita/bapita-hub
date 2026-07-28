"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  Globe,
  MessageCircle,
  BellRing,
  Inbox,
  CalendarClock,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Falafel, PitaBowl } from "@/components/ui/pita";
import { Button } from "@/components/ui/button";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import type { ProductId } from "@/lib/products";

/**
 * The hero IS the metaphor.
 *
 * The concrete things you actually get — a booking website, a WhatsApp
 * assistant, reminders — float above an open pita alongside the four falafels.
 * Scrolling drops the capabilities in first, then the four products they group
 * into, and the payoff line lands once the pita is full. The product claim and
 * the brand image are the same gesture.
 *
 * Earlier the chits named problems (missed WhatsApp, no-show). They now name
 * capabilities: the section sells picking tools, so the floating objects are
 * the menu, not the mess.
 *
 * Scroll-driven rather than auto-playing, so the reader controls the reveal.
 * Progress is written straight to the DOM inside a rAF tick — React never
 * re-renders on scroll, which keeps ten animated nodes on the compositor.
 */

type Base = {
  rx: number;
  ry: number;
  rot: number;
  start: number;
  /** Narrow-viewport resting position. See MOBILE_BP. */
  mob?: { rx: number; ry: number };
};
type Chit = Base & { kind: "chit"; label: string; icon: LucideIcon };
type Ball = Base & { kind: "ball"; id: ProductId; label: string; tier: "main" | "add-on" };
type Obj = Chit | Ball;

/** Falafel diameters. The two mains are the offer; the add-ons hang off them,
 *  so they arrive smaller and just under their parent rather than beside it. */
const BALL_SIZE = {
  main: "clamp(56px, 8vw, 80px)",
  /* Below ~700px the add-on clamp bottomed out ABOVE the main's, which inverted
     the hierarchy on every phone. Its floor is now genuinely smaller. */
  "add-on": "clamp(46px, 7.4vw, 74px)",
} as const;

/**
 * Resting positions are fractions of the scene box, measured from its centre.
 * They deliberately avoid the bottom-centre wedge where the pita sits: the
 * chits live above it and in the side gutters, so nothing is ever hidden behind
 * the bowl before it falls.
 *
 * The scene is split down the middle: Book and everything it does on the left,
 * Social and everything it does on the right. That's why "Auto reminders" sits
 * left with Book and "Unified inbox" sits right with Social — each capability
 * is in the same half as the product that delivers it.
 */
const OBJECTS: Obj[] = [
  { kind: "chit", label: "Booking website", icon: Globe, rx: -0.34, ry: -0.4, rot: -9, start: 0.05, mob: { rx: -0.25, ry: -0.46 } },
  { kind: "chit", label: "Scheduled posts", icon: CalendarClock, rx: 0.3, ry: -0.44, rot: 7, start: 0.09, mob: { rx: 0.25, ry: -0.46 } },
  { kind: "chit", label: "WhatsApp assistant", icon: MessageCircle, rx: -0.44, ry: -0.14, rot: 5, start: 0.13, mob: { rx: -0.24, ry: -0.32 } },
  { kind: "chit", label: "Unified inbox", icon: Inbox, rx: 0.43, ry: -0.16, rot: -6, start: 0.17, mob: { rx: 0.27, ry: -0.32 } },
  { kind: "chit", label: "Auto reminders", icon: BellRing, rx: -0.4, ry: 0.1, rot: 8, start: 0.21, mob: { rx: -0.26, ry: -0.18 } },
  { kind: "chit", label: "Found on Google", icon: MapPin, rx: 0.38, ry: 0.12, rot: -4, start: 0.25, mob: { rx: 0.26, ry: -0.18 } },

  // Book, then what extends it; Social, then what extends it.
  { kind: "ball", id: "book", label: "Book", tier: "main", rx: -0.23, ry: -0.29, rot: 0, start: 0.34, mob: { rx: -0.24, ry: 0.03 } },
  { kind: "ball", id: "bots", label: "Bots", tier: "add-on", rx: -0.25, ry: 0.01, rot: 0, start: 0.4, mob: { rx: -0.25, ry: 0.27 } },
  { kind: "ball", id: "social", label: "Social", tier: "main", rx: 0.22, ry: -0.32, rot: 0, start: 0.46, mob: { rx: 0.24, ry: 0.03 } },
  { kind: "ball", id: "reach", label: "Reach", tier: "add-on", rx: 0.24, ry: -0.01, rot: 0, start: 0.52, mob: { rx: 0.25, ry: 0.27 } },
];

/**
 * Under this the six chits can no longer live in side gutters — a chit is
 * ~140px wide on a phone, which is most of the scene, so anything beside a
 * falafel lands on top of it. The mobile layout drops them into three full-width
 * rows above the falafels instead, which is why every object carries a `mob`
 * position. Same choreography, laid out for the column.
 */
const MOBILE_BP = 640; // Tailwind `sm` — the markup switches at the same width.
/** Scene height the mobile layout is spaced for; shorter phones scale down. */
const MOBILE_REF_H = 400;

/** How much of the scroll each object's arc occupies. */
const FALL_DURATION = 0.16;
/** Must match the PitaBowl box in the markup below. */
const PITA_ASPECT = 560 / 760;
/** Pocket centre, as a fraction of the pita box height from its top. */
const POCKET_Y = 0.14;

const MQ = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Read as an external store, not effect-set state: the value has to be right on
 * the first client render because it decides whether the hero is a pinned
 * scroll sequence or a single static screen.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MQ).matches,
    () => false,
  );
}

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const objRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const payoffRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;

    let frame = 0;

    function apply() {
      frame = 0;
      const rect = section!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;

      const w = scene!.clientWidth;
      const h = scene!.clientHeight;
      const mobile = w < MOBILE_BP;
      // vw, matching the bowl's CSS width — the scene box is narrower than the
      // viewport, so measuring off `w` aimed the fall short of the pocket.
      const pitaW = Math.min(320, window.innerWidth * (mobile ? 0.46 : 0.54));
      const pitaH = pitaW * PITA_ASPECT;
      const targetY = h / 2 - pitaH * (1 - POCKET_Y) - 6;

      // The mobile rows are spaced for MOBILE_REF_H. On a shorter screen the
      // whole arrangement shrinks together rather than letting the rows close
      // up and collide — composition holds, it just gets smaller.
      const fit = mobile
        ? Math.min(1, Math.max(0.7, h / MOBILE_REF_H))
        : 1;

      OBJECTS.forEach((o, i) => {
        const el = objRefs.current[i];
        if (!el) return;

        const t = clamp01((p - o.start) / FALL_DURATION);
        // Ease into the fall so it reads as tipped, not yanked.
        const e = t * t;

        const rest = mobile && o.mob ? o.mob : o;
        const fromX = rest.rx * w;
        const fromY = rest.ry * h;
        const x = fromX + (0 - fromX) * e;
        const y = fromY + (targetY - fromY) * e - Math.sin(t * Math.PI) * h * 0.05;

        // Squash into the pocket over the last fifth of the arc, then vanish.
        const land = clamp01((t - 0.8) / 0.2);

        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${o.rot * (1 - e)}deg) scale(${fit * (1 - land * 0.55)})`;
        el.style.opacity = String(1 - land);
      });

      // The pita warms as it fills. A single opacity write on a plain overlay —
      // deliberately not a `filter` on the bowl, which would re-render its eight
      // gradient layers, blurred shadow and blend-mode grain every frame.
      if (glowRef.current) {
        glowRef.current.style.opacity = String(clamp01((p - 0.05) / 0.6) * 0.55);
      }
      if (payoffRef.current) {
        // Lands well before the section starts releasing, so the payoff has been
        // read by the time the pinned screen begins scrolling away.
        const reveal = clamp01((p - 0.62) / 0.12);
        payoffRef.current.style.opacity = String(reveal);
        payoffRef.current.style.transform = `translate(-50%, ${(1 - reveal) * 16}px)`;
      }
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
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="wash-paper relative"
      /* Enough scroll for ten objects to fall in sequence, tuned so the last
         falafel lands well before the reader would give up on the section. */
      style={{ height: reduced ? "auto" : "260vh" }}
    >
      <div
        className={
          reduced
            ? "px-5 pb-24 pt-16 sm:px-8"
            : /* svh, not vh: with dvh the pinned scene resizes every time the
                 mobile URL bar collapses, and 100vh overflows behind it. */
              /* Pinned BELOW the sticky header (h-16), not under it: at
                 top-0 the last row of falafels was pushed off the bottom of
                 the screen by exactly the header's height. */
              "sticky top-16 flex h-[calc(100svh-4rem)] flex-col items-center overflow-hidden px-5 pb-4 pt-5 sm:px-8 sm:pb-8 sm:pt-14"
        }
      >
        <div className="text-center">
          <Eyebrow className="justify-center">
            For appointment based businesses
          </Eyebrow>

          <TwoTone
            as="h1"
            size="hero"
            lead="Four tools."
            trail="One pita."
            className="mt-2 text-[2.25rem] sm:mt-3 sm:text-display-xl"
          />

          <Lede className="mx-auto mt-3 max-w-xl text-base sm:mt-4 sm:text-xl">
            Pick the tools your business needs.{" "}
            <Key>We build them and set them up under your brand.</Key> You run all
            of it from your phone.
          </Lede>

          <div className="mt-5 flex flex-col items-center gap-3 sm:mt-6">
            <Button href="#connect" size="lg">
              Book a free call
            </Button>
            <a
              href="#products"
              className="-my-2 px-3 py-3 text-sm font-semibold text-espresso/45 underline decoration-espresso/20 underline-offset-4 transition-colors hover:text-espresso hover:decoration-espresso/50"
            >
              See the four tools
            </a>
          </div>
        </div>

        {/* Scene */}
        <div ref={sceneRef} className="relative mt-4 w-full max-w-3xl flex-1">
          {/* Objects sit above the pita so nothing is hidden behind the bowl
              while it floats; the squash-and-fade at the pocket is what sells
              the drop, not z-order. */}
          {OBJECTS.map((o, i) => (
            <div
              key={i}
              ref={(el) => {
                objRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 z-10 will-change-transform"
              style={
                reduced
                  ? {
                      transform: `translate(-50%, -50%) translate3d(${o.rx * 100}%, ${o.ry * 100}%, 0)`,
                    }
                  : undefined
              }
            >
              {/* Opaque fills on purpose. These nodes have their transform
                  rewritten every frame; a backdrop-filter under a moving
                  element re-rasterizes per frame and locks the main thread. */}
              {o.kind === "ball" ? (
                <div className="flex flex-col items-center gap-1.5">
                  <Falafel
                    id={o.id}
                    size={BALL_SIZE[o.tier]}
                    icon={PRODUCT_ICONS[o.id]}
                  />
                  {/* The caret is the whole hierarchy cue on an add-on's chip —
                      a second row of labels under the mains would compete with
                      the six capability chits already in the gutters. */}
                  <span
                    className={`flex items-center gap-1 rounded-pill border border-espresso/[0.06] bg-[var(--color-chip)] px-2.5 py-1 font-bold shadow-sm ${
                      o.tier === "main"
                        ? "text-[14px] text-espresso/80"
                        : "text-[12.5px] text-espresso/70"
                    }`}
                  >
                    {o.tier === "add-on" && (
                      <span aria-hidden="true" className="text-espresso/25">
                        ↳
                      </span>
                    )}
                    {o.label}
                  </span>
                </div>
              ) : (
                <span className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-espresso/[0.08] bg-[var(--color-chip)] px-2.5 py-1.5 text-[11px] font-semibold text-espresso/55 shadow-sm">
                  <o.icon className="h-3 w-3 shrink-0 text-cinnamon/70" strokeWidth={2.4} />
                  {o.label}
                </span>
              )}
            </div>
          ))}

          {/* The pita, bottom-centred. Objects fall into its pocket. */}
          <div
            className="absolute bottom-0 left-1/2 z-0 w-[min(320px,46vw)] -translate-x-1/2 sm:w-[min(320px,54vw)]"
            style={{ aspectRatio: "760 / 560" }}
          >
            <PitaBowl className="size-full" />
            <div
              ref={glowRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[10%] top-[2%] h-[26%] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255, 214, 150, 0.85) 0%, transparent 72%)",
                opacity: 0,
              }}
            />
          </div>

          {/* Payoff, once the pita is full */}
          <div
            ref={payoffRef}
            /* Sits above the rim, not across the bowl — it's the outcome of the
               pita being full, not a label stuck on it. */
            className="absolute bottom-[52%] left-1/2 z-20 w-max max-w-[calc(100vw-2.5rem)] text-center sm:bottom-[54%]"
            style={reduced ? { transform: "translate(-50%, 0)" } : { opacity: 0, transform: "translate(-50%, 16px)" }}
          >
            <span className="inline-flex items-center gap-2 rounded-pill border border-espresso/10 bg-[var(--color-chip)] px-3.5 py-2 text-[0.75rem] font-bold text-espresso shadow-[0_10px_30px_-12px_rgba(60,34,12,0.4)] sm:px-4 sm:text-[0.8125rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              One dashboard. One bill. One person to call.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
