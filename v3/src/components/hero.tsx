import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { HeroScene } from "@/components/hero-scene/hero-scene";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-ink pt-28 pb-16 sm:pt-32">
      {/* Interactive Pita Catch scene (decoration, never blocks paint) */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* legibility veil behind the headline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[18%] z-[1] mx-auto h-[40%] max-w-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11,11,12,0.72) 0%, rgba(11,11,12,0.35) 55%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* Static hero content — server-rendered, sits above the canvas */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-cream/45">
            Digital tools for any business
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-display-xl font-extrabold leading-[1.04] tracking-tight text-cream">
            Built for you.
            <br />
            Run it your way.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/65">
            Some tools run themselves. Some you run in one tap. None need setup,
            none need an agency.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-4">
            <Button href="#products" size="lg">
              See the tools
            </Button>
            <Button
              href="#how-it-works"
              variant="outline"
              size="lg"
              className="border-cream/15 text-cream/70 hover:bg-cream/[0.06] hover:text-cream"
            >
              How it works
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
