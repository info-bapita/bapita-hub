"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { StaticFallback } from "./static-fallback";

// three stack stays in this lazy chunk — never the global bundle, never SSR
const PitaCatch = dynamic(() => import("./pita-catch"), {
  ssr: false,
  loading: () => <StaticFallback />,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Decorative hero layer. Renders the interactive Pita Catch canvas when WebGL is
 * available and motion is allowed; otherwise the static arranged fallback.
 * Pauses the render loop when the hero scrolls out of view. Never blocks paint —
 * the headline + CTA live in the server-rendered hero above this.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "canvas" | "static">("pending");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Feature detection (reduced-motion, WebGL) must run after mount so the SSR
    // output stays the static fallback and hydration matches before we upgrade.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(reduced || !supportsWebGL() ? "static" : "canvas");
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mode !== "canvas") return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {mode === "static" && <StaticFallback animate={false} />}
      {mode === "pending" && <StaticFallback />}
      {mode === "canvas" && <PitaCatch paused={paused} />}
    </div>
  );
}
