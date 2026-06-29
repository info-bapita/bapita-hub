import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";
import { cn } from "@/lib/cn";

export function ProductsGrid() {
  return (
    <section id="products" className="wash-cream relative overflow-hidden py-24 sm:py-32">
      {/* faint orb motif — outreach violet top-right, social teal bottom-left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-60px",
          top: "-30px",
          width: "300px",
          height: "300px",
          borderRadius: "9999px",
          background: "radial-gradient(closest-side, #9277ff, transparent)",
          opacity: 0.06,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-40px",
          bottom: "60px",
          width: "240px",
          height: "240px",
          borderRadius: "9999px",
          background: "radial-gradient(closest-side, #2bc487, transparent)",
          opacity: 0.05,
          filter: "blur(65px)",
          pointerEvents: "none",
        }}
      />

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

        {/* Equal 5-card bento — no featured / wide card. Status pill only differentiates live vs soon. */}
        <RevealStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => {
            const Icon = PRODUCT_ICONS[product.id];
            const isLive = product.status === "live";
            const href = isLive ? product.href : "#pricing";
            const linkProps = isLive
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <RevealItem key={product.id}>
                <a
                  id={product.id}
                  href={href}
                  {...linkProps}
                  style={accentStyle(product.id)}
                  className={cn(
                    "product-card group relative flex h-full flex-col overflow-hidden rounded-card border border-cream/[0.08] bg-surface p-6 shadow-soft",
                  )}
                >
                  {/* oversized faint product glyph */}
                  <Icon
                    className="accent-text pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-[0.06] transition-opacity duration-200 group-hover:opacity-[0.12]"
                    aria-hidden="true"
                  />
                  {/* corner glow wash */}
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

                  <h3 className="accent-text relative text-[1.05rem] font-bold tracking-tight">
                    Bapita {product.name}
                  </h3>
                  <p className="relative mt-2 text-[0.9rem] leading-snug text-cream/60">
                    {product.tagline}
                  </p>

                  <div className="relative mt-5">
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
