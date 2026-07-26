import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { ProofBand } from "@/components/proof-band";
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
 *   the whole idea, shown → the cost of doing nothing → what each tool is →
 *   how you get it → why trust it → who else has it → what it costs → who
 *   you're dealing with → objections → close.
 *
 * The hero carries the metaphor itself (mess and tools dropping into one pita)
 * rather than stating a claim and illustrating it later.
 */
export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProofBand />
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
