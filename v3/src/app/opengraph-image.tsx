import { ImageResponse } from "next/og";

export const alt = "Bapita | Your business, online. Without the tech.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORBS = [
  { color: "#f0743a", x: 880, y: 120, r: 44 },
  { color: "#2bc487", x: 1010, y: 220, r: 34 },
  { color: "#4e86ff", x: 940, y: 340, r: 38 },
  { color: "#9277ff", x: 1070, y: 420, r: 30 },
  { color: "#f2628f", x: 860, y: 470, r: 26 },
  { color: "#f5a623", x: 990, y: 540, r: 32 },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b0b0c 0%, #141416 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {ORBS.map((orb) => (
          <div
            key={orb.color}
            style={{
              position: "absolute",
              left: orb.x,
              top: orb.y,
              width: orb.r * 2,
              height: orb.r * 2,
              borderRadius: "50%",
              background: orb.color,
              opacity: 0.85,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 28,
              borderBottomLeftRadius: 56,
              borderBottomRightRadius: 56,
              background: "#c8893f",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 800, color: "#f4f4f2" }}>
            Bapita
          </div>
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#f4f4f2",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: 760,
          }}
        >
          Your business, online. Without the tech.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            color: "#9a9aa2",
            maxWidth: 680,
            lineHeight: 1.4,
          }}
        >
          We build and run your digital tools: booking, social, and more.
        </div>
      </div>
    ),
    { ...size }
  );
}
