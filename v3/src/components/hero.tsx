import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ClayScene } from "@/components/clay-scene";

export function Hero() {
  return (
    <section
      className="relative z-10 flex min-h-screen items-start overflow-visible pt-32 pb-[180px] sm:pt-36 sm:pb-[200px]"
      style={{
        background:
          "linear-gradient(168deg, var(--color-clay) 0%, var(--color-clay-warm) 55%, var(--color-clay-toast) 100%)",
      }}
    >
      {/* Clay orbs + pita bowl (decorative, DOM/CSS only) */}
      <ClayScene />

      {/* Hero copy — selectable, above the scene */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-cinnamon">
            Digital tools for any business
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-display-xl font-extrabold leading-[1.04] tracking-tight text-espresso">
            Your business, online.
            <br />
            Without the tech.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-espresso-muted/80">
            We build and run your digital tools — booking, social, and more.
            You use them in one tap.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              href="#connect"
              size="lg"
              className="!bg-espresso !text-clay hover:!bg-espresso-muted"
            >
              Book a free call
            </Button>
            <Button
              href="#products"
              variant="outline"
              size="lg"
              className="!border-espresso-muted/30 !text-espresso-muted hover:!bg-espresso-muted/[0.06]"
            >
              See what we offer
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
