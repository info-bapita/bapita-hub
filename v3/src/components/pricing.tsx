"use client";

import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";

function NotifyForm({ productName }: { productName: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // In production: POST to your email capture endpoint
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-field bg-seo/10 px-4 py-2.5 text-sm font-semibold text-seo">
        <Check className="h-4 w-4" />
        You&apos;re on the list!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={`Get notified about ${productName}`}
        required
        className="min-w-0 flex-1 rounded-field border border-ink/15 bg-cream px-3.5 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-ink/30 focus:outline-none"
      />
      <Button type="submit" size="sm" variant="outline">
        Notify me
      </Button>
    </form>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="wash-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/40">
              Pricing
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-ink">
              Pay for what you use. Nothing more.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/60">
              Every tool is priced per product — no bundles that force you to pay for things you don&apos;t need. Book is live now; the rest open progressively.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => {
            const Icon = PRODUCT_ICONS[product.id];
            const isLive = product.status === "live";

            return (
              <Reveal key={product.id} delay={i * 60}>
                <div
                  style={accentStyle(product.id)}
                  className="flex h-full flex-col rounded-card border border-ink/[0.08] bg-surface p-6 shadow-soft"
                >
                  {/* Header */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className="accent-wash accent-text flex h-10 w-10 items-center justify-center rounded-[11px]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="accent-text font-bold">Bapita {product.name}</p>
                      <p className="text-xs text-ink/45">{product.pricingNote}</p>
                    </div>
                    <Badge variant={isLive ? "live" : "soon"} className="ml-auto">
                      {product.statusLabel}
                    </Badge>
                  </div>

                  <div className="h-px bg-ink/[0.07] mb-5" />

                  {/* Features list */}
                  <ul className="flex flex-col gap-2.5 mb-6">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-ink/70">
                        <Check className="accent-text mt-0.5 h-4 w-4 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto">
                    {isLive ? (
                      <Button
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        className="w-full"
                      >
                        {product.pricingCta}
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <NotifyForm productName={product.name} />
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Trust note */}
        <Reveal>
          <p className="mt-10 text-center text-sm text-ink/40">
            No lock-in. Cancel any product at any time. Questions?{" "}
            <a href="mailto:hello@bapita.com" className="underline underline-offset-2 hover:text-ink/60">
              hello@bapita.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
