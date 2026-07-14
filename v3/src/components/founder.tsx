import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

/**
 * Founder-led trust block. The Hub's #1 credibility fix: a real person stands
 * behind the concierge promise. Kept honest and Book-specific — no fabricated
 * suite-wide testimonials (Shimi's testimonial lives on the Book page).
 *
 * The portrait is a designed placeholder. To use a real photo, drop an
 * <Image src="/rami.jpg" ... /> in place of the monogram tile below.
 */
export function Founder() {
  return (
    <section
      id="founder"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "linear-gradient(180deg, #FBF7EF 0%, #F7E8D6 100%)" }}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[300px_1fr]">
          {/* Portrait — placeholder monogram tile (swap for a real photo) */}
          <Reveal>
            <div className="mx-auto w-full max-w-[300px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-espresso/10 shadow-lift">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(160deg, #F3D8BC 0%, #c8893f 100%)" }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-28 w-28 items-center justify-center rounded-full bg-clay/80 text-5xl font-extrabold text-espresso shadow-md backdrop-blur-sm">
                    R
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-espresso/85 px-5 py-3.5 backdrop-blur-sm">
                  <span className="text-sm font-bold text-clay">Rami</span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-clay/70">
                    Founder
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Promise */}
          <Reveal delay={80}>
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cinnamon">
                Who you&apos;re working with
              </p>
              <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-espresso">
                You talk to me — not a support queue.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-espresso-muted/80">
                I&apos;m Rami. I set up every Bapita account myself — your booking page,
                your social, your bot — and I&apos;m the person you message when you need
                something changed. No ticket numbers, no outsourced support.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-pill border border-espresso/15 bg-clay/60 px-4 py-2 text-sm font-semibold text-espresso">
                <BadgeCheck className="h-4 w-4 text-cinnamon" />
                Bapita Book is live today, running real bookings for local shops.
              </div>

              <div className="mt-8">
                <Button
                  href="#connect"
                  size="lg"
                  className="!bg-espresso !text-clay hover:!bg-espresso-muted"
                >
                  Book a free call with me
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
