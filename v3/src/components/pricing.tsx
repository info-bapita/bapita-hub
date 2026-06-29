"use client";

import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import { accentStyle } from "@/lib/accent";

function NotifyForm({ productName, productId }: { productName: string; productId: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: productId }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-field bg-success/15 px-4 py-2.5 text-sm font-semibold text-success">
        <Check className="h-4 w-4" />
        You&apos;re on the list!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`Get notified about ${productName}`}
          required
          aria-label={`Email for ${productName} notifications`}
          className="min-w-0 flex-1 rounded-field border border-cream/15 bg-cream/[0.04] px-3.5 py-2 text-sm text-cream placeholder:text-cream/35 focus:border-cream/35 focus:outline-none"
        />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "…" : "Notify me"}
        </Button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="wash-cream relative overflow-hidden py-24 sm:py-32">
      {/* faint orb motif — book orange top-left, seo blue bottom-right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-50px",
          top: "-40px",
          width: "260px",
          height: "260px",
          borderRadius: "9999px",
          background: "radial-gradient(closest-side, #f0743a, transparent)",
          opacity: 0.055,
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-40px",
          bottom: "80px",
          width: "220px",
          height: "220px",
          borderRadius: "9999px",
          background: "radial-gradient(closest-side, #4e86ff, transparent)",
          opacity: 0.05,
          filter: "blur(68px)",
          pointerEvents: "none",
        }}
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/40">
              Pricing
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-cream">
              Pay for what you use. Nothing more.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/55">
              Pick what you need. Pay for what you use. No lock-in. Each tool is
              priced per product — Book is live now; the rest open progressively.
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
                  className="flex h-full flex-col rounded-card border border-cream/[0.08] bg-surface p-6 shadow-soft"
                >
                  {/* Header */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className="accent-wash accent-text flex h-10 w-10 items-center justify-center rounded-[11px]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="accent-text font-bold">Bapita {product.name}</p>
                      <p className="text-xs text-cream/45">{product.pricingNote}</p>
                    </div>
                    <Badge variant={isLive ? "live" : "soon"} className="ml-auto">
                      {product.statusLabel}
                    </Badge>
                  </div>

                  <div className="h-px bg-cream/[0.08] mb-5" />

                  {/* Features list */}
                  <ul className="flex flex-col gap-2.5 mb-6">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-cream/70">
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
                      <NotifyForm productName={product.name} productId={product.id} />
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Trust note */}
        <Reveal>
          <p className="mt-10 text-center text-sm text-cream/40">
            No lock-in. Cancel any product at any time. Questions?{" "}
            <a href="mailto:hello@bapita.com" className="underline underline-offset-2 hover:text-cream/70">
              hello@bapita.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
