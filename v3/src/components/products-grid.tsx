import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";
import { cn } from "@/lib/cn";

export function ProductsGrid() {
  return (
    <section id="products" className="wash-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/40">
              The suite
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-cream">
              Five tools, one toolkit.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/55">
              Each tool does one job exceptionally well. Use one, or use all five —
              same plain-spoken approach, same pay-for-what-you-use pricing, no
              bundle lock-in.
            </p>
          </div>
        </Reveal>

        {/* Bento: Book is the wide live feature; the four upcoming tools sit below */}
        <RevealStagger className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => {
            const Icon = PRODUCT_ICONS[product.id];
            const isLive = product.status === "live";
            const feature = product.id === "book";

            const href = isLive ? product.href : "#pricing";
            const linkProps = isLive
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <RevealItem
                key={product.id}
                className={cn(feature && "sm:col-span-2")}
              >
                <a
                  id={product.id}
                  href={href}
                  {...linkProps}
                  style={accentStyle(product.id)}
                  className={cn(
                    "product-card group relative flex h-full flex-col overflow-hidden rounded-card border border-cream/[0.08] bg-surface shadow-soft",
                    feature ? "p-8" : "p-6",
                  )}
                >
                  {/* motif — oversized faint product glyph + corner glow */}
                  <Icon
                    className="accent-text pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-[0.06] transition-opacity duration-200 group-hover:opacity-[0.12]"
                    aria-hidden="true"
                  />
                  <div
                    className="accent-wash pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-2xl"
                    aria-hidden="true"
                  />

                  {/* icon + badge */}
                  <div className="relative mb-5 flex items-start justify-between gap-3">
                    <span className="accent-wash accent-text flex h-11 w-11 items-center justify-center rounded-[13px]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge variant={isLive ? "live" : "soon"}>
                      {product.statusLabel}
                    </Badge>
                  </div>

                  <h3
                    className={cn(
                      "accent-text relative font-bold tracking-tight",
                      feature ? "text-[1.4rem]" : "text-[1.05rem]",
                    )}
                  >
                    Bapita {product.name}
                  </h3>
                  <p
                    className={cn(
                      "relative mt-2 leading-relaxed text-cream/60",
                      feature ? "max-w-md text-[1rem]" : "text-[0.9rem] leading-snug",
                    )}
                  >
                    {feature ? product.description : product.tagline}
                  </p>

                  <div className="relative mt-auto pt-6">
                    <span className="accent-text inline-flex items-center gap-1.5 text-sm font-semibold">
                      {isLive ? "Open Bapita Book" : "Learn more"}
                      {isLive ? (
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      ) : (
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                    </span>
                  </div>
                </a>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
