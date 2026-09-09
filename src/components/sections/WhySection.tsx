"use client";

import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function WhySection() {
  const c = useCopy();

  return (
    <section id="why" className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="why-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="06" label={c.why.tag} />
          <h2
            id="why-heading"
            className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.why.h2a} <span className="text-foreground/50">{c.why.h2b}</span>
          </h2>
          <p className="mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/60">
            {c.why.p}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {c.why.items.map((item, i) => (
            <Reveal
              key={i}
              delay={0.06 * i}
              className={cn(i < 3 ? "lg:col-span-2" : "lg:col-span-3")}
            >
              <div className="group hairline h-full rounded-xl bg-foreground/[0.015] p-6 transition-all duration-300 hover:border-brand-orange/30 hover:bg-foreground/[0.03]">
                <span className="num-tabular font-mono text-[11px] tracking-[0.2em] text-brand-orange/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-medium text-foreground">{item.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/55">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
