"use client";

import { useState } from "react";
import { BUSINESS_TYPES, PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyleLight } from "@/lib/accent";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/cn";

export function WhoItsFor() {
  const [activeId, setActiveId] = useState<string>(BUSINESS_TYPES[0].id);

  const active = BUSINESS_TYPES.find((b) => b.id === activeId)!;
  const activeProducts = active.products.map((pid) => PRODUCTS.find((p) => p.id === pid)!);

  return (
      <section id="who-its-for" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cinnamon">
              Who it&apos;s for
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-espresso">
              Built for the business you actually run.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-espresso-muted/80">
              Pick your business type and see which tools fit.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
          {/* Business type selector */}
          <Reveal>
            <div className="flex flex-col gap-2">
              {BUSINESS_TYPES.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => setActiveId(biz.id)}
                  aria-pressed={activeId === biz.id}
                  className={cn(
                    "group flex flex-col gap-0.5 rounded-card border px-5 py-4 text-left transition-all duration-150",
                    activeId === biz.id
                      ? "border-espresso/10 bg-white shadow-md"
                      : "border-transparent hover:bg-espresso/[0.04]"
                  )}
                >
                  <span className={cn(
                    "font-semibold text-[0.9375rem] transition-colors",
                    activeId === biz.id ? "text-espresso" : "text-espresso-muted/80 group-hover:text-espresso"
                  )}>
                    {biz.label}
                  </span>
                  <span className="text-sm text-espresso-muted/70">{biz.example}</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Matching tools */}
          <Reveal delay={60}>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-espresso-muted/75">
                Recommended tools
              </p>
              <div className="flex flex-col gap-3">
                {activeProducts.map((product) => {
                  const Icon = PRODUCT_ICONS[product.id];
                  return (
                    <a
                      key={product.id}
                      href="#products"
                      style={accentStyleLight(product.id)}
                      className="product-card flex items-start gap-4 rounded-card border border-espresso/10 bg-white p-5 shadow-sm"
                    >
                      <span className="accent-wash accent-text flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="accent-text font-bold text-[0.9375rem]">
                          Bapita {product.name}
                        </p>
                        <p className="mt-0.5 text-sm leading-snug text-espresso-muted/80">
                          {product.tagline}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
