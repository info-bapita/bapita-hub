import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";

export function ProductsGrid() {
  return (
    <section id="products" className="wash-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/40">
              The suite
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-ink">
              Five tools, one toolkit.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/60">
              Each product is built to do one thing exceptionally well. Use one, or use all five — they share the same login, the same language, and the same pricing philosophy.
            </p>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => {
            const Icon = PRODUCT_ICONS[product.id];
            const isLive = product.status === "live";

            return (
              <Reveal key={product.id} delay={i * 60}>
                <div
                  id={product.id}
                  style={accentStyle(product.id)}
                  className="product-card flex h-full flex-col rounded-card border border-ink/[0.08] bg-surface p-6 shadow-soft transition-shadow duration-200 hover:shadow-lift"
                >
                  {/* Icon + badge row */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="accent-wash accent-text flex h-11 w-11 items-center justify-center rounded-[13px]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge variant={isLive ? "live" : "soon"}>
                      {product.statusLabel}
                    </Badge>
                  </div>

                  {/* Name + tagline */}
                  <h3 className="accent-text text-[1.05rem] font-bold tracking-tight">
                    Bapita {product.name}
                  </h3>
                  <p className="mt-1.5 text-[0.9rem] leading-snug text-ink/60">
                    {product.tagline}
                  </p>

                  {/* Features */}
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-ink/75">
                        <Check className="accent-text mt-0.5 h-4 w-4 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto pt-6">
                    {isLive ? (
                      <Button
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        {product.pricingCta}
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        href="#pricing"
                        variant="ghost"
                        size="sm"
                        className="w-full opacity-70"
                      >
                        {product.pricingCta}
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
