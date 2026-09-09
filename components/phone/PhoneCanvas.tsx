"use client";

import type { MutableRefObject } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import PhoneScene from "./PhoneScene";

/**
 * Client boundary for the keynote phone scene — mirrors the old canvas
 * boundary: pauses the rAF loop offscreen and renders a static settled
 * poster when the user prefers reduced motion.
 */
export default function PhoneCanvas({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>("220px");

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <PhoneScene progressRef={progressRef} active={inView} reduced={reduced} />
    </div>
  );
}
