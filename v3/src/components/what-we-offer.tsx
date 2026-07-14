"use client";

import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";

export function WhatWeOffer() {
  const defaultId = PRODUCTS.find((p) => p.status === "live")?.id ?? PRODUCTS[0].id;
  const [activeId, setActiveId] = useState<string>(defaultId);

  const active = PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0];
  const ActiveIcon = PRODUCT_ICONS[active.id];
  const isLive = active.status === "live";

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
              Start with what you need today, everything else joins the suite as we build.
              Pick a tool below to see what&apos;s included, set up and run for you, under your brand.
            </p>
          </div>
        </Reveal>

        {/* Interactive showcase */}
        <Reveal delay={80}>
          <div className="relative grid overflow-hidden rounded-card border border-cream/[0.08] bg-surface shadow-soft lg:grid-cols-[340px_1fr]">
            {/* ambient accent glow, follows the active product's color */}
            <div
              aria-hidden
              style={accentStyle(active.id)}
              className="accent-text pointer-events-none absolute -right-24 -top-24 hidden h-72 w-72 rounded-full bg-current opacity-[0.06] blur-3xl transition-opacity duration-500 lg:block"
            />

            {/* Left: product list (horizontal pills on mobile, vertical tabs on desktop) */}
            <div
              role="tablist"
              aria-label="Bapita products"
              className="relative flex gap-1.5 overflow-x-auto border-b border-cream/[0.08] p-3 sm:gap-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-0"
            >
              {PRODUCTS.map((product) => {
                const Icon = PRODUCT_ICONS[product.id];
                const isActive = product.id === active.id;

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveId(product.id)}
                    style={accentStyle(product.id)}
                    className={`group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border-l-2 border-transparent px-4 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/30 lg:w-full lg:shrink lg:rounded-none lg:whitespace-normal lg:px-6 lg:py-5 ${
                      isActive
                        ? "accent-wash accent-text lg:border-l-current"
                        : "text-cream/70 hover:bg-cream/[0.04] lg:border-l-transparent"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
                        isActive ? "" : "text-cream/40 group-hover:text-cream/60"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>

                    {/* full label, desktop */}
                    <span className="hidden min-w-0 flex-1 lg:block">
                      <span className="block font-bold">Bapita {product.name}</span>
                      <span
                        className={`mt-0.5 block text-sm leading-snug ${
                          isActive ? "text-cream/60" : "text-cream/35"
                        }`}
                      >
                        {product.tagline}
                      </span>
                    </span>

                    {/* short label, mobile */}
                    <span className="font-bold lg:hidden">{product.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: preview panel for the active product */}
            <div
              key={active.id}
              role="tabpanel"
              className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 relative flex flex-col p-7 duration-300 sm:p-10"
            >
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="accent-wash accent-text flex h-11 w-11 items-center justify-center rounded-[11px]">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="accent-text text-lg font-bold">Bapita {active.name}</p>
                    <p className="text-sm text-cream/50">{active.tagline}</p>
                  </div>
                </div>
                <Badge variant={isLive ? "live" : "soon"}>
                  {active.statusLabel}
                </Badge>
              </div>

              <p className="mb-7 max-w-xl text-sm leading-relaxed text-cream/65">
                {active.description}
              </p>

              <div className="mb-8 grid gap-2.5 sm:grid-cols-2">
                {active.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2.5 rounded-[10px] border border-cream/[0.08] bg-cream/[0.02] px-4 py-3 text-sm text-cream/70"
                  >
                    <Check className="accent-text h-4 w-4 shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              <div className="mt-auto max-w-xs">
                {isLive ? (
                  <Button
                    href={active.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    className="w-full"
                  >
                    Visit Bapita {active.name}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button href="#connect" size="sm" className="w-full">
                    Book a free call
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

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
