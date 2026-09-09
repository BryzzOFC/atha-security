"use client";

import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";

export default function TrustSection() {
  const c = useCopy();

  return (
    <section id="security" className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="07" label={c.trust.tag} />
          <h2
            id="trust-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.trust.h2a}{" "}
            <span className="text-foreground/50">{c.trust.h2b}</span>
          </h2>
        </Reveal>

        <dl className="mt-14 border-t border-foreground/[0.07]">
          {c.trust.principles.map((p, i) => (
            <Reveal key={i} delay={0.04 * i}>
              <div className="group grid gap-2 border-b border-foreground/[0.07] py-6 transition-colors duration-300 md:grid-cols-[280px_1fr] md:items-baseline md:gap-8">
                <dt>
                  <span className="num-tabular mr-3 font-mono text-[10px] text-foreground/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[13px] tracking-[0.2em] text-foreground transition-colors duration-300 group-hover:text-brand-blue">
                    {p.title}
                  </span>
                </dt>
                <dd className="text-pretty text-[15px] leading-relaxed text-foreground/55">{p.text}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-pretty text-[13px] leading-relaxed text-foreground/35">
            {c.trust.foot}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
