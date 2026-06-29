import { BowlIcon } from "@/components/ui/brand-mark";
import { ORBS } from "./orbs";

/**
 * Static arranged composition shown when WebGL/physics can't (or shouldn't) run:
 * reduced-motion, no-WebGL, SSR placeholder, mobile low-power. The five hued orbs
 * rest in an arc above the bowl — intentional, not broken.
 */
export function StaticFallback({ animate = true }: { animate?: boolean }) {
  // arc positions (% of container) above the bowl
  const spots = [
    { left: "16%", top: "30%", delay: "0s" },
    { left: "34%", top: "16%", delay: "0.8s" },
    { left: "52%", top: "12%", delay: "1.6s" },
    { left: "70%", top: "18%", delay: "0.4s" },
    { left: "85%", top: "34%", delay: "1.2s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ambient hub glow */}
      <div
        className={animate ? "hero-glow" : ""}
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: "60%",
          height: "60%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(closest-side, rgba(146,119,255,0.10), rgba(43,196,135,0.06) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {ORBS.map((orb, i) => (
        <div
          key={orb.id}
          className={animate ? "orb-float" : ""}
          style={{
            position: "absolute",
            left: spots[i].left,
            top: spots[i].top,
            width: "clamp(2.5rem, 7vw, 4.25rem)",
            height: "clamp(2.5rem, 7vw, 4.25rem)",
            animationDelay: spots[i].delay,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "9999px",
              background: `radial-gradient(circle at 35% 30%, ${orb.color}, ${orb.color}cc 45%, ${orb.color}55 75%, transparent)`,
              boxShadow: `0 0 28px 4px ${orb.color}66`,
            }}
          />
        </div>
      ))}

      {/* the bowl, center-bottom */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          transform: "translateX(-50%)",
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
        }}
      >
        <BowlIcon size={120} />
      </div>
    </div>
  );
}
