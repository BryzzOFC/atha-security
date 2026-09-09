"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";

export default function FAQSection() {
  const c = useCopy();

  return (
    <section id="faq" className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="11" label={c.faq.tag} />
          <h2
            id="faq-heading"
            className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.faq.h2a} <span className="text-foreground/50">{c.faq.h2b}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-12">
            {c.faq.items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-foreground/[0.07]">
                <AccordionTrigger className="py-5 text-left text-[15px] font-medium text-foreground/85 hover:text-foreground hover:no-underline [&[data-state=open]>svg]:text-brand-blue">
                  <span className="flex items-baseline gap-4">
                    <span className="num-tabular font-mono text-[11px] text-foreground/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-9 text-[14px] leading-relaxed text-foreground/55">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
