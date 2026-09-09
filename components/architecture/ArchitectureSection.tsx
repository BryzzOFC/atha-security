"use client";

import dynamic from "next/dynamic";
import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";

const AgentScene = dynamic(() => import("@/components/3d/AgentScene/AgentScene"), {
  ssr: false,
});

export default function ArchitectureSection() {
  const { ref, inView } = useInView<HTMLDivElement>("200px");
  const reduced = useReducedMotion();
  const c = useCopy();
  const frameloop: "always" | "demand" | "never" = inView
    ? reduced
      ? "demand"
      : "always"
    : "never";

  return (
    <section id="technology" className="relative scroll-mt-20 py-28 md:py-36" aria-labelledby="technology-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="01" label={c.arch.tag} />
          <h2
            id="technology-heading"
            className="mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.arch.h2a}{" "}
            <span className="text-foreground/50">{c.arch.h2b}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/60">
            {c.arch.p}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <div
            ref={ref}
            className="glass-panel relative h-[480px] overflow-hidden rounded-2xl md:h-[600px]"
            role="img"
            aria-label={c.arch.sceneAria}
          >
            <AgentScene frameloop={frameloop} nodes={c.arch.nodes} />

            {/* HUD corners */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-5 top-5 h-5 w-5 border-l border-t border-foreground/20" />
              <div className="absolute right-5 top-5 h-5 w-5 border-r border-t border-foreground/20" />
              <div className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-foreground/20" />
              <div className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-foreground/20" />
              <span className="kicker absolute left-8 top-6 text-[9px] text-foreground/35">
                {c.arch.hud1}
              </span>
              <span className="kicker absolute bottom-6 right-8 text-[9px] text-foreground/35">
                {c.arch.hud2}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label={c.arch.chipsAria}>
            {c.arch.nodes.map((node, i) => (
              <span
                key={node}
                className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-foreground/55"
              >
                <span className={i % 2 === 0 ? "text-brand-blue" : "text-brand-orange"}>
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {node}
              </span>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-foreground/40">
            {c.arch.foot}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
