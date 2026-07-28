"use client";

import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  MessageCircle,
  MapPin,
  PhoneOff,
  Search,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TwoTone, Lede, Key, Eyebrow } from "@/components/ui/type";

/**
 * The reasons to trust it, as a horizontal rail of statistic cards.
 *
 * Every card is now one number, one source, and a clip that plays the thing the
 * number claims. The mixed cards that used to sit here (an object, a claim, a
 * promise list, a category marquee) were cut on 2026-07-27: they made this a
 * feature dump, and the numbers are the argument.
 *
 * One card per tool at minimum, so the evidence covers the whole suite rather
 * than only the booking website. Sources are printed on the card on purpose —
 * an unattributed percentage reads as marketing.
 */

export function Features() {
  const rail = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  }

  return (
    <section className="wash-paper overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <Eyebrow>Why this works</Eyebrow>
              <TwoTone lead="Built by us." trail="Run by you." className="mt-4" />
              <Lede className="mt-6">
                You know your trade. We know the software. We do the setup once, then{" "}
                <Key>hand you something simple to run</Key>.
              </Lede>
            </div>

            <div className="flex gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => scrollBy(dir)}
                  aria-label={dir === -1 ? "Previous cards" : "Next cards"}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/15 text-espresso/60 transition-colors hover:bg-espresso/[0.05] hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon/50"
                >
                  {dir === -1 ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Rail — bleeds off the right edge so it reads as continuing. */}
      <div
        ref={rail}
        className="rail mt-14 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        {/* 1 — Book: the shop that takes bookings online gets picked */}
        <Card glow="#e8920a" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat
            value="94%"
            label="more likely to pick a shop that books online"
            source="GetApp"
          />
          <Scene className="mt-6 flex-1 justify-center gap-2.5">
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-espresso/40">
              Same street, two shops
            </p>
            <div className="fx-row flex items-center gap-2.5 rounded-lg border border-cinnamon/30 bg-paper-warm px-2.5 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[0.75rem] font-bold text-espresso">
                Books online
              </span>
              <span className="fx-bob rounded-pill bg-success/12 px-2 py-0.5 text-[0.6875rem] font-bold text-success">
                Booked
              </span>
            </div>
            <div className="fx-row fx-d2 flex items-center gap-2.5 rounded-lg border border-espresso/[0.07] px-2.5 py-2.5 opacity-60">
              <PhoneOff className="h-3.5 w-3.5 shrink-0 text-espresso/35" strokeWidth={2.4} />
              <span className="min-w-0 flex-1 truncate text-[0.75rem] text-espresso/55">
                Call during opening hours
              </span>
            </div>
          </Scene>
        </Card>

        {/* 2 — Book: bookings landing while the shop is shut */}
        <Card glow="#e8920a" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat
            value="50%"
            label="of salon bookings happen while the shop is closed"
            source="Boulevard"
          />
          <Scene className="mt-6 flex-1 justify-center gap-2">
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-espresso/40">
              <Clock className="h-3 w-3" strokeWidth={2.4} />
              Shop closed 19:00
            </p>
            {[
              { t: "21:40", s: "Haircut · ₪80" },
              { t: "23:15", s: "Beard trim · ₪50" },
              { t: "02:07", s: "Cut + beard · ₪120" },
            ].map((row, i) => (
              <div
                key={row.t}
                className={`fx-row ${DELAY[i]} flex items-center gap-2.5 rounded-lg border border-espresso/[0.07] bg-paper-warm px-2.5 py-2`}
              >
                <span className="font-mono text-[0.75rem] font-bold tabular-nums text-espresso">
                  {row.t}
                </span>
                <span className="min-w-0 truncate text-[0.75rem] text-espresso/55">
                  {row.s}
                </span>
                <Check
                  className="ml-auto h-3.5 w-3.5 shrink-0 text-success"
                  strokeWidth={3}
                />
              </div>
            ))}
          </Scene>
        </Card>

        {/* 3 — Bots: the message that gets answered against the one that doesn't */}
        <Card glow="#1fa971" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat
            value="85%"
            label="of people who reach voicemail never call back"
            source="OnCallClerk"
          />
          <Scene className="mt-6 flex-1 justify-center gap-5">
            <Race
              who="Your bot on WhatsApp"
              detail="replied in 4 seconds"
              fill="fx-fill-fast"
              color="#1fa971"
            />
            <Race
              who="Voicemail"
              detail={<TypingDots />}
              fill="fx-fill-slow"
              color="rgba(42,29,20,0.22)"
            />
          </Scene>
        </Card>

        {/* 4 — Book: reminders. The message goes out, the seat gets confirmed. */}
        <Card glow="#e8920a" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat
            value="25%"
            label="fewer no shows once reminders go out on their own"
            source="Am. J. of Medicine"
          />
          <Scene className="mt-6 flex-1 justify-center">
            {/* Both beats share one grid cell so the card never reflows mid-loop. */}
            <div className="grid">
              <div className="fx-send col-start-1 row-start-1 self-center">
                <div className="flex items-start gap-2 rounded-2xl rounded-tl-md border border-espresso/[0.07] bg-paper-warm px-3 py-2.5">
                  <MessageCircle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cinnamon"
                    strokeWidth={2.4}
                  />
                  <p className="text-[0.75rem] leading-snug text-espresso/70">
                    Hi Dana, tomorrow at 16:00 with Shimi. Reply{" "}
                    <span className="font-bold text-espresso">1</span> to confirm.
                  </p>
                </div>
              </div>
              <div className="fx-confirm col-start-1 row-start-1 flex items-center justify-center self-center">
                <span className="inline-flex items-center gap-2 rounded-pill bg-success/12 px-3.5 py-2 text-[0.8125rem] font-bold text-success">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Confirmed. Seat held
                </span>
              </div>
            </div>
          </Scene>
        </Card>

        {/* 5 — Social: the week of posts they check before they walk in */}
        <Card glow="#d4622a" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat
            value="76%"
            label="check your online presence before they visit"
            source="Visual Objects"
          />
          <Scene className="mt-6 flex-1 justify-center">
            <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-espresso/40">
              This week, scheduled
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                <div
                  key={day}
                  className="fx-row flex aspect-square flex-col items-center justify-center rounded-lg border border-espresso/[0.07] bg-paper-warm"
                  /* Inline, not the fx-d* classes: six tiles need a finer
                     stagger than the three-step scale those provide. */
                  style={{ animationDelay: `${i * 0.18}s` }}
                >
                  <span className="text-[0.625rem] font-bold text-espresso/50">
                    {day}
                  </span>
                  <Check className="mt-1 h-3 w-3 text-success" strokeWidth={3} />
                </div>
              ))}
            </div>
          </Scene>
        </Card>

        {/* 6 — Reach: the near-me search that ends in a visit */}
        <Card glow="#2d6cf0" className="flex min-h-[380px] w-[300px] flex-col sm:w-[340px]">
          <Stat
            value="76%"
            label="who search near me visit a shop within 24 hours"
            source="Think with Google"
          />
          <Scene className="mt-6 flex-1 justify-center gap-2">
            <p className="mb-1 flex items-center gap-1.5 rounded-lg border border-espresso/[0.07] bg-paper-warm px-2.5 py-2 font-mono text-[0.6875rem] text-espresso/50">
              <Search className="h-3 w-3 shrink-0" strokeWidth={2.4} />
              barber near me
            </p>
            {[
              { name: "Your shop", mine: true },
              { name: "Shop on the corner", mine: false },
              { name: "Shop two streets over", mine: false },
            ].map((row, i) => (
              <div
                key={row.name}
                className={`fx-row ${DELAY[i]} flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${
                  row.mine
                    ? "border border-cinnamon/30 bg-paper-warm"
                    : "border border-espresso/[0.05] opacity-55"
                }`}
              >
                <MapPin
                  className={`h-3.5 w-3.5 shrink-0 ${row.mine ? "text-cinnamon" : "text-espresso/30"}`}
                  strokeWidth={2.4}
                />
                <span
                  className={`min-w-0 truncate text-[0.75rem] ${
                    row.mine ? "font-bold text-espresso" : "text-espresso/55"
                  }`}
                >
                  {row.name}
                </span>
              </div>
            ))}
          </Scene>
        </Card>

        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mt-12 max-w-md text-[0.9375rem] leading-relaxed text-espresso/50">
            <a
              href="#connect"
              className="font-semibold text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso/70"
            >
              Let&apos;s fix your problems
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Warm card with a colored edge-glow, tinted per card. */
function Card({
  glow,
  className,
  children,
}: {
  glow: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`lift shrink-0 rounded-3xl border p-7 sm:p-8 ${className ?? ""}`}
      style={{
        borderColor: `${glow}33`,
        background: `linear-gradient(165deg, ${glow}12, #FDFBF7 42%)`,
        boxShadow: `0 1px 0 ${glow}22 inset, 0 14px 40px -22px rgba(60,34,12,0.28)`,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger classes, in order. Defined in globals.css after the loop classes. */
const DELAY = ["", "fx-d1", "fx-d2", "fx-d3"] as const;

/** The number, what it means, and who published it. */
function Stat({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source: string;
}) {
  return (
    <div>
      <p className="text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-espresso">
        {value}
      </p>
      <p className="mt-2 text-[0.9375rem] leading-snug text-espresso/55">{label}</p>
      <p className="mt-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-espresso/35">
        {source}
      </p>
    </div>
  );
}

/**
 * The stage a card's clip plays on. Recessed rather than raised — the loop is
 * evidence sitting inside the card, not a second card on top of it.
 */
function Scene({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-espresso/[0.06] bg-espresso/[0.025] p-3 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** One competitor in the who-replied-first clip. */
function Race({
  who,
  detail,
  fill,
  color,
}: {
  who: string;
  detail: React.ReactNode;
  fill: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.75rem] font-bold text-espresso">{who}</span>
        <span className="text-[0.6875rem] text-espresso/45">{detail}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-espresso/[0.07]">
        <div className={`${fill} h-full w-full rounded-full`} style={{ background: color }} />
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="still typing">
      typing
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="fx-dot inline-block h-1 w-1 rounded-full bg-espresso/45"
          /* Inline, not the fx-d* classes: those are tuned to the 6.4s card
             cycle and would put a visible gap between the three dots. */
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
