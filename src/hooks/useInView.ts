"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-based visibility hook.
 * Used to pause WebGL frameloops (and other work) while offscreen.
 */
export function useInView<T extends HTMLElement>(rootMargin = "160px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Fallback for environments without IntersectionObserver.
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView } as const;
}
