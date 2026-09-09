"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

/** Scroll-reveal wrapper — honors prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Numbered section kicker, e.g. "01 · THE PROBLEM". */
export function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="kicker text-brand-orange">{index}</span>
      <span className="h-px w-10 bg-gradient-to-r from-brand-orange/70 to-transparent" />
      <span className="kicker text-white/45">{label}</span>
    </div>
  );
}
