import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { ProofBand } from "@/components/proof-band";
import { WhatWeOffer } from "@/components/what-we-offer";
import { HowItWorks } from "@/components/how-it-works";
import { FAQ } from "@/components/faq";
import { Connect } from "@/components/connect";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProofBand />
        <WhatWeOffer />
        <HowItWorks />
        <FAQ />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
