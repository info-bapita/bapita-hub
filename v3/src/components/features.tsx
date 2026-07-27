"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Clock, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { Falafel } from "@/components/ui/pita";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { PRODUCTS, SERVED_CATEGORIES } from "@/lib/products";

/**
 * The reasons to trust it, as a horizontal rail of mixed cards.
 *
 * Deliberately not a grid of identical icon-and-paragraph tiles — the card
 * shapes differ (a clip, an object, a claim, a list) so the section reads as one
 * considered spread rather than a feature dump. Native scroll-snap does the
 * work; the arrows are a convenience, not the only way through.
 *
 * The three statistic cards used to be a standalone band on the second fold,
 * where three bare percentages arrived before the reader knew what the product
 * was. They earn their place here: each one now plays the thing it claims, so
 * the number is evidence for a card rather than a fact on its own.
 */

const PROMISES = [
  "Hebrew or English, your call",
  "Runs on the phone you already have",
  "WhatsApp & SMS reminders included",
  "Your client list stays yours",
  "No commission on a single booking",
  "Cancel any tool, any month",
];

/** Doubled so each marquee row loops seamlessly. */
const CATEGORY_LOOP = [...SERVED_CATEGORIES, ...SERVED_CATEGORIES];

export function Features() {
  const rail = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  }

  return (
    <section className="wash-paper overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <Eyebrow>Why this works</Eyebrow>
              <TwoTone lead="Built by hand." trail="Run by you." className="mt-4" />
              <Lede className="mt-6">
                You know your trade. We know the software. We do the setup once, then{" "}
                <Key>hand you something simple enough to run between clients</Key>.
              </Lede>
            </div>

            <div className="flex gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => scrollBy(dir)}
                  aria-label={dir === -1 ? "Previous cards" : "Next cards"}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/15 text-espresso/60 transition-colors hover:bg-espresso/[0.05] hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon/50"
                >
                  {dir === -1 ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Rail — bleeds off the right edge so it reads as continuing. */}
      <div
        ref={rail}
        className="rail mt-14 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        {/* 1 — after hours: bookings landing while the shop is shut */}
        <Card glow="#d4622a" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat value="35%" label="of appointments get booked after business hours" />
          <Scene className="mt-6 flex-1 justify-center gap-2">
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-espresso/40">
              <Clock className="h-3 w-3" strokeWidth={2.4} />
              Shop closed 19:00
            </p>
            {[
              { t: "21:40", s: "Haircut · ₪80" },
              { t: "23:15", s: "Beard trim · ₪50" },
              { t: "02:07", s: "Cut + beard · ₪120" },
            ].map((row, i) => (
              <div
                key={row.t}
                className={`fx-row ${DELAY[i]} flex items-center gap-2.5 rounded-lg border border-espresso/[0.07] bg-paper-warm px-2.5 py-2`}
              >
                <span className="font-mono text-[0.75rem] font-bold tabular-nums text-espresso">
                  {row.t}
                </span>
                <span className="min-w-0 truncate text-[0.75rem] text-espresso/55">
                  {row.s}
                </span>
                <Check
                  className="ml-auto h-3.5 w-3.5 shrink-0 text-success"
                  strokeWidth={3}
                />
              </div>
            ))}
          </Scene>
        </Card>

        {/* 2 — first reply wins: your answer against the shop that never replies */}
        <Card glow="#e0457b" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat value="78%" label="of customers book with whoever answers first" />
          <Scene className="mt-6 flex-1 justify-center gap-5">
            <Race
              who="You, on Bapita"
              detail="replied in 4 seconds"
              fill="fx-fill-fast"
              color="#1fa971"
            />
            <Race
              who="The shop down the road"
              detail={<TypingDots />}
              fill="fx-fill-slow"
              color="rgba(42,29,20,0.22)"
            />
          </Scene>
        </Card>

        {/* 3 — reminders: the message goes out, the seat gets confirmed */}
        <Card glow="#1fa971" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat value="80%" label="fewer no-shows once reminders go out on their own" />
          <Scene className="mt-6 flex-1 justify-center">
            {/* Both beats share one grid cell so the card never reflows mid-loop. */}
            <div className="grid">
              <div className="fx-send col-start-1 row-start-1 self-center">
                <div className="flex items-start gap-2 rounded-2xl rounded-tl-md border border-espresso/[0.07] bg-paper-warm px-3 py-2.5">
                  <MessageCircle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cinnamon"
                    strokeWidth={2.4}
                  />
                  <p className="text-[0.75rem] leading-snug text-espresso/70">
                    Hi Dana, tomorrow at 16:00 with Shimi. Reply{" "}
                    <span className="font-bold text-espresso">1</span> to confirm.
                  </p>
                </div>
              </div>
              <div className="fx-confirm col-start-1 row-start-1 flex items-center justify-center self-center">
                <span className="inline-flex items-center gap-2 rounded-pill bg-success/12 px-3.5 py-2 text-[0.8125rem] font-bold text-success">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Confirmed. Seat held
                </span>
              </div>
            </div>
          </Scene>
        </Card>

        {/* 4 — the object card */}
        <Card glow="#c8893f" className="flex min-h-[380px] w-[300px] flex-col justify-between sm:w-[340px]">
          <div className="relative flex flex-1 items-center justify-center">
            <div
              className="absolute h-40 w-40 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, #f0743a55, transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-3">
              {PRODUCTS.map((p, i) => (
                <div key={p.id} className={`fx-bob ${DELAY[i % DELAY.length]}`}>
                  <Falafel id={p.id} size="58px" icon={PRODUCT_ICONS[p.id]} />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-[1.0625rem] font-bold leading-snug text-espresso">
            Four tools built for one trade.{" "}
            <span className="font-medium text-espresso/50">
              Not a general-purpose platform you have to bend into shape.
            </span>
          </p>
        </Card>

        {/* 5 — the claim card */}
        <Card glow="#2d6cf0" className="flex min-h-[380px] w-[300px] items-center sm:w-[380px]">
          <p className="text-[1.375rem] font-bold leading-[1.35] tracking-[-0.02em] text-espresso">
            <span className="font-medium text-espresso/45">
              Marketplaces take 20% of every booking and keep the client. We take
            </span>{" "}
            nothing per booking, and your client list is yours to export any day you
            like.
          </p>
        </Card>

        {/* 6 — the list card */}
        <Card glow="#1fa971" className="flex min-h-[380px] w-[300px] flex-col justify-center sm:w-[340px]">
          <p className="mb-6 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-cinnamon">
            Included, always
          </p>
          <ul className="space-y-3.5">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.9375rem] text-espresso/70">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </Card>

        {/* 7 — who it's for. The old page-wide category strip, now a card: two
               rows drifting in opposite directions so it reads as a long list
               rather than a decorative band. */}
        <Card glow="#d4622a" className="flex min-h-[380px] w-[300px] flex-col justify-center sm:w-[340px]">
          <p className="text-[1.0625rem] font-bold leading-snug text-espresso">
            Built for shops where the calendar{" "}
            <span className="font-medium text-espresso/50">is the business.</span>
          </p>
          <div className="-mx-7 mt-7 space-y-2.5 sm:-mx-8">
            <p className="sr-only">Business types Bapita is built for</p>
            {(["marquee-track", "marquee-rev"] as const).map((track, row) => (
              <div key={track} className="overflow-hidden" aria-hidden="true">
                <div className={`${track} flex items-center whitespace-nowrap`}>
                  {CATEGORY_LOOP.map((cat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center text-[0.8125rem] font-medium text-espresso/55"
                    >
                      {/* Offset the second row so the two never line up. */}
                      {row === 1 ? CATEGORY_LOOP[(i + 3) % CATEGORY_LOOP.length] : cat}
                      <span className="mx-4 inline-block h-1 w-1 rounded-full bg-cinnamon/40" />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 8 — the closing card */}
        <Card glow="#e0457b" className="flex min-h-[380px] w-[300px] items-center sm:w-[340px]">
          <div>
            <p className="text-[1.375rem] font-bold leading-[1.35] tracking-[-0.02em] text-espresso">
              Something breaks, you message a person.
            </p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-espresso/50">
              Not a ticket number, not a chatbot, not a queue in another timezone.
              Usually the same person who built your setup.
            </p>
          </div>
        </Card>

        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mt-12 max-w-md text-[0.9375rem] leading-relaxed text-espresso/50">
            Every missed message is a client someone else booked.{" "}
            <a
              href="#connect"
              className="font-semibold text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso/70"
            >
              Let&apos;s fix that
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Warm card with a colored edge-glow, tinted per card. */
function Card({
  glow,
  className,
  children,
}: {
  glow: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`lift shrink-0 rounded-3xl border p-7 sm:p-8 ${className ?? ""}`}
      style={{
        borderColor: `${glow}33`,
        background: `linear-gradient(165deg, ${glow}12, #FDFBF7 42%)`,
        boxShadow: `0 1px 0 ${glow}22 inset, 0 14px 40px -22px rgba(60,34,12,0.28)`,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger classes, in order. Defined in globals.css after the loop classes. */
const DELAY = ["", "fx-d1", "fx-d2", "fx-d3"] as const;

/** The number, then what it means. Only the statistic cards carry one. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-espresso">
        {value}
      </p>
      <p className="mt-2 text-[0.9375rem] leading-snug text-espresso/55">{label}</p>
    </div>
  );
}

/**
 * The stage a card's clip plays on. Recessed rather than raised — the loop is
 * evidence sitting inside the card, not a second card on top of it.
 */
function Scene({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-espresso/[0.06] bg-espresso/[0.025] p-3 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** One competitor in the who-replied-first clip. */
function Race({
  who,
  detail,
  fill,
  color,
}: {
  who: string;
  detail: React.ReactNode;
  fill: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.75rem] font-bold text-espresso">{who}</span>
        <span className="text-[0.6875rem] text-espresso/45">{detail}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-espresso/[0.07]">
        <div className={`${fill} h-full w-full rounded-full`} style={{ background: color }} />
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="still typing">
      typing
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="fx-dot inline-block h-1 w-1 rounded-full bg-espresso/45"
          /* Inline, not the fx-d* classes: those are tuned to the 6.4s card
             cycle and would put a visible gap between the three dots. */
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
