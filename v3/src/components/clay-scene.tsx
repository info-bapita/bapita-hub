"use client";

import { useEffect, useRef } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import type { ProductId } from "@/lib/products";

// Decorative clay scene: six product orbs arced around a pita bowl that
// straddles the hero's bottom edge (the light→dark bridge). Pure DOM/CSS —
// framer-motion springs drive the drop; idle bob + blob-breathe live in CSS.

type Orb = {
  id: ProductId;
  label: string;
  size: number;
  left: string;
  top: string;
  depth: number; // mouse-parallax travel in px
  floatClass: string;
};

const ORBS: Orb[] = [
  { id: "book", label: "Book", size: 96, left: "13%", top: "26%", depth: 10, floatClass: "orb-float-0" },
  { id: "social", label: "Social", size: 88, left: "87%", top: "26%", depth: 12, floatClass: "orb-float-1" },
  { id: "seo", label: "SEO", size: 74, left: "6.5%", top: "54%", depth: 16, floatClass: "orb-float-2" },
  { id: "outreach", label: "Outreach", size: 74, left: "93.5%", top: "54%", depth: 14, floatClass: "orb-float-3" },
  { id: "bots", label: "Bots", size: 66, left: "21%", top: "76%", depth: 18, floatClass: "orb-float-4" },
  { id: "ads", label: "Ads", size: 66, left: "79%", top: "76%", depth: 18, floatClass: "orb-float-5" },
];

