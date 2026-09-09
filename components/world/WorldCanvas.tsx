"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTier } from "@/hooks/useTier";
import { useInView } from "@/hooks/useInView";
import { useWebGL } from "@/hooks/useWebGL";
import WorldScene from "./WorldScene";
import { WebGLFallback } from "./WebGLFallback";
import type { MutableRefObject } from "react";

/**
 * Client boundary for the hero 3D world:
 * - pauses the frameloop while offscreen (saves battery/GPU)
 * - honors prefers-reduced-motion with a static, fully-built world
 * - falls back to a CSS visual when WebGL is unavailable
 * - scales quality by device capability
 */
export default function WorldCanvas({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  const tier = useTier();
  const { ref, inView } = useInView<HTMLDivElement>("220px");

  const staticP = reduced ? 0.72 : null;
  const frameloop: "always" | "demand" | "never" = !webgl
    ? "never"
    : inView
      ? reduced
        ? "demand"
        : "always"
      : "never";

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      {webgl ? (
        <WorldScene progressRef={progressRef} staticP={staticP} tier={tier} frameloop={frameloop} />
      ) : (
        <WebGLFallback />
      )}
    </div>
  );
}
