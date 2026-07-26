"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { Falafel } from "@/components/ui/pita";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { PRODUCTS } from "@/lib/products";

/**
 * The reasons to trust it, as a horizontal rail of mixed cards.
 *
 * Deliberately not a grid of identical icon-and-paragraph tiles — the card
 * shapes differ (an object, a claim, numbers, a list) so the section reads as
 * one considered spread rather than a feature dump. Native scroll-snap does the
 * work; the arrows are a convenience, not the only way through.
 */

const PROMISES = [
  "Hebrew or English, your call",
  "Runs on the phone you already have",
  "WhatsApp & SMS reminders included",
  "Your client list stays yours",
  "No commission on a single booking",
  "Cancel any tool, any month",
];

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
        {/* 1 — the object card */}
        <Card glow="#d4622a" className="flex min-h-[380px] w-[300px] flex-col justify-between sm:w-[340px]">
          <div className="relative flex flex-1 items-center justify-center">
            <div
              className="absolute h-40 w-40 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, #f0743a55, transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-3">
              {PRODUCTS.map((p) => (
                <Falafel key={p.id} id={p.id} size="58px" icon={PRODUCT_ICONS[p.id]} />
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

        {/* 2 — the claim card */}
        <Card glow="#1fa971" className="flex min-h-[380px] w-[300px] items-center sm:w-[380px]">
          <p className="text-[1.375rem] font-bold leading-[1.35] tracking-[-0.02em] text-espresso">
            <span className="font-medium text-espresso/45">
              Marketplaces take 20% of every booking and keep the client. We take
            </span>{" "}
            nothing per booking, and your client list is yours to export any day you
            like.
          </p>
        </Card>

        {/* 3 — the numbers card */}
        <Card glow="#e0457b" className="flex min-h-[380px] w-[280px] flex-col justify-center gap-7 sm:w-[300px]">
          {[
            { v: "48h", l: "from call to live" },
            { v: "0", l: "settings you configure" },
            { v: "1", l: "dashboard, one bill" },
          ].map((m) => (
            <div key={m.l}>
              <p className="text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-espresso">
                {m.v}
              </p>
              <p className="mt-1.5 text-[0.9375rem] text-espresso/50">{m.l}</p>
            </div>
          ))}
        </Card>

        {/* 4 — the list card */}
        <Card glow="#2d6cf0" className="flex min-h-[380px] w-[300px] flex-col justify-center sm:w-[340px]">
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

        {/* 5 — the closing card */}
        <Card glow="#c8893f" className="flex min-h-[380px] w-[300px] items-center sm:w-[340px]">
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
