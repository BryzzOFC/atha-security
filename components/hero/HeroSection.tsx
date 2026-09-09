"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { BrandMark } from "@/components/BrandMark";
import AuroraBackground from "@/components/hero/AuroraBackground";
import { useCopy } from "@/lib/i18n";

const PhoneCanvas = dynamic(() => import("@/components/phone/PhoneCanvas"), {
  ssr: false,
});

// silkier, longer-tail ease for the hero copy entrance
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const trackRef = useRef<HTMLElement>(null);
  const progressRef = useScrollProgress(trackRef);
  const c = useCopy();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const copyOpacity = useTransform(scrollYProgress, [0.025, 0.11], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0.025, 0.11], [0, -48]);
  const copyScale = useTransform(scrollYProgress, [0.025, 0.11], [1, 0.96]);
  const copyPointer = useTransform(copyOpacity, (v) => (v > 0.6 ? "auto" : "none"));
  const hintOpacity = useTransform(scrollYProgress, [0.005, 0.035], [1, 0]);

  return (
    <section
      ref={trackRef}
      id="top"
      aria-label={c.hero.aria}
      className="relative h-[240vh] md:h-[300vh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* monochrome brand aurora — strictly black & white depth */}
        <AuroraBackground />

        <PhoneCanvas progressRef={progressRef} />

        {/* hero copy */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY, scale: copyScale, pointerEvents: copyPointer }}
          className="absolute inset-0 z-10 flex items-center justify-center px-6"
        >
          <div
            className="mx-auto max-w-4xl text-center"
            style={{ textShadow: "var(--hero-text-shadow)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="flex items-center justify-center gap-3"
            >
              <BrandMark className="h-5 w-5" />
              <span className="kicker text-foreground/70">ATHA SECURITY</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE }}
              className="mt-6 text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-6xl md:text-7xl"
            >
              {c.hero.h1a}{" "}
              <span className="text-foreground/55">{c.hero.h1b}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
              className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-foreground/60 md:text-lg"
            >
              {c.hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: EASE }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href="#technology"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_36px_rgba(77,159,255,0.35)]"
              >
                {c.hero.ctaPrimary}
              </a>
              <a
                href="#contact"
                className="glass-panel inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg px-7 text-sm font-medium text-foreground/85 transition-all duration-300 hover:border-foreground/25 hover:text-foreground"
              >
                {c.hero.ctaSecondary}
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2"
        >
          <span className="kicker text-[9px] text-foreground/40">{c.hero.scrollHint}</span>
          <div className="h-8 w-px overflow-hidden bg-foreground/10">
            <motion.div
              animate={{ y: [-32, 32] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1/2 w-px bg-foreground/70"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
