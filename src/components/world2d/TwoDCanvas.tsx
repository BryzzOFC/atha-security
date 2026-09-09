"use client";

import type { MutableRefObject } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import TwoDScene from "./TwoDScene";

/**
 * Client boundary for the 2D hero scene — mirrors WorldCanvas behavior:
 * pauses the rAF loop offscreen and renders one static frame when the user
 * prefers reduced motion (same staticP 0.72 as the 3D world).
 */
export default function TwoDCanvas({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>("220px");
  // 2D static frame: the bench finale — the whole squad together (0.785)
  const staticP = reduced ? 0.785 : null;

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <TwoDScene progressRef={progressRef} staticP={staticP} active={inView} />
    </div>
  );
}
