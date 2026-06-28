import { SERVED_CATEGORIES } from "@/lib/products";

// Double the list so the marquee loops seamlessly
const ITEMS = [...SERVED_CATEGORIES, ...SERVED_CATEGORIES];

const SEPARATOR = (
  <span className="mx-5 inline-block h-1 w-1 rounded-full bg-ink/20" aria-hidden="true" />
);

export function SocialProof() {
  return (
    <section className="border-y border-ink/[0.07] bg-surface py-5 overflow-hidden">
      <p className="sr-only">Businesses already using Bapita Book</p>
      <div className="marquee-track flex items-center whitespace-nowrap" aria-hidden="true">
        {ITEMS.map((cat, i) => (
          <span key={i} className="inline-flex items-center text-sm font-medium text-ink/50">
            {cat}
            {SEPARATOR}
          </span>
        ))}
      </div>
    </section>
  );
}
