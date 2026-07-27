import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { ProductTabs } from "@/components/product-tabs";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { Connect } from "@/components/connect";
import { Footer } from "@/components/footer";

/**
 * Reading order is the argument:
 *
 *   the whole idea, shown → what each tool is → how you get it → why trust it →
 *   what it costs → objections → close.
 *
 * The hero carries the metaphor itself (the tools dropping into one pita)
 * rather than stating a claim and illustrating it later.
 *
 * ProofShops ("first shops") and Founder ("who you're working with") were cut
 * on 2026-07-27: the page was too long and both sections asked for trust the
 * pricing and FAQ now earn directly.
 *
 * The "Work smarter" display band was a section of its own between the
 * products and the steps until 2026-07-27. It now opens How it works instead:
 * as a standalone band it broke the warm background spine in two places and
 * left the page with two competing headers a screen apart.
 *
 * The statistics that once sat between the hero and the products moved into
 * Features: three bare percentages arriving before the reader knew what Bapita
 * was had nothing to attach to.
 */
export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProductTabs />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
