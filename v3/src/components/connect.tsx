"use client";

import { useState } from "react";
import { Check, Calendar, ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { BowlIcon } from "@/components/ui/brand-mark";

const CALENDLY_URL = "https://calendly.com/info-bapita/30min";

const fieldClass =
  "w-full rounded-field border border-espresso/15 bg-ink-800/30 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-espresso/35 focus:outline-none";

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          phone: data.get("phone"),
          email: data.get("email"),
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again, or email hello@bapita.com.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex items-center gap-2.5 rounded-field bg-success/15 px-4 py-3 text-sm font-semibold text-success"
      >
        <Check className="h-4 w-4 shrink-0" />
        Got it — we&apos;ll reach out within one business day.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" type="text" placeholder="Your name" required aria-label="Your name" autoComplete="name" className={fieldClass} />
        <input name="business" type="text" placeholder="Business (optional)" aria-label="Business name (optional)" autoComplete="organization" className={fieldClass} />
        <input name="phone" type="tel" placeholder="Phone" aria-label="Phone number" autoComplete="tel" className={fieldClass} />
        <input name="email" type="email" placeholder="Email" required aria-label="Email address" autoComplete="email" className={fieldClass} />
      </div>
      <Button type="submit" disabled={pending} className="w-full !bg-espresso !text-cream">
        {pending ? "Sending…" : "Send my details"}
        <Send className="h-4 w-4" />
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}

export function Connect() {
  return (
    <section
  id="connect"
  className="relative overflow-hidden"
  style={{
    background: "linear-gradient(168deg, var(--color-clay) 0%, var(--color-clay-warm) 55%, var(--color-clay-toast) 100%)",
  }}
>
      {/* faint bowl motif */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
        aria-hidden="true"
      >
        <BowlIcon size={420} />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-espresso">
              How would you like to connect?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-espresso/70">
              Pick whichever works for you.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          <Reveal>
<a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-card border border-cream/[0.08] bg-ink-800 p-7 shadow-soft transition-colors hover:border-cream/20"
            >
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[11px] bg-ink-800/30 text-espresso">
                <Calendar className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-espresso">Book a call</h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso/70">
                Pick a time, we'll talk — 30 min.
              </p>
              <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-espresso group-hover:underline group-hover:underline-offset-4">
                Open calendar
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </Reveal>

          <Reveal delay={80}>
<div className="flex h-full flex-col rounded-card border border-cream/[0.08] bg-ink-800 p-7 shadow-soft">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[11px] bg-ink-800/30 text-espresso">
                <Send className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-espresso">Send your details</h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso/70">
                We'll reach out to you.
              </p>
              <div className="pt-6">
                <LeadForm />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-espresso/50">
            Prefer email?{" "}
            <a
              href="mailto:hello@bapita.com"
              className="underline underline-offset-2 hover:text-espresso/80"
            >
              hello@bapita.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
