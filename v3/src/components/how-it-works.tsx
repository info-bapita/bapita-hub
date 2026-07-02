import { Phone, Wrench, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";

const STEPS: { n: string; icon: LucideIcon; title: string; body: string }[] = [
  {
    n: "01",
    icon: Phone,
    title: "A quick call",
    body: "Tell us about your business. No tech talk, no forms to wrestle — just a conversation about what you need.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "We build it",
    body: "Configured, branded, and live — usually within 48 hours. You don't touch a setting unless you want to.",
  },
  {
    n: "03",
    icon: SlidersHorizontal,
    title: "Simple daily control",
    body: "Schedule, post, check stats in one tap. Or let it run itself. Your call — the controls are there when you want them.",
  },
];

export function HowItWorks() {
  return (
      <section id="how-it-works" className="bg-ink min-h-screen py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-16 max-w-xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/50">
              How it works
            </p>
                <h2 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-cream">
              From &ldquo;I need this&rdquo; to live in 48 hours.
            </h2>
                <p className="mt-4 text-xl leading-relaxed text-cream/55">
              Zero technical setup. Total daily simplicity. We do the building; you
              keep easy, full control.
            </p>
          </div>
        </Reveal>

        <RevealStagger className="relative">
          {/* connector rail */}
          <div
            className="absolute left-[27px] top-10 bottom-10 w-px bg-gradient-to-b from-cream/15 via-cream/10 to-transparent"
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-10 sm:gap-12">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <RevealItem key={step.n}>
                  <li className="relative flex items-start gap-6">
                    {/* node */}
                    <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-ink-800 shadow-md">
                      <Icon className="h-5 w-5 text-cream/80" />
                    </span>
                    <div className="pt-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-sm font-bold tracking-tight text-cream/50">
                          {step.n}
                        </span>
                        <h3 className="text-[1.15rem] font-bold tracking-tight text-cream">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-cream/55">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </RevealItem>
              );
            })}
          </ol>
        </RevealStagger>
      </div>
    </section>
  );
}
