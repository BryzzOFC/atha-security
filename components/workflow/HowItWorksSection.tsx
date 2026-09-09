"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const c = useCopy();
  const step = c.how.steps[active];

  return (
    <section className="relative border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="03" label={c.how.tag} />
          <h2
            id="how-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.how.h2a} <span className="text-foreground/50">{c.how.h2b}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-16">
          <ol className="relative flex flex-col gap-2 md:flex-row md:items-start md:gap-0" role="list">
            {/* connecting line — desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px md:block" aria-hidden="true">
              <div className="h-full w-full bg-foreground/[0.08]" />
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 w-full origin-left bg-brand-blue/50"
              />
              <motion.span
                animate={{ left: ["0%", "100%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand-orange shadow-[0_0_12px_rgba(255,138,43,0.9)]"
              />
            </div>

            {c.how.steps.map((s, i) => (
              <li key={i} className="flex-1 md:px-2">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={active === i}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors duration-200 md:flex-col md:items-center md:gap-3 md:px-2 md:py-0 md:text-center",
                    active === i ? "text-foreground" : "text-foreground/40 hover:text-foreground/75"
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-all duration-300",
                      active === i
                        ? "border-brand-blue/60 bg-brand-blue/10 text-brand-blue shadow-[0_0_24px_rgba(77,159,255,0.3)]"
                        : "border-foreground/12 bg-card text-foreground/40 group-hover:border-foreground/25"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[12px] tracking-[0.26em] md:mt-1">
                    {s.step}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="glass-panel mt-12 min-h-[110px] rounded-xl px-6 py-6 md:mx-6" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-${step.step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                className="flex items-start gap-4"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-brand-orange">
                  {String(active + 1).padStart(2, "0")} —
                </span>
                <div>
                  <h3 className="font-mono text-[13px] tracking-[0.2em] text-foreground">{step.step}</h3>
                  <p className="mt-2 max-w-xl text-pretty leading-relaxed text-foreground/60">{step.text}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
