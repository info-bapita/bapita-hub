import { BowlIcon } from "@/components/ui/brand-mark";
import { ORBS } from "./orbs";

/**
 * Static arranged composition shown when WebGL/physics can't (or shouldn't) run:
 * reduced-motion, no-WebGL, SSR placeholder, mobile low-power. The five hued orbs
 * rest in side margins and top area above the bowl — never over readable text.
 */
export function StaticFallback({ animate = true }: { animate?: boolean }) {
  // positions keep orbs in side margins + top, clear of the centered text block
  const spots = [
    { left: "7%",  top: "28%", animClass: "orb-float-0", delay: "0s"   },   // book  — far left
    { left: "84%", top: "22%", animClass: "orb-float-1", delay: "0.8s" },   // social — far right
    { left: "4%",  top: "52%", animClass: "orb-float-2", delay: "1.6s" },   // seo   — far left mid
    { left: "88%", top: "54%", animClass: "orb-float-3", delay: "0.4s" },   // outreach — far right mid
    { left: "49%", top: "5%",  animClass: "orb-float-4", delay: "1.2s" },   // bots  — top center
  ];

  const orbSize = "clamp(2.5rem, 7vw, 4.25rem)";

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
          className={animate ? spots[i].animClass : ""}
          style={{
            position: "absolute",
            left: spots[i].left,
            top: spots[i].top,
            animationDelay: spots[i].delay,
          }}
        >
          {/* pill label above orb */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "6px",
          }}>
            <span style={{
              fontFamily: "var(--font-heebo), system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "#f4f4f2",
              background: "rgba(11,11,12,0.72)",
              padding: "2px 7px",
              borderRadius: "9999px",
              whiteSpace: "nowrap",
              border: `1px solid ${orb.color}66`,
              lineHeight: 1.5,
            }}>
              {orb.label}
            </span>
          </div>
          {/* orb sphere */}
          <div
            style={{
              width: orbSize,
              height: orbSize,
              borderRadius: "9999px",
              background: `radial-gradient(circle at 35% 30%, ${orb.color}ff, ${orb.color}cc 45%, ${orb.color}55 75%, transparent)`,
              boxShadow: `0 0 28px 4px ${orb.color}55`,
            }}
          />
        </div>
      ))}

      {/* the bowl, center-bottom — positioned below text block */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "4%",
          transform: "translateX(-50%)",
          filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 18px rgba(244,244,242,0.12))",
        }}
      >
        <BowlIcon size={130} />
      </div>
    </div>
  );
}
