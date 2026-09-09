"use client";

import { Bug, SlidersHorizontal, AlertTriangle, Siren, Radar, ClipboardCheck } from "lucide-react";
import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";

const ICONS = {
  bug: Bug,
  settings: SlidersHorizontal,
  alert: AlertTriangle,
  siren: Siren,
  radar: Radar,
  clipboard: ClipboardCheck,
} as const;

/** Icon per risk, same order as `copy.problem.risks`. */
const RISK_ICONS = ["bug", "settings", "alert", "siren", "radar", "clipboard"] as const;

export default function ProblemSection() {
  const c = useCopy();

  return (
    <section id="about" className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="problem-heading">
      <div className="grid-bg grid-fade pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="00" label={c.problem.tag} />
          <h2
            id="problem-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.problem.h2a}
            <br />
            <span className="text-foreground/50">{c.problem.h2b}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <div className="space-y-5 text-pretty leading-relaxed text-foreground/60">
              <p>{c.problem.p1}</p>
              <p>{c.problem.p2}</p>
            </div>
            <div className="mt-10 border-l-2 border-brand-orange/70 pl-6">
              <p className="text-pretty text-lg font-medium leading-relaxed text-foreground md:text-xl">
                {c.problem.quote}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {c.problem.risks.map((risk, i) => {
              const Icon = ICONS[RISK_ICONS[i]];
              return (
                <Reveal key={i} delay={0.08 * i}>
                  <div className="group hairline h-full rounded-xl bg-foreground/[0.015] p-5 transition-colors duration-300 hover:border-foreground/[0.16] hover:bg-foreground/[0.03]">
                    <Icon
                      className="h-5 w-5 text-foreground/40 transition-colors duration-300 group-hover:text-brand-blue"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 text-sm font-medium text-foreground">{risk.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground/45">{risk.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
