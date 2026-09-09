"use client";

import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";

export default function AudienceSection() {
  const c = useCopy();

  return (
    <section className="relative border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="audience-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="09" label={c.audience.tag} />
          <h2
            id="audience-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.audience.h2a}{" "}
            <span className="text-foreground/50">{c.audience.h2b}</span>
          </h2>
          <p className="mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/60">
            {c.audience.p}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {c.audience.items.map((a, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div className="group hairline h-full rounded-xl bg-foreground/[0.015] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:bg-foreground/[0.03]">
                <span
                  className="block h-1 w-8 rounded-full bg-gradient-to-r from-brand-blue/80 to-brand-orange/80 transition-all duration-300 group-hover:w-12"
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-mono text-[12px] tracking-[0.2em] text-foreground">
                  {a.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/50">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-[13px] leading-relaxed text-foreground/35">
            {c.audience.foot}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
