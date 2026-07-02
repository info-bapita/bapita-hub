import { Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { NotifyForm } from "@/components/notify-form";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";

const FEATURED_IDS = ["book", "social"] as const;

export function WhatWeOffer() {
  const featured = PRODUCTS.filter((p) => (FEATURED_IDS as readonly string[]).includes(p.id));
  const roadmap = PRODUCTS.filter((p) => !(FEATURED_IDS as readonly string[]).includes(p.id));

  return (
    <section id="products" className="wash-cream relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/50">
              What we offer
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-cream">
              One suite. Every tool your business needs online.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/60">
              Start with what you need today — more tools join the suite as we
              build. Everything set up and run for you, under your brand.
            </p>
          </div>
        </Reveal>

        {/* Featured: Book (live) + Social (launching soon) */}
        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map((product, i) => {
            const Icon = PRODUCT_ICONS[product.id];
            const isLive = product.status === "live";

            return (
              <Reveal key={product.id} delay={i * 80}>
                <div
                  style={accentStyle(product.id)}
                  className="flex h-full flex-col rounded-card border border-cream/[0.08] bg-surface p-7 shadow-soft sm:p-8"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="accent-wash accent-text flex h-11 w-11 items-center justify-center rounded-[11px]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="accent-text text-lg font-bold">Bapita {product.name}</p>
                    </div>
                    <Badge variant={isLive ? "live" : "soon"} className="ml-auto">
                      {isLive ? "Live" : "Launching soon"}
                    </Badge>
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-cream/65">
                    {product.description}
                  </p>

                  <div className="mb-5 h-px bg-cream/[0.08]" />

                  <ul className="mb-7 flex flex-col gap-2.5">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-cream/70">
                        <Check className="accent-text mt-0.5 h-4 w-4 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {isLive ? (
                      <Button
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        className="w-full"
                      >
                        Visit Bapita {product.name}
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <NotifyForm productName={product.name} productId={product.id} />
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Roadmap: the rest of the suite */}
        <Reveal>
          <p className="mb-5 mt-14 text-xs font-bold uppercase tracking-[0.16em] text-cream/50">
            On the roadmap
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((product, i) => {
            const Icon = PRODUCT_ICONS[product.id];

            return (
              <Reveal key={product.id} delay={i * 60}>
                <div
                  style={accentStyle(product.id)}
                  className="flex h-full flex-col rounded-card border border-cream/[0.08] bg-surface p-6 shadow-soft"
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="accent-wash accent-text flex h-9 w-9 items-center justify-center rounded-[10px]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="accent-text font-bold">Bapita {product.name}</p>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-cream/60">
                    {product.tagline}
                  </p>

                  <ul className="mb-6 flex flex-col gap-2">
                    {product.features.slice(0, 3).map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-[13px] text-cream/55">
                        <Check className="accent-text mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <NotifyForm productName={product.name} productId={product.id} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-cream/50">
            Not sure what fits?{" "}
            <a href="#connect" className="underline underline-offset-2 hover:text-cream/80">
              Book a free call
            </a>{" "}
            — we&apos;ll figure it out together.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
