import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { BowlIcon } from "@/components/ui/brand-mark";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* faint bowl motif */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
        aria-hidden="true"
      >
        <BowlIcon size={420} />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-cream">
            Ready when you are.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-cream/60">
            Zero technical setup. Total daily simplicity. Pick the tool you need —
            we&apos;ll have it live, branded, and running.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="#products" size="lg">
              See the tools
            </Button>
            <Button
              href="mailto:hello@bapita.com"
              variant="outline"
              size="lg"
              className="border-cream/15 text-cream/70 hover:bg-cream/[0.06] hover:text-cream"
            >
              Talk to us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
