import { Reveal } from "@/components/reveal";
import { SERVED_CATEGORIES } from "@/lib/products";

const STATS = [
  {
    value: "35%",
    label: "of appointments get booked after business hours",
  },
  {
    value: "78%",
    label: "of customers choose the business that responds first",
  },
  {
    value: "80%",
    label: "fewer no-shows with automatic reminders",
  },
];

// Double the list so the marquee loops seamlessly
const ITEMS = [...SERVED_CATEGORIES, ...SERVED_CATEGORIES];

const SEPARATOR = (
  <span className="mx-5 inline-block h-1 w-1 rounded-full bg-cream/25" aria-hidden="true" />
);

export function ProofBand() {
  return (
    <section className="border-b border-cream/[0.08] bg-ink">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 80}>
              <div className="text-center sm:text-start">
                <p className="text-display-lg font-extrabold tracking-tight text-cream">
                  {stat.value}
                </p>
                <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-cream/55 max-sm:mx-auto">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Who we serve marquee */}
      <div className="overflow-hidden border-t border-cream/[0.08] bg-ink-800 py-5">
        <p className="sr-only">Business types Bapita is built for</p>
        <div className="marquee-track flex items-center whitespace-nowrap" aria-hidden="true">
          {ITEMS.map((cat, i) => (
            <span key={i} className="inline-flex items-center text-sm font-medium text-cream/55">
              {cat}
              {SEPARATOR}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
