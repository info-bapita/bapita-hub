"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";
import { PRODUCT_ICONS } from "@/lib/icon-map";
import type { ProductId } from "@/lib/products";

type Orb = {
  id: ProductId;
  label: string;
  size: number;
  left: string;
  top: string;
  floatClass: string;
  laneX: [number, number];
  laneY: [number, number];
};

const ORB_SIZE = 88;
const ORBS: Orb[] = [
  { id: "book", label: "Book", size: ORB_SIZE, left: "13%", top: "40%", floatClass: "orb-float-0", laneX: [0.05, 0.21], laneY: [0.36, 0.50] },
  { id: "social", label: "Social", size: ORB_SIZE, left: "87%", top: "40%", floatClass: "orb-float-1", laneX: [0.79, 0.95], laneY: [0.36, 0.50] },
  { id: "seo", label: "SEO", size: ORB_SIZE, left: "16%", top: "56%", floatClass: "orb-float-2", laneX: [0.08, 0.24], laneY: [0.51, 0.64] },
  { id: "outreach", label: "Outreach", size: ORB_SIZE, left: "84%", top: "56%", floatClass: "orb-float-3", laneX: [0.76, 0.92], laneY: [0.51, 0.64] },
  { id: "bots", label: "Bots", size: ORB_SIZE, left: "14%", top: "72%", floatClass: "orb-float-4", laneX: [0.06, 0.22], laneY: [0.65, 0.78] },
  { id: "ads", label: "Ads", size: ORB_SIZE, left: "86%", top: "72%", floatClass: "orb-float-5", laneX: [0.78, 0.94], laneY: [0.65, 0.78] },
];

