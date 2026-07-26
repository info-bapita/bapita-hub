import { Star, Check, CheckCheck, MapPin, TrendingUp, Plus } from "lucide-react";
import { BrowserFrame, PhoneFrame } from "@/components/ui/frame";
import type { ProductId } from "@/lib/products";

/**
 * What each product actually looks like.
 *
 * The old homepage showed abstract clay art and never once showed the product,
 * so a visitor had no idea what they'd be getting. These are built as DOM so
 * they stay sharp at any size and can carry each product's accent color. They
 * are illustrative, not live screenshots — kept generic (a stand-in shop, round
 * numbers) so nothing here reads as a claim about a specific client.
 */

const BOOK = "#d4622a";
const SOCIAL = "#1fa971";
const BOTS = "#e0457b";
const REACH = "#2d6cf0";

/* ─────────────────────────── Book ─────────────────────────── */

const SERVICES = [
  { name: "Haircut", meta: "30 min", price: "₪80" },
  { name: "Beard trim", meta: "20 min", price: "₪50" },
  { name: "Cut + beard", meta: "45 min", price: "₪120" },
];

const SLOTS = ["09:30", "11:00", "14:30", "16:00", "17:15"];

function BookMock() {
  return (
    <BrowserFrame url="shimi.bapita.com" accent={BOOK}>
      <div className="bg-white">
        {/* shop header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ background: `linear-gradient(120deg, ${BOOK}14, transparent)` }}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white"
            style={{ background: BOOK }}
          >
            S
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-espresso">Shimi Barbershop</p>
            <p className="flex items-center gap-1 text-[0.6875rem] text-espresso/45">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Open · books 24/7
            </p>
          </div>
        </div>

        {/* services */}
        <div className="space-y-1.5 px-5 pb-1">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-xl border px-3.5 py-2.5"
              style={
                i === 0
                  ? { borderColor: `${BOOK}55`, background: `${BOOK}0d` }
                  : { borderColor: "rgba(42,29,20,0.08)" }
              }
            >
              <div>
                <p className="text-[0.8125rem] font-semibold text-espresso">{s.name}</p>
                <p className="text-[0.6875rem] text-espresso/40">{s.meta}</p>
              </div>
              <span className="text-[0.8125rem] font-bold tabular-nums text-espresso">
                {s.price}
              </span>
            </div>
          ))}
        </div>

        {/* slots */}
        <div className="px-5 pt-3.5">
          <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-espresso/35">
            Thursday
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SLOTS.map((t, i) => (
              <span
                key={t}
                className="rounded-lg px-2.5 py-1.5 text-[0.75rem] font-semibold tabular-nums"
                style={
                  i === 3
                    ? { background: BOOK, color: "#fff" }
                    : { background: "rgba(42,29,20,0.05)", color: "rgba(42,29,20,0.6)" }
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 pt-4">
          <div
            className="rounded-pill py-2.5 text-center text-[0.8125rem] font-bold text-white"
            style={{ background: BOOK }}
          >
            Book 16:00 · ₪80
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ────────────────────────── Social ────────────────────────── */

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const POSTS = [
  { day: 0, label: "Fade reel", tone: 1 },
  { day: 2, label: "Before / after", tone: 0.7 },
  { day: 3, label: "Story: slots", tone: 0.45 },
  { day: 5, label: "Weekend promo", tone: 0.85 },
];

function SocialMock() {
  return (
    <BrowserFrame url="app.bapita.com/social" accent={SOCIAL}>
      <div className="bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-espresso">This week</p>
          <span
            className="rounded-pill px-2.5 py-1 text-[0.6875rem] font-bold"
            style={{ background: `${SOCIAL}1a`, color: SOCIAL }}
          >
            4 scheduled
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEK.map((d, i) => {
            const post = POSTS.find((p) => p.day === i);
            return (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="text-center text-[0.625rem] font-bold text-espresso/30">
                  {d}
                </span>
                <div
                  className="flex h-20 flex-col justify-end rounded-lg p-1.5"
                  style={{
                    background: post
                      ? `color-mix(in srgb, ${SOCIAL} ${post.tone * 22}%, #fff)`
                      : "rgba(42,29,20,0.035)",
                    border: post ? `1px solid ${SOCIAL}44` : "1px solid transparent",
                  }}
                >
                  {post && (
                    <span className="text-[0.5625rem] font-semibold leading-tight text-espresso/70">
                      {post.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* composer */}
        <div className="mt-4 rounded-xl border border-espresso/[0.08] p-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-gradient-to-br from-clay-toast to-bowl-tan" />
            <span className="text-[0.6875rem] font-semibold text-espresso/50">
              Instagram · Facebook · TikTok
            </span>
          </div>
          <p className="mt-2.5 text-[0.75rem] leading-relaxed text-espresso/70">
            Two slots left this Friday. Tap the link to grab one ✂️
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="font-mono text-[0.625rem] text-espresso/35">
              Fri · 09:00
            </span>
            <span
              className="rounded-pill px-3 py-1 text-[0.6875rem] font-bold text-white"
              style={{ background: SOCIAL }}
            >
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ─────────────────────────── Bots ─────────────────────────── */

const CHAT = [
  { from: "them" as const, text: "hey, any space today around 4?" },
  { from: "us" as const, text: "Yes — 16:00 is open with Shimi. Want it?" },
  { from: "them" as const, text: "perfect 🙏" },
  { from: "us" as const, text: "Booked. Thursday 16:00, haircut ₪80. Reminder sent." },
];

function BotsMock() {
  return (
    <PhoneFrame className="mx-auto max-w-[280px]">
      <div className="bg-[#ECE5DD]">
        {/* chat header */}
        <div className="flex items-center gap-2.5 bg-[#075E54] px-3.5 py-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[0.625rem] font-extrabold text-white"
            style={{ background: BOTS }}
          >
            B
          </span>
          <div>
            <p className="text-[0.75rem] font-bold text-white">Shimi Barbershop</p>
            <p className="text-[0.5625rem] text-white/60">answers in seconds</p>
          </div>
        </div>

        <div className="space-y-2 px-3 py-3.5">
          {CHAT.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "us" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[0.6875rem] leading-snug shadow-sm ${
                  m.from === "us"
                    ? "bg-[#DCF8C6] text-espresso"
                    : "bg-white text-espresso"
                }`}
              >
                {m.text}
                <span className="mt-0.5 flex items-center justify-end gap-0.5 text-[0.5rem] text-espresso/35">
                  {m.from === "us" ? (
                    <>
                      16:0{i} <CheckCheck className="h-2.5 w-2.5 text-[#34B7F1]" />
                    </>
                  ) : (
                    <>15:5{i}</>
                  )}
                </span>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-1">
            <span
              className="flex items-center gap-1 rounded-pill px-2.5 py-1 text-[0.5625rem] font-bold text-white"
              style={{ background: BOTS }}
            >
              <Check className="h-2.5 w-2.5" />
              Added to your calendar
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ─────────────────────────── Reach ────────────────────────── */

function ReachMock() {
  return (
    <BrowserFrame url="google.com/maps" accent={REACH}>
      <div className="bg-white p-5">
        <div className="mb-3 flex items-center gap-2 rounded-pill border border-espresso/[0.08] px-3 py-2">
          <MapPin className="h-3.5 w-3.5" style={{ color: REACH }} />
          <span className="text-[0.75rem] text-espresso/50">barber near me</span>
        </div>

        {/* the win: ranked first */}
        <div
          className="rounded-xl p-3.5"
          style={{ background: `${REACH}0d`, border: `1px solid ${REACH}44` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.8125rem] font-bold text-espresso">Shimi Barbershop</p>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-[0.6875rem] font-bold text-espresso">4.9</span>
                <span className="flex" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-warning text-warning" />
                  ))}
                </span>
                <span className="text-[0.6875rem] text-espresso/40">(128)</span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-espresso/45">
                Open · 400 m · Herzliya
              </p>
            </div>
            <span
              className="shrink-0 rounded-pill px-2 py-0.5 text-[0.625rem] font-bold text-white"
              style={{ background: REACH }}
            >
              #1
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            <span
              className="rounded-lg px-2.5 py-1 text-[0.625rem] font-bold text-white"
              style={{ background: REACH }}
            >
              Book online
            </span>
            <span className="rounded-lg bg-espresso/[0.06] px-2.5 py-1 text-[0.625rem] font-semibold text-espresso/55">
              Directions
            </span>
          </div>
        </div>

        {/* two quieter competitors, to show the ranking is relative */}
        {["Cuts & Co.", "The Barber Room"].map((n) => (
          <div
            key={n}
            className="mt-1.5 flex items-center justify-between rounded-xl border border-espresso/[0.06] px-3.5 py-2.5"
          >
            <div>
              <p className="text-[0.75rem] font-semibold text-espresso/45">{n}</p>
              <p className="text-[0.625rem] text-espresso/30">4.3 · 1.2 km</p>
            </div>
            <Plus className="h-3 w-3 text-espresso/20" />
          </div>
        ))}

        <div className="mt-3.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold" style={{ color: REACH }}>
          <TrendingUp className="h-3.5 w-3.5" />
          Up 3 places this month
        </div>
      </div>
    </BrowserFrame>
  );
}

export const PRODUCT_MOCKS: Record<ProductId, () => React.JSX.Element> = {
  book: BookMock,
  social: SocialMock,
  bots: BotsMock,
  reach: ReachMock,
};
