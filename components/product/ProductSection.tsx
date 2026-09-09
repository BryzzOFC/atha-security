"use client";

import { Reveal, SectionTag } from "@/components/ui/reveal";
import DashboardMock from "@/components/product/DashboardMock";
import { useCopy } from "@/lib/i18n";

export default function ProductSection() {
  const c = useCopy();

  return (
    <section id="product" className="relative scroll-mt-20 overflow-hidden border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="product-heading">
      <div className="grid-bg grid-fade pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="text-center [&>div]:justify-center">
          <SectionTag index="08" label={c.product.tag} />
          <h2
            id="product-heading"
            className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.product.h2a}{" "}
            <span className="text-foreground/50">{c.product.h2b}</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/60">
            {c.product.p}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-16">
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  );
}
