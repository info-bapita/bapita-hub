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
  /** Relative "closeness" used to scale the mouse-parallax offset — orbs
   *  with a higher depth read as nearer to the viewer and drift more. */
  depth: number;
};

const ORB_SIZE = 88;
// Four falafels, balanced two per side around the central pita bowl.
const ORBS: Orb[] = [
  { id: "book", label: "Book", size: ORB_SIZE, left: "13%", top: "42%", laneX: [0.05, 0.22], laneY: [0.38, 0.52], depth: 0.9 },
  { id: "social", label: "Social", size: ORB_SIZE, left: "87%", top: "42%", laneX: [0.78, 0.95], laneY: [0.38, 0.52], depth: 1.15 },
  { id: "bots", label: "Bots", size: ORB_SIZE, left: "15%", top: "66%", laneX: [0.06, 0.24], laneY: [0.58, 0.72], depth: 1.2 },
  { id: "reach", label: "Reach", size: ORB_SIZE, left: "85%", top: "66%", laneX: [0.76, 0.94], laneY: [0.58, 0.72], depth: 0.8 },
];

// Clay palettes tuned per falafel — orange / emerald / magenta / azure, so the
// four orbs read as distinct on-brand toppings.
const ORB_COLORS: Record<string, { highlight: string; base: string; deep: string }> = {
  book:   { highlight: "#ffc066", base: "#ef910a", deep: "#b86a00" },
  social: { highlight: "#b8d9b0", base: "#679e5a", deep: "#3d6b30" },
  bots:   { highlight: "#f2a8c4", base: "#cf4f7e", deep: "#8a3252" },
  reach:  { highlight: "#a8c8e8", base: "#4a7fb5", deep: "#2a4f7a" },
};
function orbPalette(id: ProductId) {
  return ORB_COLORS[id];
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

// Time between each orb starting its own drop-in arc — keeps the "1 by 1"
// entrance instead of everyone snapping in at once.
const STAGGER_MS = 170;
// How long ALL orbs sit inside the pocket together, after the last one has
// landed, before the whole group reappears at once.
const POCKET_HOLD_MS = 1900;
// Time between the start of one auto wave and the next.
const WAVE_INTERVAL_MS = 14000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function ClayScene() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();

  // Guards the whole synchronized in / pause / out cycle so a second wave
  // can't start (from the timer or a click) while one is already running.
  const waveRunning = useRef(false);
  // Handle to each orb's looping idle-bob animation, so it can be paused for
  // its drop and resumed afterwards without fighting the tween.
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

  // Arcs a single orb from its resting spot into the pocket and fades it out
  // there. Does NOT bring it back — that happens for every orb at once, once
  // the whole wave has landed.
  const dropIn = useCallback(
    async (i: number) => {
      const root = scope.current as HTMLElement | null;
      if (!root) return;
      const group = root.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
      const shadow = root.querySelector<HTMLElement>(`[data-shadow="${i}"]`);
      const pocket = root.querySelector<HTMLElement>("[data-pocket]");
      const bowl = root.querySelector<HTMLElement>("[data-bowl]");
      if (!group || !pocket || !bowl) return;

      stopIdle(i);
      // Settle out of the idle bob first so the arc doesn't start with a jump.
      await animate(group, { y: 0, rotate: 0 }, { duration: 0.15, ease: "easeOut" });

      const b = group.getBoundingClientRect();
      const p = pocket.getBoundingClientRect();
      const dx = p.left + p.width / 2 - (b.left + b.width / 2);
      const dy = p.top + p.height * 0.45 - (b.top + b.height / 2);

      if (shadow) animate(shadow, { opacity: 0 }, { duration: 0.2 });

      // Ball, shadow AND label are all children of `group`, so this single
      // tween is what keeps the caption glued to the orb through the arc.
      await animate(
        group,
        { x: [0, dx * 0.55, dx], y: [0, Math.min(0, dy * 0.2) - 70, dy], rotate: [0, -6, 2] },
        { duration: 0.9, times: [0, 0.42, 1], ease: ["easeOut", "easeIn"] }
      );

      animate(
        bowl,
        { scale: [1, 1.035, 1], filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"] },
        { duration: 0.4, ease: "easeOut" }
      );

      // Whole group (not just the ball) squashes and fades into the pocket,
      // so the label doesn't get left behind floating over an empty spot.
      await animate(group, { scaleY: 0.55, scaleX: 1.22 }, { duration: 0.12, ease: "easeOut" });
      await animate(group, { opacity: 0, scaleX: 0.5, scaleY: 0.3 }, { duration: 0.18, ease: "easeIn" });
    },
    [animate, scope, stopIdle]
  );

  // Runs one full cycle: every orb drops in one-by-one, they all sit inside
  // the pocket together for a beat, then the whole group reappears together.
  const runWave = useCallback(async () => {
    if (reduced || waveRunning.current) return;
    waveRunning.current = true;

    const root = scope.current as HTMLElement | null;
    const bowl = root?.querySelector<HTMLElement>("[data-bowl]");

    // 1) Staggered entrance — each orb waits its turn, then runs its own arc.
    await Promise.all(
      ORBS.map(async (_, i) => {
        await sleep(i * STAGGER_MS);
        await dropIn(i);
      })
    );

    // A slightly bigger settle once the whole group has landed together.
    if (bowl) {
      animate(
        bowl,
        { scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.14)", "brightness(1)"] },
        { duration: 0.5, ease: "easeOut" }
      );
    }

    // Snap every orb back to its resting transform while still invisible, so
    // the only thing left to animate on the way out is opacity.
    ORBS.forEach((_, i) => {
      const group = root?.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
      if (group) animate(group, { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 }, { duration: 0 });
    });

    // 2) Pause with everything tucked inside the pita.
    await sleep(POCKET_HOLD_MS);

    // 3) Everyone reappears together, labels included.
    await Promise.all(
      ORBS.map((_, i) => {
        const shadow = root?.querySelector<HTMLElement>(`[data-shadow="${i}"]`);
        const group = root?.querySelector<HTMLElement>(`[data-orb-group="${i}"]`);
        if (shadow) animate(shadow, { opacity: 1 }, { duration: 0.4 });
        if (!group) return Promise.resolve();
        return animate(group, { opacity: [0, 1] }, { duration: 0.6, ease: "easeOut" });
      })
    );

    ORBS.forEach((_, i) => startIdle(i));
    waveRunning.current = false;
  }, [animate, dropIn, reduced, scope, startIdle]);

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
      runWave();
    }, WAVE_INTERVAL_MS);
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
    <div ref={scope} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {ORBS.map((orb, i) => {
        const Icon = PRODUCT_ICONS[orb.id];
        const pal = orbPalette(orb.id);
        const size = `min(${orb.size}px, ${orb.size / 8}vw)`;
        // Depth-scaled mouse-follow: nearer orbs (higher depth) drift more.
        const px = (26 * orb.depth).toFixed(1);
        const py = (17 * orb.depth).toFixed(1);
        const rot = (1.3 * orb.depth).toFixed(2);

        return (
          <div
            key={orb.id}
            /* Orbs are desktop-only garnish: on narrow screens there are no
               side margins, so they collide with the centred hero copy. Hide
               below lg and let the pita bowl carry the metaphor on mobile. */
            className="absolute hidden lg:block"
            style={{ left: orb.left, top: orb.top, translate: "-50% -50%" }}
          >
            {/* Parallax layer — mouse-follow only. Wraps the whole assembly
                below so the parallax never has to be re-applied per element.
                Depth-scaled per orb and eased with a gentle spring curve so
                it reads as a soft follow rather than a snap. */}
            <div
              style={{
                transform: `translate3d(calc(var(--mx, 0) * ${px}px), calc(var(--my, 0) * ${py}px), 0) rotate(calc(var(--mx, 0) * ${rot}deg))`,
                transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
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
                  onClick={() => runWave()}
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

      {/* Pita bowl — premium 3D version. Percentage radii keep the dome
          silhouette identical at any width. Depth comes from several
          layered gradients per surface (base tone, directional sheen, far
          rim-light, ambient occlusion) instead of one flat gradient, and
          every highlight is a soft blurred glow instead of a hard-edged
          line. */}
      <div
        data-bowl
        className="pointer-events-none absolute left-1/2 top-full"
        style={{ width: "min(760px, 92vw)", translate: "-50% -52%", aspectRatio: "760 / 560" }}
      >
        <div className="relative size-full">
          {/* ambient contact shadow — grounds the object */}
          <div
            className="absolute left-1/2 rounded-full blur-2xl"
            style={{
              top: "4%",
              width: "86%",
              height: "26%",
              translate: "-50% 0",
              background: "radial-gradient(ellipse at center, rgba(35, 18, 5, 0.5) 0%, transparent 72%)",
            }}
          />

          {/* Rim — a proper torus band: base tone + a soft glaze highlight +
              a secondary far-edge light, so it reads as a curved tube
              rather than a flat colored strip. */}
          <div
            className="absolute left-0 right-0 top-0 rounded-full overflow-hidden"
            style={{
              height: "19%",
              background: "linear-gradient(180deg, #f8dda6 0%, #eebd76 26%, #cd9750 58%, #a8763a 84%, #93642e 100%)",
              boxShadow: [
                "inset 0 4px 0 rgba(255, 250, 235, 0.8)",
                "inset 0 18px 22px rgba(255, 244, 214, 0.6)",
                "inset 0 -20px 26px rgba(90, 52, 16, 0.55)",
                "0 12px 20px rgba(55, 30, 8, 0.22)",
              ].join(", "),
            }}
          >
            <div
              className="absolute"
              style={{
                top: "-30%",
                left: "8%",
                width: "40%",
                height: "140%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(255, 252, 240, 0.65) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: "10%",
                right: "4%",
                width: "26%",
                height: "80%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(255, 226, 175, 0.35) 0%, transparent 75%)",
                filter: "blur(3px)",
              }}
            />
          </div>

          {/* Body */}
          <div
            className="absolute inset-0"
            style={{
              top: "9%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(circle at 48% 4%, #f3d6a0 0%, #e0b06a 24%, #c68d48 50%, #97632a 78%, #6d4419 100%)",
              boxShadow: [
                "inset 30px 34px 56px rgba(255, 244, 214, 0.42)",
                "inset -30px -40px 64px rgba(70, 38, 12, 0.72)",
                "inset 0 18px 24px rgba(60, 32, 10, 0.35)",
                "0 46px 72px -20px rgba(60, 34, 12, 0.55)",
              ].join(", "),
            }}
          />
          {/* primary sheen — off-center so the surface reads as curved */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              top: "9%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(ellipse 44% 28% at 24% 10%, rgba(255, 246, 220, 0.6) 0%, transparent 65%)",
            }}
          />
          {/* secondary rim-light on the far edge */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              top: "9%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(ellipse 58% 38% at 84% 32%, rgba(255, 205, 140, 0.25) 0%, transparent 70%)",
            }}
          />
          {/* lower ambient occlusion — grounds the very base of the curve */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              top: "9%",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
              background: "radial-gradient(ellipse 70% 24% at 50% 100%, rgba(40, 20, 6, 0.4) 0%, transparent 70%)",
            }}
          />

          {/* Pocket — deep concave opening, with a soft catch-light hugging
              the near lip instead of a hard line */}
          <div
            data-pocket
            className="absolute rounded-full overflow-hidden"
            style={{
              top: "4%",
              left: "6%",
              right: "6%",
              height: "20%",
              background: "radial-gradient(ellipse at 50% 38%, #2e1a0a 0%, #4c2a11 55%, #6b4020 82%, #7d4d26 100%)",
              boxShadow: "inset 0 20px 32px rgba(0, 0, 0, 0.7), inset 0 -4px 8px rgba(190, 130, 78, 0.2)",
            }}
          >
            <div
              className="absolute left-[10%] right-[10%]"
              style={{
                top: "8%",
                height: "22%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(255, 232, 195, 0.38) 0%, transparent 75%)",
                filter: "blur(2px)",
              }}
            />
          </div>

          {/* grain — ties every layer together as one material */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              top: "9%",
              backgroundImage: GRAIN,
              opacity: 0.14,
              mixBlendMode: "overlay",
              borderRadius: "0 0 53% 53% / 0 0 75% 67%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
