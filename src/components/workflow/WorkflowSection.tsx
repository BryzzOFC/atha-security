"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven workflow visualization:
 * the user watches a security event move through ATHA stage by stage.
 */
export default function WorkflowSection() {
  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  const c = useCopy();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(c.workflow.stages.length - 1, Math.floor(v * c.workflow.stages.length));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const stage = c.workflow.stages[active];

  return (
    <section
      id="workflow"
      ref={trackRef}
      className="relative h-[400vh] scroll-mt-0 border-t border-foreground/[0.05]"
      aria-labelledby="workflow-heading"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[1.15fr_1fr] md:gap-20 md:px-10">
          {/* left — narrative */}
          <div>
            <SectionTag index="05" label={c.workflow.tag} />
            <h2
              id="workflow-heading"
              className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              {c.workflow.h2a}{" "}
              <span className="text-foreground/50">{c.workflow.h2b}</span>
            </h2>

            <div className="mt-10 min-h-[190px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active}-${stage.label}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <p className="num-tabular font-mono text-[11px] tracking-[0.3em] text-brand-orange">
                    {String(active + 1).padStart(2, "0")} / {String(c.workflow.stages.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-mono text-xl tracking-[0.14em] text-foreground md:text-2xl">
                    {stage.label}
                  </h3>
                  <p className="mt-4 max-w-md text-pretty leading-relaxed text-foreground/55">
                    {stage.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* right — timeline */}
          <div className="relative mx-auto h-[340px] w-full max-w-md md:h-[420px]" role="img" aria-label={c.workflow.timelineAria}>
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-foreground/[0.08]" aria-hidden="true" />
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gradient-to-b from-brand-blue to-brand-orange"
              aria-hidden="true"
            />
            <ol className="relative h-full">
              {c.workflow.stages.map((s, i) => {
                const isActive = i <= active;
                const isCurrent = i === active;
                return (
                  <li
                    key={i}
                    className="absolute left-0 flex -translate-y-1/2 items-center gap-4"
                    style={{ top: `${(i / (c.workflow.stages.length - 1)) * 100}%` }}
                  >
                    <span
                      className={cn(
                        "relative flex h-[15px] w-[15px] items-center justify-center rounded-full border transition-all duration-300",
                        isActive
                          ? "border-brand-blue/70 bg-brand-blue/25"
                          : "border-foreground/15 bg-card"
                      )}
                    >
                      {isCurrent && (
                        <span className="pulse-ring absolute h-4 w-4 rounded-full border border-brand-blue/70" />
                      )}
                      <span
                        className={cn(
                          "h-[5px] w-[5px] rounded-full transition-colors duration-300",
                          isActive ? "bg-brand-blue" : "bg-foreground/20"
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-[0.22em] transition-colors duration-300 md:text-[11px]",
                        isCurrent
                          ? "text-foreground"
                          : isActive
                            ? "text-foreground/55"
                            : "text-foreground/25"
                      )}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
