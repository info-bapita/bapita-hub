import { Reveal } from "@/components/reveal";
import { SERVED_CATEGORIES } from "@/lib/products";

const STATS = [
  { value: "35%", label: "of appointments get booked after business hours" },
  { value: "78%", label: "of customers choose the business that responds first" },
  { value: "80%", label: "fewer no-shows with automatic reminders" },
];

// Doubled so the marquee loops seamlessly.
const ITEMS = [...SERVED_CATEGORIES, ...SERVED_CATEGORIES];

/**
 * The numbers that make the pain concrete, immediately after the thesis.
 *
 * These were previously set at 55% opacity on a near-black band and were
 * effectively unreadable — the section registered as empty space on scroll.
 * Numerals now sit at full espresso and the labels at 55% of a dark ink on a
 * light ground, which is a different thing entirely.
 */
export function ProofBand() {
  return (
    <section className="wash-clay border-b border-espresso/[0.07]">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-espresso/10">
          {STATS.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 80}>
              <div className="text-center sm:px-8">
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-espresso">
                  {stat.value}
                </p>
                <p className="mx-auto mt-3 max-w-[230px] text-[0.9375rem] font-medium leading-relaxed text-espresso/55">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <p className="mx-auto mt-14 max-w-md text-center text-[0.9375rem] leading-relaxed text-espresso/50">
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

      <div className="overflow-hidden border-t border-espresso/[0.07] bg-clay-warm/60 py-5">
        <p className="sr-only">Business types Bapita is built for</p>
        <div className="marquee-track flex items-center whitespace-nowrap" aria-hidden="true">
          {ITEMS.map((cat, i) => (
            <span
              key={i}
              className="inline-flex items-center text-sm font-medium text-espresso/50"
            >
              {cat}
              <span className="mx-5 inline-block h-1 w-1 rounded-full bg-cinnamon/40" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
