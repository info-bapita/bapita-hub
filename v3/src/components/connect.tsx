"use client";

import { useState } from "react";
import { Check, Calendar, ArrowUpRight, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { TwoTone } from "@/components/ui/type";
import { BowlIcon } from "@/components/ui/brand-mark";

const CALENDLY_URL = "https://calendly.com/info-bapita/30min";

// TODO(Rami): replace with the real WhatsApp business number (digits only,
// country code first, no +). Until then this link won't reach a live inbox.
const WHATSAPP_NUMBER = "972500000000";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Bapita, I'd like to hear more about setting up my business.",
)}`;

/**
 * The close, and the page's only dark surface.
 *
 * Everything above this is one continuous warm world; espresso arrives once, at
 * the end, as a full stop. That's a different thing from the old page, which
 * flipped between cream and near-black five times and read as five sites.
 */

const fieldClass =
  "w-full rounded-field border border-clay/20 bg-clay/[0.06] px-3.5 py-2.5 text-sm text-clay placeholder:text-clay/35 focus:border-clay/45 focus:outline-none";

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
        Got it. I&apos;ll reach out within one business day.
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
      <Button type="submit" variant="onDark" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send my details"}
        <Send className="h-4 w-4" />
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}

export function Connect() {
  return (
    <section id="connect" className="relative overflow-hidden bg-espresso py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-clay opacity-[0.04]"
        aria-hidden="true"
      >
        <BowlIcon size={460} />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-clay-toast">
              Let&apos;s talk
            </p>
            <TwoTone
              tone="dark"
              lead="Your shop, sorted."
              trail="Starting with one call."
              className="mt-4"
            />
            <p className="mx-auto mt-6 text-lg leading-relaxed text-clay/55">
              Twenty minutes. I&apos;ll ask what&apos;s eating your time, show you what
              it looks like fixed, and give you a straight number. No slides.
            </p>

            <div className="mt-9 flex justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-pill bg-[#25D366] px-6 py-3.5 text-[0.9375rem] font-bold text-[#06301f] shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
              >
                <MessageCircle className="h-5 w-5" />
                Message me on WhatsApp
              </a>
            </div>
            <p className="mt-3 text-[0.8125rem] text-clay/35">Fastest way to reach me</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <Reveal>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-3xl border border-clay/[0.12] bg-clay/[0.04] p-7 transition-colors hover:border-clay/25 hover:bg-clay/[0.07]"
            >
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[12px] bg-clay/10 text-clay">
                <Calendar className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-clay">Book a time</h3>
              <p className="mt-2 text-sm leading-relaxed text-clay/50">
                Pick a slot that works. 30 minutes, no prep needed.
              </p>
              <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-bold text-clay group-hover:underline group-hover:underline-offset-4">
                Open my calendar
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </Reveal>

          <Reveal delay={90}>
            <div className="flex h-full flex-col rounded-3xl border border-clay/[0.12] bg-clay/[0.04] p-7">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[12px] bg-clay/10 text-clay">
                <Send className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-clay">Leave your details</h3>
              <p className="mt-2 text-sm leading-relaxed text-clay/50">
                I&apos;ll reach out to you instead.
              </p>
              <div className="pt-6">
                <LeadForm />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-clay/40">
            Prefer email?{" "}
            <a
              href="mailto:hello@bapita.com"
              className="text-clay/70 underline underline-offset-4 hover:text-clay"
            >
              hello@bapita.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
