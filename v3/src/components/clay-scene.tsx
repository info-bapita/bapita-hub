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
  laneX: [number, number];
  laneY: [number, number];
};

const ORB_SIZE = 88;
const ORBS: Orb[] = [
  { id: "book", label: "Book", size: ORB_SIZE, left: "13%", top: "40%", laneX: [0.05, 0.21], laneY: [0.36, 0.50] },
  { id: "social", label: "Social", size: ORB_SIZE, left: "87%", top: "40%", laneX: [0.79, 0.95], laneY: [0.36, 0.50] },
  { id: "seo", label: "SEO", size: ORB_SIZE, left: "16%", top: "56%", laneX: [0.08, 0.24], laneY: [0.51, 0.64] },
  { id: "outreach", label: "Outreach", size: ORB_SIZE, left: "84%", top: "56%", laneX: [0.76, 0.92], laneY: [0.51, 0.64] },
  { id: "bots", label: "Bots", size: ORB_SIZE, left: "14%", top: "72%", laneX: [0.06, 0.22], laneY: [0.65, 0.78] },
  { id: "ads", label: "Ads", size: ORB_SIZE, left: "86%", top: "72%", laneX: [0.78, 0.94], laneY: [0.65, 0.78] },
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

// How often the scene auto-drops a random idle orb into the pita.
const AUTO_DROP_INTERVAL_MS = 2800;
// How long an orb "sits" inside the pocket before it reappears.
// Kept short and PER-ORB (not shared) so nothing waits on the others.
const POCKET_PAUSE_MS = 550;

export function ClayScene() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();

  // Per-orb busy flag — orbs are fully independent, several can be
  // mid-flight (or mid-idle-bob) at the same time.
  const busy = useRef<Record<number, boolean>>({});
  // Handle to each orb's looping idle-bob animation, so it can be
  // paused for a drop and resumed afterwards without fighting the tween.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idleControls = useRef<Record<number, any>>({});

  const startIdle = useCallback(
    (i: number) => {
      const root = scope.current as HTMLElement | null;
      if (!root || reduced) return;
      const group = root.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
      if (!group) return;
      // Stagger duration/phase per orb so they don't all bob in unison.
      const duration = 5.2 + (i % 3) * 0.7;
      const delay = (i * 0.4) % duration;
      idleControls.current[i] = animate(
        group,
        { y: [0, -13, 0], rotate: [-1.5, 1.5, -1.5] },
        { duration, delay, repeat: Infinity, ease: "easeInOut" }
      );
    },
    [animate, reduced, scope]
  );

  const stopIdle = useCallback((i: number) => {
    idleControls.current[i]?.stop?.();
    idleControls.current[i] = null;
  }, []);

  async function drop(i: number) {
    if (reduced || busy.current[i]) return;
    const root = scope.current as HTMLElement | null;
    if (!root) return;
    const group = root.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
    const shadow = root.querySelector<HTMLElement>(`[data-shadow="${i}"]`);
    const pocket = root.querySelector<HTMLElement>("[data-pocket]");
    const bowl = root.querySelector<HTMLElement>("[data-bowl]");
    if (!group || !pocket || !bowl) return;

    busy.current[i] = true;
    stopIdle(i);

    // Settle out of the idle bob first so the arc doesn't start with a jump.
    await animate(group, { y: 0, rotate: 0 }, { duration: 0.15, ease: "easeOut" });

    const b = group.getBoundingClientRect();
    const p = pocket.getBoundingClientRect();
    const dx = p.left + p.width / 2 - (b.left + b.width / 2);
    const dy = p.top + p.height * 0.45 - (b.top + b.height / 2);

    if (shadow) animate(shadow, { opacity: 0 }, { duration: 0.2 });

    // Ball, shadow AND label are all children of `group`, so this single
    // tween is what keeps the caption glued to the orb through the whole arc.
    await animate(
      group,
      { x: [0, dx * 0.55, dx], y: [0, Math.min(0, dy * 0.2) - 70, dy], rotate: [0, -6, 2] },
      { duration: 0.9, times: [0, 0.42, 1], ease: ["easeOut", "easeIn"] }
    );

    animate(
      bowl,
      { scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.14)", "brightness(1)"] },
      { duration: 0.5, ease: "easeOut" }
    );

    // Whole group (not just the ball) squashes and fades into the pocket,
    // so the label doesn't get left behind floating over an empty spot.
    await animate(group, { scaleY: 0.55, scaleX: 1.22 }, { duration: 0.12, ease: "easeOut" });
    await animate(group, { opacity: 0, scaleX: 0.5, scaleY: 0.3 }, { duration: 0.18, ease: "easeIn" });

    // Short beat "inside" the pita, then this orb reappears on its own —
    // it no longer waits for the other five to land.
    await new Promise((r) => setTimeout(r, POCKET_PAUSE_MS));

    animate(group, { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 }, { duration: 0 });
    if (shadow) animate(shadow, { opacity: 1 }, { duration: 0.35 });
    await animate(group, { opacity: [0, 1] }, { duration: 0.55, ease: "easeOut" });

    busy.current[i] = false;
    startIdle(i);
  }

  // Kick off each orb's idle bob on mount.
  useEffect(() => {
    if (reduced) return;
    ORBS.forEach((_, i) => startIdle(i));
    return () => {
      Object.keys(idleControls.current).forEach((k) => stopIdle(Number(k)));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      const idleOrbs = ORBS.map((_, i) => i).filter((i) => !busy.current[i]);
      if (!idleOrbs.length) return;
      drop(idleOrbs[Math.floor(Math.random() * idleOrbs.length)]);
    }, AUTO_DROP_INTERVAL_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            style={{ left: orb.left, top: orb.top, translate: "-50% -50%" }}
          >
            {/* Parallax layer — mouse-follow only. Wraps the whole assembly
                below so the parallax never has to be re-applied per element. */}
            <div
              style={{
                transform: `translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 8px), 0)`,
                transition: "transform 0.8s ease-out",
              }}
            >
              {/* Idle-bob + drop layer. Ball, contact shadow AND the caption
                  all live inside this one node, so every animation that
                  moves the orb — idle bob, mouse parallax's parent, or the
                  drop arc — moves the text with it. There is no code path
                  left where the label can move independently of the ball. */}
              <div data-orb-group={i} className="flex flex-col items-center">
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
                    style={{ color: "rgba(42, 29, 20, 0.55)", filter: "drop-shadow(0 1px 0 rgba(255, 255, 255, 0.35))" }}
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
                {/* caption pill — moves with the group, always */}
                <span className="mt-1 rounded-pill bg-clay/80 px-2.5 py-0.5 text-[11px] font-bold text-espresso-muted shadow-sm backdrop-blur-sm max-sm:hidden">
                  {orb.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/*
        Pita bowl — premium 3D version.

        Fix for the "cheap / 2D" look: the old body used a FIXED-PIXEL
        border-radius ("0 0 400px 400px / 0 0 380px 340px") on a box whose
        width is RESPONSIVE ("min(760px, 92vw)"). Once the box got narrower
        than ~800px the browser had to clamp those radii, and the dome
        silhouette collapsed into a flat, slightly-rounded rectangle — which
        reads as cheap and cut off. Below, every radius is a PERCENTAGE of
        the bowl's own box, so the silhouette is identical at any size.

        Depth comes from three separate gradient/shadow layers stacked on
        the body (base color, a soft directional sheen, and a secondary rim
        light on the far edge) instead of one flat radial-gradient, plus a
        grounding contact shadow underneath the whole object.

        NOTE ON THE "GETS CUT AT THE FOLD" ISSUE: this component only
        controls the shape and animation. Whether it visually continues
        into the second-fold section depends on the ancestor markup — if
        the Hero section's own wrapper has `overflow: hidden` (very common),
        it will clip the bottom half of this bowl even though the styles
        below are otherwise correct. That overflow clipping needs to live
        on a shared wrapper around *both* the hero and the next section, not
        on the hero alone. Happy to fix that file too if you share it.
      */}
      <div
        data-bowl
        className="pointer-events-none absolute left-1/2 top-full"
        style={{ width: "min(760px, 92vw)", translate: "-50% -52%", aspectRatio: "760 / 560" }}
      >
        <div className="relative size-full">
          {/* soft ambient contact shadow — grounds the object instead of letting it float flat */}
          <div
            className="absolute left-1/2 rounded-full blur-2xl"
            style={{
              top: "2%",
              width: "88%",
              height: "30%",
              translate: "-50% 0",
              background: "radial-gradient(ellipse at center, rgba(40, 22, 8, 0.45) 0%, transparent 72%)",
            }}
          />

          {/* Rim — a proper torus band, not just a flat color */}
          <div
            className="absolute left-0 right-0 top-0 rounded-full"
            style={{
              height: "18%",
              background: "linear-gradient(180deg, #f2cf94 0%, #dba85e 38%, #b8873a 78%, #a1702c 100%)",
              boxShadow: [
                "inset 0 3px 0 rgba(255, 248, 230, 0.75)",
                "inset 0 16px 22px rgba(255, 240, 205, 0.55)",
                "inset 0 -14px 20px rgba(100, 58, 18, 0.5)",
                "0 10px 18px rgba(60, 34, 10, 0.18)",
              ].join(", "),
            }}
          />
          {/* thin seam highlight where rim meets body — the detail that reads as "real ceramic edge" */}
          <div
            className="absolute left-[3%] right-[3%] rounded-full"
            style={{ top: "17%", height: "3px", background: "rgba(255, 240, 210, 0.55)", filter: "blur(0.5px)" }}
          />

          {/* Body — percentage radii hold the dome shape at every viewport width */}
          <div
            className="absolute inset-0"
            style={{
              top: "10%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(circle at 50% 6%, #f0d29a 0%, #dcaa5e 32%, #b3782f 66%, #7a481c 100%)",
              boxShadow: [
                "inset 26px 30px 52px rgba(255, 240, 205, 0.4)",
                "inset -28px -36px 60px rgba(80, 44, 14, 0.7)",
                "0 44px 70px -22px rgba(70, 40, 14, 0.5)",
              ].join(", "),
            }}
          />
          {/* primary sheen — off-center so the surface reads as curved, not a flat card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              top: "10%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(ellipse 46% 30% at 22% 8%, rgba(255, 244, 214, 0.55) 0%, transparent 65%)",
            }}
          />
          {/* secondary rim-light on the far edge — this is what sells the 3D curvature */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              top: "10%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(ellipse 60% 40% at 82% 30%, rgba(255, 210, 150, 0.22) 0%, transparent 70%)",
            }}
          />

          {/* Pocket — deep concave opening */}
          <div
            data-pocket
            className="absolute rounded-full"
            style={{
              top: "4%",
              left: "6%",
              right: "6%",
              height: "20%",
              background: "radial-gradient(ellipse at 50% 35%, #3c220e 0%, #5e3616 65%, #7d4d26 100%)",
              boxShadow: "inset 0 18px 30px rgba(0, 0, 0, 0.65), inset 0 -3px 6px rgba(190, 130, 78, 0.18)",
            }}
          />
          {/* catch-light on the near lip of the opening */}
          <div
            className="absolute rounded-full"
            style={{ top: "22%", left: "9%", right: "9%", height: "3px", background: "rgba(255, 232, 195, 0.4)", filter: "blur(0.5px)" }}
          />

          {/* grain — ties every layer together as one material */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              top: "10%",
              backgroundImage: GRAIN,
              opacity: 0.15,
              mixBlendMode: "overlay",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
