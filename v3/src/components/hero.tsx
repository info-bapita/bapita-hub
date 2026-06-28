import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="bg-ink pt-28 pb-24 sm:pt-36 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-cream/35">
              Digital tools for any business
            </p>
            <h1 className="text-display-xl font-extrabold leading-[1.04] tracking-tight text-cream">
              Run your business online.
              <br />
              <span className="text-cream/50">No agency needed.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/55">
              A suite of professional tools — booking, social media, SEO, outreach, and AI bots — built and maintained for you. Pick the one you need. We handle the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#products" size="lg">
                See the tools
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg" className="border-cream/15 text-cream/60 hover:bg-cream/[0.06] hover:text-cream">
                How it works
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}