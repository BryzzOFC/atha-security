"use client";

import { Workflow, Eye, ShieldCheck } from "lucide-react";
import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";

const PRACTICE_ICONS = [Workflow, Eye, ShieldCheck] as const;

export default function AiBuiltSection() {
  const c = useCopy();

  return (
    <section id="ai-native" className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="ai-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="04" label={c.aibuilt.tag} />
          <h2
            id="ai-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.aibuilt.h2a} <span className="text-foreground/50">{c.aibuilt.h2b}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal delay={0.1}>
            <div className="space-y-5 text-pretty leading-relaxed text-foreground/60">
              <p>{c.aibuilt.p1}</p>
              <p>{c.aibuilt.p2}</p>
              <p className="text-foreground/45">{c.aibuilt.p3}</p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            {/* the bridge */}
            <div className="glass-panel relative overflow-hidden rounded-2xl p-8 md:p-10">
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="text-center">
                  <p className="font-mono text-[11px] tracking-[0.24em] text-foreground/80 md:text-[13px]">
                    {c.aibuilt.bridge.fast}
                  </p>
                  <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] text-foreground/35">
                    {c.aibuilt.bridge.fastSub}
                  </p>
                </div>

                <div className="relative mx-2 flex-1" aria-hidden="true">
                  <div className="h-px w-full bg-foreground/12" />
                  <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <span className="pulse-ring absolute h-8 w-8 rounded-full border border-brand-orange/50" />
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange/60 bg-card shadow-[0_0_28px_rgba(255,138,43,0.4)]">
                      <span className="h-2 w-2 rounded-full bg-brand-orange" />
                    </span>
                  </span>
                  <span className="absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.3em] text-brand-orange">
                    ATHA
                  </span>
                </div>

                <div className="text-center">
                  <p className="font-mono text-[11px] tracking-[0.24em] text-foreground/80 md:text-[13px]">
                    {c.aibuilt.bridge.safe}
                  </p>
                  <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] text-foreground/35">
                    {c.aibuilt.bridge.safeSub}
                  </p>
                </div>
              </div>

              <div className="relative mt-12 space-y-4">
                {c.aibuilt.practices.map((p, i) => {
                  const Icon = PRACTICE_ICONS[i];
                  return (
                    <div key={i} className="flex items-start gap-3.5">
                      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-blue" strokeWidth={1.7} aria-hidden="true" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{p.title}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-foreground/50">{p.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
