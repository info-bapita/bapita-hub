"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";
import { Falafel, PitaBowl } from "@/components/ui/pita";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import type { ProductId } from "@/lib/products";

/**
 * Pricing is the pita, filled by hand.
 *
 * The old section showed two invented tiers and no arithmetic. This one lets
 * the reader assemble their own bill: toggle a tool, a falafel drops into the
 * pita, and the per-tool rate drops with it. The metaphor from the hero pays
 * off here as the pricing mechanic itself: the fuller the pita, the cheaper
 * each tool.
 *
 * Prices are real (Rami, July 2026): Book is ₪1,500 setup + ₪200/mo, the other
 * three are ₪300/mo each. The bundle ladder below is the only invented part;
 * change BUNDLE_DISCOUNT if the real discount differs.
 */

type Tool = {
  id: ProductId;
  label: string;
  monthly: number;
  /** One-time build fee, charged once regardless of what else is picked. */
  setup?: number;
  /** Resting position inside the pita, as % of the bowl box. */
  x: number;
  y: number;
};

const TOOLS: Tool[] = [
  { id: "book", label: "Book", monthly: 200, setup: 1500, x: 33, y: 9 },
  { id: "social", label: "Social", monthly: 300, x: 52, y: 2 },
  { id: "bots", label: "Bots", monthly: 300, x: 68, y: 10 },
  { id: "reach", label: "Reach", monthly: 300, x: 45, y: 16 },
];

/** Per-tool discount by how many tools are in the pita. */
const BUNDLE_DISCOUNT: Record<number, number> = { 0: 0, 1: 0, 2: 0.05, 3: 0.1, 4: 0.15 };

const shekel = (n: number) => `₪${n.toLocaleString("en-US")}`;

export function Pricing() {
  const [picked, setPicked] = useState<ProductId[]>(["book"]);

  const toggle = (id: ProductId) =>
    setPicked((cur) =>
      cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id],
    );

  const chosen = TOOLS.filter((t) => picked.includes(t.id));
  const count = chosen.length;
  const list = shekel(chosen.reduce((sum, t) => sum + t.monthly, 0));
  const discount = BUNDLE_DISCOUNT[count] ?? 0;
  const listTotal = chosen.reduce((sum, t) => sum + t.monthly, 0);
  const total = Math.round(listTotal * (1 - discount));
  const saving = listTotal - total;
  const perTool = count ? Math.round(total / count) : 0;
  const setup = chosen.reduce((sum, t) => sum + (t.setup ?? 0), 0);

  return (
    <section id="pricing" className="wash-clay py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <Eyebrow className="justify-center">Pricing</Eyebrow>
            <TwoTone
              lead="Fill more of your pita."
              trail="Pay less per tool."
              className="mt-3"
            />
            <Lede className="mx-auto mt-4">
              Pick what you need. <Key>The rate per tool drops as the pita
              fills.</Key>
            </Lede>
          </div>
        </Reveal>

        {/* ── The calculator ── */}
        <Reveal delay={80}>
          <div className="mt-8 rounded-3xl border border-espresso/[0.09] bg-paper-warm p-5 text-center sm:p-7">
            <div className="flex flex-wrap justify-center gap-2.5">
              {TOOLS.map((t) => {
                const on = picked.includes(t.id);
                const Icon = PRODUCT_ICONS[t.id];
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(t.id)}
                    className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-[0.8125rem] font-semibold transition-colors duration-150 ${
                      on
                        ? "border-cinnamon/40 bg-cinnamon/10 text-cinnamon"
                        : "border-espresso/15 text-espresso/55 hover:border-espresso/30 hover:text-espresso"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* The pita, open side up. Falafels fade into the pocket as tools
                are picked; nothing moves position, so toggling reads as
                filling rather than re-laying-out. */}
            <div
              className="relative mx-auto mt-6"
              style={{ width: "min(230px, 56vw)", aspectRatio: "760 / 560" }}
            >
              <PitaBowl className="size-full" />
              {TOOLS.map((t) => {
                const on = picked.includes(t.id);
                return (
                  <div
                    key={t.id}
                    aria-hidden="true"
                    className="absolute z-10 transition-all duration-500 ease-out"
                    style={{
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      transform: `translate(-50%, -50%) scale(${on ? 1 : 0.5})`,
                      opacity: on ? 1 : 0,
                    }}
                  >
                    <Falafel
                      id={t.id}
                      size="min(52px, 12vw)"
                      icon={PRODUCT_ICONS[t.id]}
                    />
                  </div>
                );
              })}
            </div>

            {/* ── The bill ── */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-espresso/[0.09] pt-5">
              <div>
                <p className="text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-espresso">
                  {count ? shekel(total) : shekel(0)}
                </p>
                <p className="mt-2 text-[0.8125rem] text-espresso/45">Per month</p>
              </div>
              <div>
                <p className="text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-espresso">
                  {count ? shekel(perTool) : shekel(0)}
                </p>
                <p className="mt-2 text-[0.8125rem] text-espresso/45">Per tool</p>
              </div>
              <div>
                <p className="text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-espresso">
                  {count} of 4
                </p>
                <p className="mt-2 text-[0.8125rem] text-espresso/45">Tools picked</p>
              </div>
            </div>

            <p className="mt-5 min-h-[1.25rem] text-[0.8125rem] text-espresso/55">
              {count === 0 ? (
                "Pick a tool to see the price."
              ) : (
                <>
                  {setup > 0 && (
                    <>
                      <span className="font-semibold text-espresso">
                        {shekel(setup)} one-time setup
                      </span>{" "}
                      for the booking website
                      {saving > 0 ? " · " : ""}
                    </>
                  )}
                  {saving > 0 && (
                    <>
                      bundle saves you{" "}
                      <span className="font-semibold text-espresso">
                        {shekel(saving)} a month
                      </span>{" "}
                      off {list}
                    </>
                  )}
                </>
              )}
            </p>

            <div className="mt-5">
              <Button href="#connect">
                Book a free call
              </Button>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
