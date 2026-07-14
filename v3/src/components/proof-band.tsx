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
      {/*
        pt increased significantly (was pt-36/sm:pt-48) so the pita's
        rounded bottom — which pokes down into this section from the
        hero above — has clear black space to read against before the
        stats start. Tune this number against the actual bowl height/
        overlap once clay-scene.tsx is in hand; this is a starting point.
      */}
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-52 sm:px-8 sm:pb-20 sm:pt-[21rem]">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-cream/10">
          {STATS.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 80}>
              <div className="text-center sm:px-8">
                <p className="text-display-lg font-extrabold leading-none tracking-tight text-cream tabular-nums">
                  {stat.value}
                </p>
                <p className="mx-auto mt-3 max-w-[240px] text-[0.9rem] font-medium leading-relaxed text-cream/55">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Loss-framed nudge — ties the stats to the pain, then to the CTA */}
        <Reveal delay={240}>
          <p className="mx-auto mt-12 max-w-md text-center text-[0.95rem] leading-relaxed text-cream/45">
            Every missed message is a client someone else booked.{" "}
            <a
              href="#connect"
              className="font-semibold text-cream/80 underline decoration-cream/25 underline-offset-4 transition-colors hover:text-cream hover:decoration-cream/60"
            >
              Let&apos;s fix that
            </a>
          </p>
        </Reveal>
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
