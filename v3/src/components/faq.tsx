"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/cn";

const FAQS = [
  {
    q: "Do I need to know anything technical to use Bapita?",
    a: "No. There's zero technical setup on your side — we handle the configuration and maintenance. What you get is simple controls you actually use: a clean dashboard, one-tap actions, easy scheduling and stats. Total daily simplicity, not a system you fight.",
  },
  {
    q: "How is Bapita different from using Calendly, Buffer, or other tools directly?",
    a: "Those tools hand you a blank, complicated dashboard and expect you to configure everything yourself. With Bapita, we build it around your business and keep it running — and your day-to-day stays simple: post in a tap, check stats at a glance, or let a tool run itself. Same warm approach across every product; pick only the ones you need.",
  },
  {
    q: "What does '48 hours' actually mean for Bapita Book?",
    a: "Once you book a free call and we agree on the setup, your booking page and owner dashboard are live within 48 business hours. That includes the page design, your service menu, availability settings, and WhatsApp/SMS reminders.",
  },
  {
    q: "Can I use just one tool without committing to the whole suite?",
    a: "Yes. Each product is priced and managed independently. Start with Book if that's your biggest pain point. Add Social when you're ready. There's no forced bundle.",
  },
  {
    q: "When will the other tools (Social, SEO, Outreach, Bots, Ads) launch?",
    a: "Book is live today. Social is in active development and launches next. SEO, Outreach, Bots, and Ads are on the roadmap after that. The best way to get early access — and a founding-customer price — is to join the notify list for each product on this page.",
  },
  {
    q: "Is my data safe? What happens to my client information?",
    a: "Your booking data, client details, and business information are stored securely and never sold or shared with third parties. Each product runs on infrastructure that meets standard data protection requirements.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel any time, per product. There are no annual lock-ins unless you've explicitly chosen an annual plan for a discount. If you cancel Bapita Book, your booking page stays live through the end of your billing period.",
  },
];

function FAQItem({ q, a, id, defaultOpen = false }: { q: string; a: string; id: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-cream/[0.08]">
      <button
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="font-semibold text-[0.9375rem] leading-snug text-cream">{q}</span>
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream/[0.08]">
          {open ? (
            <Minus className="h-3.5 w-3.5 text-cream/60" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-cream/60" />
          )}
        </span>
      </button>
      {/* grid-rows collapse: animates to any content height, never clips */}
      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[0.9rem] leading-relaxed text-cream/65">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="wash-sand py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/50">
              FAQ
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-cream">
              Questions we get a lot.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} id={`faq-panel-${i}`} q={faq.q} a={faq.a} defaultOpen={i === 0} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-10 text-center text-sm text-cream/55">
            Something else on your mind?{" "}
            <a
              href="mailto:hello@bapita.com"
              className="font-semibold text-cream/70 underline underline-offset-2 hover:text-cream"
            >
              Email us
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