// Clay-tint every product color into one warm family via the clay tokens.
function orbPalette(id: ProductId) {
  const token = `var(--color-${id})`;
  return {
    highlight: `color-mix(in srgb, ${token} 52%, var(--color-clay))`,
    base: `color-mix(in srgb, ${token} 88%, var(--color-clay-toast))`,
    deep: `color-mix(in srgb, ${token} 72%, var(--color-bowl-dark))`,
  };
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

const DROP_INTERVAL_MS = 7000;

export function ClayScene() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();
  const busy = useRef(false);
  const nextIdx = useRef(0);

  async function drop(i: number) {
    if (busy.current || reduced) return;
    const root = scope.current as HTMLElement | null;
    if (!root) return;
    const ball = root.querySelector<HTMLElement>(`[data-ball="${i}"]`);
    const shadow = root.querySelector<HTMLElement>(`[data-shadow="${i}"]`);
    const pocket = root.querySelector<HTMLElement>("[data-pocket]");
    const bowl = root.querySelector<HTMLElement>("[data-bowl]");
    if (!ball || !pocket || !bowl) return;
    busy.current = true;

    const b = ball.getBoundingClientRect();
    const p = pocket.getBoundingClientRect();
    const dx = p.left + p.width / 2 - (b.left + b.width / 2);
    const dy = p.top + p.height * 0.45 - (b.top + b.height / 2);

    if (shadow) animate(shadow, { opacity: 0 }, { duration: 0.2 });

    // Bezier-ish arc: x sweeps evenly, y rises then falls into the pocket.
    await animate(
      ball,
      { x: [0, dx * 0.55, dx], y: [0, Math.min(0, dy * 0.2) - 70, dy] },
      { duration: 0.95, times: [0, 0.42, 1], ease: ["easeOut", "easeIn"] }
    );

    // Land: squash-stretch while the bowl pulses.
    animate(
      bowl,
      { scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.14)", "brightness(1)"] },
      { duration: 0.5, ease: "easeOut" }
    );
    await animate(ball, { scaleY: 0.55, scaleX: 1.28 }, { duration: 0.12, ease: "easeOut" });
    await animate(ball, { opacity: 0, scaleX: 0.5, scaleY: 0.35 }, { duration: 0.18, ease: "easeIn" });

    // Return at lane position.
    await animate(ball, { x: 0, y: 0, scaleX: 1, scaleY: 1 }, { duration: 0 });
    await animate(ball, { opacity: [0, 1] }, { duration: 0.55, ease: "easeOut" });
    if (shadow) animate(shadow, { opacity: 1 }, { duration: 0.4 });

    busy.current = false;
  }

  // Calm auto cadence, round-robin, paused when tab hidden.
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      drop(nextIdx.current);
      nextIdx.current = (nextIdx.current + 1) % ORBS.length;
    }, DROP_INTERVAL_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Mouse parallax via CSS vars (orb wrappers read --mx / --my).
  useEffect(() => {
    if (reduced) return;
    const root = scope.current as HTMLElement | null;
    if (!root) return;
    function onMove(e: PointerEvent) {
      const r = root!.getBoundingClientRect();
      root!.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
      root!.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5) * 2));
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div ref={scope} className="absolute inset-0 z-0" aria-hidden="true">
      {ORBS.map((orb, i) => {
        const Icon = PRODUCT_ICONS[orb.id];
        const pal = orbPalette(orb.id);
        const size = `min(${orb.size}px, ${orb.size / 8}vw)`;

        return (
          <div
            key={orb.id}
            className="absolute max-sm:opacity-60"
            style={{
              left: orb.left,
              top: orb.top,
              translate: "-50% -50%",
              transform: `translate3d(calc(var(--mx, 0) * ${orb.depth}px), calc(var(--my, 0) * ${orb.depth}px), 0)`,
              transition: "transform 0.6s ease-out",
            }}
          >
            <div className={`${orb.floatClass} flex flex-col items-center`}>
              <div
                data-ball={i}
                onClick={() => drop(i)}
                className="orb-ball relative flex cursor-pointer items-center justify-center"
                style={{
                  width: size,
                  height: size,
                  background: `radial-gradient(circle at 30% 26%, ${pal.highlight} 0%, ${pal.base} 42%, ${pal.deep} 100%)`,
                  boxShadow: [
                    // key light top-left
                    "inset 6px 9px 14px rgba(255, 250, 240, 0.4)",
                    // core shading
                    "inset -9px -12px 20px rgba(110, 63, 23, 0.28)",
                    // rim light bottom-right
                    "inset -2px -3px 4px rgba(255, 236, 208, 0.45)",
                    // cast
                    "0 16px 28px -12px rgba(110, 63, 23, 0.35)",
                  ].join(", "),
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{ backgroundImage: GRAIN, opacity: 0.16, mixBlendMode: "overlay" }}
                />
                <Icon
                  className="h-[36%] w-[36%]"
                  style={{
                    color: "rgba(42, 29, 20, 0.55)",
                    filter: "drop-shadow(0 1px 0 rgba(255, 255, 255, 0.35))",
                  }}
                  strokeWidth={2.2}
                />
              </div>
              {/* contact shadow */}
              <div
                data-shadow={i}
                className="mt-2 rounded-full blur-[5px]"
                style={{
                  width: `calc(${size} * 0.72)`,
                  height: `calc(${size} * 0.14)`,
                  background: "radial-gradient(closest-side, rgba(110, 63, 23, 0.32), transparent)",
                }}
              />
              {/* caption pill */}
              <span className="mt-1 rounded-pill bg-clay/80 px-2.5 py-0.5 text-[11px] font-bold text-espresso-muted shadow-sm backdrop-blur-sm max-sm:hidden">
                {orb.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Pita bowl — straddles the hero's bottom edge */}
      <div
        data-bowl
        className="pointer-events-none absolute left-1/2 top-full w-[min(560px,74vw)]"
        style={{ translate: "-50% -50%" }}
      >
        <div className="relative" style={{ aspectRatio: "560 / 230" }}>
          {/* body */}
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{
              background:
                "radial-gradient(120% 130% at 32% 16%, color-mix(in srgb, var(--color-bowl-tan) 62%, var(--color-clay-warm)) 0%, var(--color-bowl-tan) 46%, color-mix(in srgb, var(--color-bowl-tan) 52%, var(--color-bowl-dark)) 90%)",
              boxShadow: [
                "0 26px 60px -18px rgba(110, 63, 23, 0.5)",
                "inset -12px -16px 32px rgba(110, 63, 23, 0.38)",
                "inset 10px 12px 24px rgba(255, 242, 222, 0.38)",
              ].join(", "),
            }}
          />
          {/* pocket */}
          <div
            data-pocket
            className="absolute rounded-[50%]"
            style={{
              left: "14%",
              right: "14%",
              top: "11%",
              height: "48%",
              background:
                "radial-gradient(100% 130% at 50% 32%, color-mix(in srgb, var(--color-bowl-dark) 78%, black) 0%, var(--color-bowl-dark) 58%, color-mix(in srgb, var(--color-bowl-dark) 62%, var(--color-bowl-tan)) 100%)",
              boxShadow:
                "inset 0 12px 24px rgba(0, 0, 0, 0.45), inset 0 -4px 10px rgba(255, 214, 170, 0.18)",
            }}
          />
          {/* grain */}
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{ backgroundImage: GRAIN, opacity: 0.14, mixBlendMode: "overlay" }}
          />
        </div>
      </div>
    </div>
  );
}
