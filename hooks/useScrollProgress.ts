"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks raw scroll progress (0 → 1) of a tall track element into a ref,
 * without triggering re-renders. Consumers (canvas scenes) damp toward
 * this target inside their own rAF loop for buttery camera motion.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const target = useRef(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : 0;
      target.current = Math.min(1, Math.max(0, p));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return target;
}