const ORB_COLORS: Record<string, { highlight: string; base: string; deep: string }> = {
  book:     { highlight: "#ffc066", base: "#ef910a", deep: "#b86a00" },
  social:   { highlight: "#f09a7a", base: "#C75A1F", deep: "#8a3e15" },
  seo:      { highlight: "#b8d9b0", base: "#679e5a", deep: "#3d6b30" },
  outreach: { highlight: "#d4b0d9", base: "#8e5a9e", deep: "#5c306b" },
  bots:     { highlight: "#a8c8e8", base: "#4a7fb5", deep: "#2a4f7a" },
  ads:      { highlight: "#cfe0d5", base: "#8FA89B", deep: "#5c786b" },
};
function orbPalette(id: ProductId) {
  return ORB_COLORS[id];
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

const DROP_INTERVAL_MS = 7000;

export function ClayScene() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();
  const busy = useRef(false);
  const nextIdx = useRef(0);
  const landedCount = useRef(0);

  const resetAll = useCallback(async () => {
    const root = scope.current as HTMLElement | null;
    if (!root) return;
    for (let i = 0; i < ORBS.length; i++) {
      const group = root.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
      const shadow = root.querySelector<HTMLElement>(`[data-shadow="${i}"]`);
      if (!group) continue;
      animate(group, { x: 0, y: 0 }, { duration: 0 });
      animate(group, { opacity: [0, 1] }, { duration: 0.55, ease: "easeOut" });
      if (shadow) animate(shadow, { opacity: 1 }, { duration: 0.4 });
    }
    landedCount.current = 0;
  }, [animate, scope]);

  async function drop(i: number) {
    if (busy.current || reduced) return;
    const root = scope.current as HTMLElement | null;
    if (!root) return;
    const group = root.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
    const ball = root.querySelector<HTMLElement>(`[data-ball="${i}"]`);
    const shadow = root.querySelector<HTMLElement>(`[data-shadow="${i}"]`);
    const pocket = root.querySelector<HTMLElement>("[data-pocket]");
    const bowl = root.querySelector<HTMLElement>("[data-bowl]");
    if (!group || !ball || !pocket || !bowl) return;
    busy.current = true;

    const b = group.getBoundingClientRect();
    const p = pocket.getBoundingClientRect();
    const dx = p.left + p.width / 2 - (b.left + b.width / 2);
    const dy = p.top + p.height * 0.45 - (b.top + b.height / 2);

    if (shadow) animate(shadow, { opacity: 0 }, { duration: 0.2 });

    // Animate the whole group (ball, shadow, label) along the arc
    await animate(
      group,
      { x: [0, dx * 0.55, dx], y: [0, Math.min(0, dy * 0.2) - 70, dy] },
      { duration: 0.95, times: [0, 0.42, 1], ease: ["easeOut", "easeIn"] }
    );

    // Pulse the bowl
    animate(
      bowl,
      { scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.14)", "brightness(1)"] },
      { duration: 0.5, ease: "easeOut" }
    );
    // Squash‑stretch the ball only
    await animate(ball, { scaleY: 0.55, scaleX: 1.28 }, { duration: 0.12, ease: "easeOut" });
    await animate(ball, { opacity: 0, scaleX: 0.5, scaleY: 0.35 }, { duration: 0.18, ease: "easeIn" });

    landedCount.current += 1;

    if (landedCount.current >= ORBS.length) {
      await new Promise((r) => setTimeout(r, 1200));
      await resetAll();
    } else {
      // Snap group back to lane, keep invisible until resetAll
      await animate(group, { x: 0, y: 0, scaleX: 1, scaleY: 1 }, { duration: 0 });
    }

    busy.current = false;
  }

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      drop(nextIdx.current);
      nextIdx.current = (nextIdx.current + 1) % ORBS.length;
    }, DROP_INTERVAL_MS);
    return () => clearInterval(t);
  }, [reduced]);

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
              transform: `translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 8px), 0)`,
              transition: "transform 0.8s ease-out",
            }}
          >
            {/* Group that will be animated during drop */}
            <div
              data-orb-group={i}
              className="flex flex-col items-center"
            >
              <div
                data-ball={i}
                onClick={() => drop(i)}
                className="orb-ball relative flex cursor-pointer items-center justify-center"
                style={{
                  width: size,
                  height: size,
                  background: `radial-gradient(circle at 30% 26%, ${pal.highlight} 0%, ${pal.base} 42%, ${pal.deep} 100%)`,
                  boxShadow: [
                    "inset 6px 9px 14px rgba(255, 250, 240, 0.4)",
                    "inset -9px -12px 20px rgba(110, 63, 23, 0.28)",
                    "inset -2px -3px 4px rgba(255, 236, 208, 0.45)",
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
              {/* caption pill – now moves with the group */}
              <span className="mt-1 rounded-pill bg-clay/80 px-2.5 py-0.5 text-[11px] font-bold text-espresso-muted shadow-sm backdrop-blur-sm max-sm:hidden">
                {orb.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Pita bowl – premium 3D version */}
      <div
        data-bowl
        className="pointer-events-none absolute left-1/2 top-full"
        style={{
          width: "min(760px, 92vw)",
          translate: "-50% -52%",
          aspectRatio: "760 / 560",
        }}
      >
        <div className="relative size-full">
          {/* Rim – wider, with glossy highlight */}
          <div
            className="absolute left-0 right-0 top-0 rounded-full"
            style={{
              height: "18%",
              background: "radial-gradient(ellipse at 50% 30%, #e6b87a 0%, #cfa05a 50%, #b8873a 100%)",
              boxShadow: [
                "inset 0 14px 24px rgba(255, 236, 200, 0.55)",
                "inset 0 -12px 20px rgba(110, 64, 20, 0.45)",
                "0 8px 16px rgba(0,0,0,0.12)",
              ].join(", "),
            }}
          />
          {/* Body – deeper gradient, richer shadows */}
          <div
            className="absolute inset-0"
            style={{
              top: "10%",
              borderRadius: "0 0 400px 400px / 0 0 380px 340px",
              background: "radial-gradient(circle at 50% 8%, #e2bc7a 0%, #c69a52 40%, #9e6f2f 75%, #7a481c 100%)",
              boxShadow: [
                "inset 24px 30px 48px rgba(255, 236, 200, 0.35)",
                "inset -26px -34px 56px rgba(90, 52, 18, 0.65)",
                "0 40px 64px -22px rgba(90, 52, 18, 0.45)",
              ].join(", "),
            }}
          />
          {/* Specular highlight on the body (3D sheen) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              top: "10%",
              borderRadius: "0 0 400px 400px / 0 0 380px 340px",
              background: "radial-gradient(ellipse at 20% 10%, rgba(255, 240, 200, 0.25) 0%, transparent 60%)",
            }}
          />
          {/* Pocket – deeper and more realistic */}
          <div
            data-pocket
            className="absolute rounded-full"
            style={{
              top: "4%",
              left: "6%",
              right: "6%",
              height: "20%",
              background: "radial-gradient(ellipse at center, #4a2a12 0%, #6e3d1a 70%, #8a5128 100%)",
              boxShadow: "inset 0 16px 32px rgba(0, 0, 0, 0.6), inset 0 -4px 8px rgba(180, 120, 70, 0.15)",
            }}
          />
          {/* Grain overlay on the whole bowl */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: GRAIN,
              opacity: 0.16,
              mixBlendMode: "overlay",
              borderRadius: "0 0 400px 400px / 0 0 380px 340px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
