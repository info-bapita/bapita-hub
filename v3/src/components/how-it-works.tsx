"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Wrench,
  Gauge,
  Calendar,
  Share2,
  Search,
  Send,
  Bot,
  Megaphone,
  Plus,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

const TOOLS: { label: string; icon: LucideIcon }[] = [
  { label: "Book", icon: Calendar },
  { label: "Social", icon: Share2 },
  { label: "SEO", icon: Search },
  { label: "Outreach", icon: Send },
  { label: "Bots", icon: Bot },
  { label: "Ads", icon: Megaphone },
];

const STEPS: { n: string; icon: LucideIcon; title: string; body: string }[] = [
  {
    n: "01",
    icon: LayoutGrid,
    title: "Pick your tools",
    body: "Booking, social, SEO, outreach, bots, ads — start with what you need today. Everything else joins the suite whenever you're ready.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "We build it, under your brand",
    body: "Your colors, your logo, your domain. We configure and launch it — usually within 48 hours. You don't touch a setting unless you want to.",
  },
  {
    n: "03",
    icon: Gauge,
    title: "Run it from one dashboard",
    body: "Check stats, adjust settings, see every tool in one place. Add another from the suite anytime — no rebuild, no waiting.",
  },
];

/** Respects reduced-motion so the panel's ambient loops go still, not just slower. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function ToolsVisual() {
  const reducedMotion = useReducedMotion();
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setPicked((p) => (p + 1) % TOOLS.length), 1600);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {TOOLS.map((tool, i) => {
        const Icon = tool.icon;
        const isPicked = i === picked;
        return (
          <div
            key={tool.label}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 transition-all duration-500 ${
              isPicked
                ? "scale-105 border-clay-toast/60 bg-clay-toast/15"
                : "border-cream/10 bg-cream/5"
            }`}
          >
            <Icon
              className={`h-5 w-5 transition-colors duration-500 ${
                isPicked ? "text-clay-toast" : "text-cream/50"
              }`}
            />
            <span
              className={`text-[0.7rem] font-semibold transition-colors duration-500 ${
                isPicked ? "text-cream" : "text-cream/40"
              }`}
            >
              {tool.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function BuildVisual() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(28);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 18 : p + 4)), 220);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const pct = reducedMotion ? 72 : progress;

  return (
    <div className="w-full max-w-[260px] rounded-2xl border border-cream/10 bg-cream/5 p-4">
      <div className="flex items-center justify-between">
        <span className="h-2.5 w-2.5 rounded-full bg-clay-toast" />
        <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-cream/50">
          yourbrand.com
        </span>
      </div>
      <div className="mt-4 h-20 rounded-lg bg-gradient-to-br from-clay-toast/30 to-clay-warm/10" />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-cream/15" />
        <div className="h-2 w-1/2 rounded-full bg-cream/10" />
      </div>
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
          <div
            className="h-full rounded-full bg-clay-toast transition-all duration-200"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className="mt-1.5 block text-[0.65rem] text-cream/40">Building your site…</span>
      </div>
    </div>
  );
}

function DashboardVisual() {
  const stats = [
    { label: "Bookings", value: "128" },
    { label: "New leads", value: "34" },
    { label: "Messages", value: "212" },
  ];

  return (
    <div className="w-full max-w-[280px] space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-cream/10 bg-cream/5 px-2 py-3 text-center"
          >
            <div className="text-base font-bold text-cream">{s.value}</div>
            <div className="mt-0.5 text-[0.6rem] text-cream/40">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-cream/10 bg-cream/5 px-3 py-2.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-clay-toast" />
        <span className="text-[0.7rem] text-cream/60">Live · updated just now</span>
      </div>
      <div className="flex gap-2">
        {TOOLS.slice(0, 4).map((tool) => {
          const Icon = tool.icon;
          return (
            <span
              key={tool.label}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream/10 bg-cream/5"
            >
              <Icon className="h-3.5 w-3.5 text-cream/50" />
            </span>
          );
        })}
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-cream/20 text-cream/40">
          <Plus className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

const VISUALS = [ToolsVisual, BuildVisual, DashboardVisual];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [pinTop, setPinTop] = useState(112); // px from viewport top where the panel pins

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActive(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Sets the pin distance to sit just below the section's own title block,
  // instead of a guessed constant that could land above or under the title.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const TITLE_GAP = 40; // px of breathing room below the title block

    const measure = () => setPinTop(Math.round(header.getBoundingClientRect().height + TITLE_GAP));

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-8 overflow-visible bg-[linear-gradient(to_right,#fafaf8_0%,#fafaf8_100%)] py-24"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div ref={headerRef} className="mb-16 max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cinnamon">
              How it works
            </p>
            <h2 className="text-display-lg font-extrabold leading-[1.08] tracking-tight text-espresso">
              From &ldquo;I need this&rdquo; to live in 48 hours.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-espresso-muted/80">
              Pick your tools. We brand and build them for you. Then run
              everything — and add more — from one dashboard.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-24">
          {/* step list */}
          <div className="relative lg:self-start">
            <div
              className="absolute bottom-10 left-[27px] top-10 w-px bg-gradient-to-b from-cream/15 via-cream/10 to-transparent"
              aria-hidden="true"
            />
            <ol className="flex flex-col gap-10 sm:gap-12">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const Visual = VISUALS[i];
                const isActive = active === i;
                return (
                  <li
                    key={step.n}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    data-index={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(i);
                      }
                    }}
                    className={`relative -mx-4 flex cursor-pointer items-start gap-6 rounded-2xl px-4 py-2 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-clay-toast/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                      isActive ? "bg-cream/5" : "hover:bg-cream/5"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-ink-600 shadow-md transition-all duration-300 ${
                        isActive
                          ? "border-clay-toast/60 ring-2 ring-clay-toast/40 ring-offset-2 ring-offset-ink"
                          : "border-cream/15"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-cream" />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-sm font-bold tracking-tight transition-colors duration-300 ${
                            isActive ? "text-espresso" : "text-espresso-muted/70"
                          }`}
                        >
                          {step.n}
                        </span>
                        <h3
                          className={`text-[1.15rem] font-bold tracking-tight transition-colors duration-300 ${
                            isActive ? "text-espresso" : "text-espresso-muted/70"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className={`mt-2 max-w-md text-[0.95rem] leading-relaxed transition-colors duration-300 ${
                          isActive ? "text-espresso-muted/80" : "text-espresso-muted/60"
                        }`}
                      >
                        {step.body}
                      </p>

                      {/* mobile only: the panel travels inline with whichever step is active */}
                      {isActive && (
                        <div className="mt-5 flex justify-center rounded-2xl border border-cream/10 bg-ink-600 p-6 lg:hidden">
                          <Visual />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {/* extends this column's height a bit past the last step's text, giving the
                pinned panel a little extra room to glide before it releases */}
            <div className="h-16" aria-hidden="true" />
          </div>

          {/* desktop only: visual panel pinned at the title line, released natively by
              CSS sticky once this column (which matches the step list's height) ends */}
          <div className="relative hidden lg:block">
            <div className="sticky" style={{ top: pinTop }}>
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl border border-cream/10 bg-ink-600 p-8 shadow-xl">
                {STEPS.map((_, i) => {
                  const Visual = VISUALS[i];
                  return (
                    <div
                      key={i}
                      className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-500 ${
                        active === i ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <Visual />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
