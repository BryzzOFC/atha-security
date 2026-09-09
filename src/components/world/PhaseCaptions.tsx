"use client";

import { useEffect, useState, type MutableRefObject } from "react";
import { motion } from "framer-motion";
import { seg } from "@/lib/animations/easing";

const PHASES = [
  { from: 0.015, to: 0.385, label: "A NEW WORLD" },
  { from: 0.385, to: 0.42, label: "A SIGNAL IN THE SKY" },
  { from: 0.42, to: 0.545, label: "THE FIRST AGENT COMES ONLINE" },
  { from: 0.545, to: 0.78, label: "A WORLD IN MOTION" },
  { from: 0.78, to: 0.965, label: "EVERYTHING, CONNECTED" },
  { from: 0.965, to: 1.01, label: "ATHA SECURITY" },
] as const;

/**
 * Cinematic captions synced to the 3D build — rendered outside the canvas,
 * so they stay crisp and accessible. Re-renders only when the phase changes.
 */
export default function PhaseCaptions({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = progressRef.current;
      let next = -1;
      for (let i = 0; i < PHASES.length; i++) {
        const ph = PHASES[i];
        const local = seg(p, ph.from, ph.to);
        if (p >= ph.from && p < ph.to) {
          next = i;
          break;
        }
        void local;
      }
      setIndex((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 flex justify-center md:bottom-20">
      <div className="flex h-6 items-center">
        {index >= 0 && (
          <motion.p
            key={PHASES[index].label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="kicker text-[10px] text-white/45 md:text-[11px]"
          >
            {PHASES[index].label}
          </motion.p>
        )}
      </div>
    </div>
  );
}
