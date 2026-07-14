import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ClayScene } from "@/components/clay-scene";

export function Hero() {
  return (
    <section
      className="relative z-10 flex min-h-[calc(100svh-5rem)] items-start overflow-visible pt-14 pb-[150px] sm:pt-20 sm:pb-[190px]"
      style={{
        background:
          "linear-gradient(to right, #fafaf8 0%, #fafaf8 100%)",
      }}
    >
      {/* Clay orbs + pita bowl (decorative, DOM/CSS only) */}
      <ClayScene />

      {/* Hero copy — selectable, above the scene */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-cinnamon">
            For salons, barbers, clinics &amp; studios
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
            We build and set up your booking, social &amp; WhatsApp tools — live in
            48 hours. You run it all from your phone.
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
