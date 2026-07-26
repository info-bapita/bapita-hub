import { Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";

/**
 * A price anchor, finally.
 *
 * The old homepage showed no number anywhere, so a visitor couldn't tell whether
 * this was ₪100 or ₪1,000 a month and had to book a call to find out — which is
 * exactly the friction that loses the visitors who would have qualified
 * themselves. Sales still closes the real number on the call; this just puts the
 * range on the table.
 *
 * NOTE (Rami): ₪150 / ₪300 come from the founding deal. Confirm before this goes
 * live, or hand me the real tiers and I'll swap them.
 */

const TIERS = [
  {
    name: "One tool",
    price: "₪150",
    unit: "/ month",
    blurb: "Pick the one that's costing you the most right now.",
    features: [
      "One tool, fully set up",
      "Your brand, your domain",
      "Live in 48 hours",
      "WhatsApp support from me",
      "Cancel any month",
    ],
    featured: false,
  },
  {
    name: "The full pita",
    price: "₪300",
    unit: "/ month",
    blurb: "All four tools, one dashboard, one bill.",
    features: [
      "Book, Social, Bots & Reach",
      "One dashboard for everything",
      "Priority setup and changes",
      "New tools added as they ship",
      "Founding-client rate, locked",
    ],
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="wash-clay py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <Eyebrow className="justify-center">Pricing</Eyebrow>
            <TwoTone
              lead="Less than one no-show."
              trail="Per month."
              className="mt-4"
            />
            <Lede className="mx-auto mt-6">
              A one-time setup fee, then a flat monthly rate.{" "}
              <Key>No commission on your bookings</Key>, ever. Exact number is
              confirmed on the call, based on what you pick.
            </Lede>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-7 sm:p-8 ${
                  tier.featured
                    ? "border-espresso/20 bg-paper-warm shadow-[0_24px_60px_-28px_rgba(60,34,12,0.4)]"
                    : "border-espresso/[0.09] bg-paper-warm/60"
                }`}
              >
                {tier.featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill px-3.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-white"
                    style={{ background: "#d4622a" }}
                  >
                    Founding rate
                  </span>
                )}

                <p className="text-[0.9375rem] font-bold text-espresso">{tier.name}</p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-espresso">
                    {tier.price}
                  </span>
                  <span className="text-[0.9375rem] font-medium text-espresso/40">
                    {tier.unit}
                  </span>
                </div>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-espresso/55">
                  {tier.blurb}
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[0.9375rem] text-espresso/70"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    href="#connect"
                    variant={tier.featured ? "primary" : "outline"}
                    className="w-full"
                  >
                    Book a free call
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-center text-[0.9375rem] text-espresso/45">
            Two no-shows a week costs you about{" "}
            <span className="font-semibold text-espresso">₪1,200 a month</span>. That&apos;s
            the whole comparison.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
