"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { FALAFEL_COLORS } from "@/components/ui/pita";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";

/**
 * The only section on the page that gets numerals.
 *
 * Everywhere else the chapter marker is a colored falafel dot, because those
 * sections aren't ordered — numbering them would be decoration. This one is a
 * genuine sequence: the reader needs to know the call comes before the build,
 * and the build before the dashboard. So it's numbered, in the utility face.
 */

const STEPS = [
  {
    n: "01",
    title: "Pick your tools",
    body: "A 20-minute call. Tell us what's actually costing you time — we'll tell you which of the four fixes it, and which you can skip.",
  },
  {
    n: "02",
    title: "We build it, under your name",
    body: "Your colors, your logo, your domain. We configure it, load your services and prices, and launch it. You don't touch a setting.",
  },
  {
    n: "03",
    title: "You run it from your phone",
    body: "Check today's bookings, see what posted, adjust a price. Add another tool whenever you want — no rebuild, no waiting.",
  },
];

/* ── Step panels ───────────────────────────────────────────── */

function PickPanel() {
  return (
    <div className="w-full max-w-[320px] space-y-2">
      {PRODUCTS.map((p, i) => {
        const Icon = PRODUCT_ICONS[p.id];
        const picked = i < 2;
        return (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3"
            style={{
              borderColor: picked
                ? `${FALAFEL_COLORS[p.id].base}66`
                : "rgba(42,29,20,0.07)",
            }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `radial-gradient(circle at 32% 28%, ${FALAFEL_COLORS[p.id].highlight}, ${FALAFEL_COLORS[p.id].base} 60%, ${FALAFEL_COLORS[p.id].deep})`,
              }}
            >
              <Icon className="h-3.5 w-3.5 text-espresso/55" strokeWidth={2.4} />
            </span>
            <span className="flex-1 text-[0.8125rem] font-bold text-espresso">
              {p.name}
            </span>
            {picked ? (
              <Check
                className="h-4 w-4"
                style={{ color: FALAFEL_COLORS[p.id].base }}
                strokeWidth={3}
              />
            ) : (
              <Plus className="h-4 w-4 text-espresso/20" />
            )}
          </div>
        );
      })}
      <p className="pt-1 text-center text-[0.6875rem] text-espresso/40">
        Start with two. Add the rest later.
      </p>
    </div>
  );
}

function BuildPanel() {
  return (
    <div className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-espresso/[0.08] bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-espresso/[0.06] bg-clay/60 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-book" />
        <span className="font-mono text-[0.625rem] text-espresso/45">
          shimi.bapita.com
        </span>
      </div>
      <div className="h-20 bg-gradient-to-br from-clay-toast to-bowl-tan/70" />
      <div className="space-y-2 p-3.5">
        <div className="h-2.5 w-3/4 rounded-full bg-espresso/[0.12]" />
        <div className="h-2.5 w-1/2 rounded-full bg-espresso/[0.07]" />
        <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-success/10 px-2.5 py-2">
          <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
          <span className="text-[0.6875rem] font-bold text-success">
            Live · 41 hours
          </span>
        </div>
      </div>
    </div>
  );
}

function RunPanel() {
  const stats = [
    { label: "Booked", value: "128" },
    { label: "Posts out", value: "12" },
    { label: "Replies", value: "212" },
  ];
  return (
    <div className="w-full max-w-[300px] space-y-2.5">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-espresso/[0.07] bg-white px-2 py-3 text-center"
          >
            <div className="text-lg font-extrabold tabular-nums text-espresso">
              {s.value}
            </div>
            <div className="mt-0.5 text-[0.625rem] text-espresso/40">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-espresso/[0.07] bg-white px-3 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <span className="text-[0.6875rem] text-espresso/55">
          This month · updated just now
        </span>
      </div>
      <div className="flex gap-2">
        {PRODUCTS.map((p) => {
          const Icon = PRODUCT_ICONS[p.id];
          return (
            <span
              key={p.id}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-espresso/[0.07] bg-white"
              style={{ color: FALAFEL_COLORS[p.id].base }}
            >
              <Icon className="h-4 w-4" />
            </span>
          );
        })}
      </div>
    </div>
  );
}

const PANELS = [PickPanel, BuildPanel, RunPanel];

/* ── Section ───────────────────────────────────────────────── */

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.getAttribute("data-index")));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="wash-cool py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <TwoTone
              size="sm"
              lead="From “I need this”"
              trail="to live in 48 hours."
              className="mt-3"
            />
            <Lede className="mt-4 max-w-xl text-base sm:text-lg">
              You have <Key>one call and one decision</Key>. Everything after that is
              on us.
            </Lede>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Steps */}
          <ol className="flex flex-col gap-10 sm:gap-14">
            {STEPS.map((step, i) => {
              const Panel = PANELS[i];
              const isActive = active === i;
              return (
                <li
                  key={step.n}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="relative"
                >
                  <span
                    className={`font-mono text-[0.8125rem] font-bold tracking-[0.1em] transition-colors duration-300 ${
                      isActive ? "text-cinnamon" : "text-espresso/25"
                    }`}
                  >
                    {step.n}
                  </span>
                  <h3
                    className={`mt-1.5 text-[1.25rem] font-extrabold tracking-[-0.025em] transition-colors duration-300 sm:text-[1.375rem] ${
                      isActive ? "text-espresso" : "text-espresso/45"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-espresso/55 sm:text-base">
                    {step.body}
                  </p>

                  {/* Mobile: the panel travels inline with its own step. */}
                  <div className="mt-5 flex justify-center rounded-2xl border border-espresso/[0.07] bg-clay/50 p-5 lg:hidden">
                    <Panel />
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Desktop: one pinned panel that swaps with the active step. */}
          <div className="relative hidden lg:block">
            <div className="sticky top-24">
              <div className="relative flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-3xl border border-espresso/[0.07] bg-clay/60 p-6 shadow-[0_20px_60px_-30px_rgba(60,34,12,0.35)]">
                {PANELS.map((Panel, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-500 ${
                      active === i ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    <Panel />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-bold text-espresso sm:text-xl">
              That&apos;s it — you&apos;re live in 48 hours.
            </p>
            <Button href="#connect" size="lg">
              Book a free call
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
