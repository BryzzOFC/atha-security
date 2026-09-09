"use client";

import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-green-400 pulse-dot",
  READY: "bg-brand-blue pulse-dot-blue",
  STANDBY: "bg-foreground/30",
};

export default function AgentsSection() {
  const c = useCopy();

  return (
    <section id="agents" className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36" aria-labelledby="agents-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="02" label={c.agents.tag} />
          <h2
            id="agents-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.agents.h2a}{" "}
            <span className="text-foreground/50">{c.agents.h2b}</span>
          </h2>
          <p className="mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/60">
            {c.agents.p}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.agents.items.map((agent, i) => (
            <Reveal key={agent.name} delay={0.05 * (i % 4)}>
              <article className="group hairline relative h-full overflow-hidden rounded-xl bg-foreground/[0.015] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/35 hover:bg-foreground/[0.03] hover:shadow-[0_12px_40px_-16px_rgba(77,159,255,0.35)]">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-blue/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[13px] font-medium tracking-[0.18em] text-foreground">
                    {agent.name}
                  </h3>
                  <span className="flex items-center gap-1.5" aria-label={`${c.agents.statusAria}: ${c.agents.status[agent.status]}`}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_STYLE[agent.status])} />
                    <span className="font-mono text-[9px] tracking-[0.14em] text-foreground/40">
                      {c.agents.status[agent.status]}
                    </span>
                  </span>
                </div>
                <p className="mt-3 font-mono text-[10px] tracking-[0.22em] text-brand-blue/80">
                  {agent.role}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-foreground/55">
                  {agent.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-[13px] leading-relaxed text-foreground/35">
            {c.agents.foot}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
