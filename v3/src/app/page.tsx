import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { ProductTabs } from "@/components/product-tabs";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { ProofShops } from "@/components/proof-shops";
import { Pricing } from "@/components/pricing";
import { Founder } from "@/components/founder";
import { FAQ } from "@/components/faq";
import { Connect } from "@/components/connect";
import { Footer } from "@/components/footer";

/**
 * Reading order is the argument:
 *
 *   the whole idea, shown → what each tool is → how you get it → why trust it →
 *   who else has it → what it costs → who you're dealing with → objections →
 *   close.
 *
 * The hero carries the metaphor itself (mess and tools dropping into one pita)
 * rather than stating a claim and illustrating it later.
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
        <ProofShops />
        <Pricing />
        <Founder />
        <FAQ />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
