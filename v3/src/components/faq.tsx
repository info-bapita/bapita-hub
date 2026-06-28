"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/cn";

const FAQS = [
  {
    q: "Do I need to know anything technical to use Bapita?",
    a: "No. That's the point. We handle all the setup, configuration, and maintenance. You tell us about your business, we build the tool, and you use it — no logins to a complicated dashboard, no settings to figure out.",
  },
  {
    q: "How is Bapita different from using Calendly, Buffer, or other tools directly?",
    a: "Those tools are built for people who want to configure software. Bapita is built for people who want the outcome without the configuration. We set everything up to match your business, connect your accounts, write your copy, and keep it running. You also get all five tools under one roof instead of five different subscriptions.",
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
    q: "When will the other tools (Social, SEO, Outreach, Bots) launch?",
    a: "Social is in final testing now. SEO and Outreach are in development. Bots is in early access. The best way to get early access is to join the notify list for each product on this page.",
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

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink/[0.08]">
      <button
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-[0.9375rem] leading-snug text-ink">{q}</span>
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.06]">
          {open ? (
            <Minus className="h-3.5 w-3.5 text-ink/60" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-ink/60" />
          )}
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-[0.9rem] leading-relaxed text-ink/60">{a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/40">
              FAQ
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-ink">
              Questions we get a lot.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} defaultOpen={i === 0} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-10 text-center text-sm text-ink/45">
            Something else on your mind?{" "}
            <a
              href="mailto:hello@bapita.com"
              className="font-semibold text-ink/70 underline underline-offset-2 hover:text-ink"
            >
              Email us
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
