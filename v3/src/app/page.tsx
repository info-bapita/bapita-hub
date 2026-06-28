import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { ProductsGrid } from "@/components/products-grid";
import { HowItWorks } from "@/components/how-it-works";
import { WhoItsFor } from "@/components/who-its-for";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <SocialProof />
        <ProductsGrid />
        <HowItWorks />
        <WhoItsFor />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
