import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    number: "01",
    title: "Pick the tool you need",
    body: "Start with the one problem you want solved first. Booking chaos? Start with Book. Social silence? Start with Social. You're not locked into anything.",
  },
  {
    number: "02",
    title: "We set it up for you",
    body: "No templates to wrestle, no developers to hire. Tell us about your business and we configure, build, and launch your tool — usually within 48 hours.",
  },
  {
    number: "03",
    title: "Run your business, not your tools",
    body: "Everything stays maintained and updated. If something needs changing, you ask us. You focus on your customers — we handle the software.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-16 max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/35">
              How it works
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-cream">
              From "I need this" to live in 48 hours.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 80}>
              <div className="relative flex flex-col gap-5 rounded-card border border-cream/[0.08] bg-cream/[0.04] p-7">
                <span className="font-mono text-[2.5rem] font-extrabold leading-none tracking-tight text-cream/10">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-bold text-cream">{step.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-cream/55">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
