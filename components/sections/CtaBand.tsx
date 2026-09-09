"use client";

import { Reveal } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";

export default function CtaBand() {
  const c = useCopy();

  return (
    <section className="relative border-t border-foreground/[0.05] py-24 md:py-28" aria-label={c.ctaband.aria}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-2xl px-8 py-14 text-center md:py-16">
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-40 w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-3xl"
              aria-hidden="true"
            />
            <h2 className="relative mx-auto max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
              {c.ctaband.h2}
            </h2>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_36px_rgba(255,255,255,0.25)]"
              >
                {c.ctaband.ctaPrimary}
              </a>
              <a
                href="#technology"
                className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-lg border border-foreground/15 px-7 text-sm font-medium text-foreground/85 transition-all duration-300 hover:border-foreground/30 hover:text-foreground"
              >
                {c.ctaband.ctaSecondary}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
