"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCopy } from "@/lib/i18n";

/** Structural demo-event data (language-independent); messages come from the copy. */
const DEMO_EVENTS = [
  { time: "14:32:07", agent: "SCANNER", level: "INFO" },
  { time: "14:33:41", agent: "SCANNER", level: "FLAG" },
  { time: "14:34:12", agent: "DETECTIVE", level: "INFO" },
  { time: "14:36:58", agent: "GUARDIAN", level: "ACTION" },
  { time: "14:38:20", agent: "VALIDATOR", level: "INFO" },
  { time: "14:41:03", agent: "AUDITOR", level: "INFO" },
] as const;

const LEVEL_STYLE: Record<string, string> = {
  INFO: "border-brand-blue/30 text-brand-blue/90",
  FLAG: "border-brand-orange/40 text-brand-orange",
  ACTION: "border-brand-orange/60 bg-brand-orange/10 text-brand-orange",
};

function Kpi({
  label,
  value,
  tone = "white",
  dot,
}: {
  label: string;
  value: string;
  tone?: "white" | "blue" | "green";
  dot?: "green" | "blue";
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-3.5 py-3">
      <p className="kicker text-[8px] text-white/35">{label}</p>
      <p
        className={cn(
          "num-tabular mt-1.5 flex items-center gap-2 font-mono text-[13px] tracking-[0.14em]",
          tone === "green" && "text-green-400",
          tone === "blue" && "text-brand-blue",
          tone === "white" && "text-white"
        )}
      >
        {dot === "green" && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" />}
        {dot === "blue" && <span className="pulse-dot-blue h-1.5 w-1.5 rounded-full bg-brand-blue" />}
        {value}
      </p>
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 180 40" className="mt-4 h-10 w-full" aria-hidden="true">
      <path
        d="M0 30 L18 26 L36 28 L54 18 L72 22 L90 12 L108 16 L126 8 L144 14 L162 6 L180 10"
        fill="none"
        stroke="rgba(77,159,255,0.65)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="flow-dash"
      />
      <path
        d="M0 34 L180 34"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** ATHA console mockup — honest demo state, interactive agent details. */
export default function DashboardMock() {
  const [selected, setSelected] = useState(0);
  const c = useCopy();
  const agents = c.agents.items;
  const agent = agents[selected];

  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-[32px] bg-brand-blue/[0.07] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080b11] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.015] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 font-mono text-[11px] tracking-[0.2em] text-white/50">
            ATHA SECURITY — CONSOLE
          </span>
          <span className="ml-auto rounded border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-amber-300/90">
            {c.dash.demoState}
          </span>
        </div>

        <div className="grid lg:grid-cols-[215px_1fr]">
          {/* agents sidebar */}
          <aside className="border-b border-white/[0.06] p-3 lg:border-b-0 lg:border-r" aria-label="Agent list">
            <p className="kicker px-2 pb-2 text-[9px] text-white/30">{c.dash.coreAgents}</p>
            <div>
              {agents.map((a, i) => (
                <button
                  key={a.name}
                  type="button"
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-left transition-all duration-200",
                    selected === i
                      ? "border-l-brand-blue bg-white/[0.05]"
                      : "border-l-transparent hover:bg-white/[0.03]"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      a.status === "ACTIVE" && "bg-green-400 pulse-dot",
                      a.status === "READY" && "bg-brand-blue pulse-dot-blue",
                      a.status === "STANDBY" && "bg-white/30"
                    )}
                  />
                  <span className="font-mono text-[11px] tracking-[0.14em] text-white/80">
                    {a.name}
                  </span>
                  <span className="ml-auto hidden font-mono text-[9px] text-white/30 sm:block">
                    {a.role.slice(0, 4)}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2 border-t border-white/[0.06] px-2.5 pt-3">
              <p className="font-mono text-[10px] text-white/35">
                {c.dash.registered}{" "}
                <span className="num-tabular text-white/70">71</span>
              </p>
            </div>
          </aside>

          {/* main */}
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              <Kpi label={c.dash.kpis.systemStatus} value={c.dash.kpis.online} tone="green" dot="green" />
              <Kpi label={c.dash.kpis.agents} value={c.dash.kpis.agentsValue} tone="blue" />
              <Kpi label={c.dash.kpis.events} value={c.dash.kpis.active} dot="blue" />
              <Kpi label={c.dash.kpis.threats} value={c.dash.kpis.monitored} />
              <Kpi label={c.dash.kpis.integrity} value={c.dash.kpis.verified} tone="green" />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_240px]">
              {/* event stream */}
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.01]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                  <span className="kicker text-[9px] text-white/35">{c.dash.stream}</span>
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
                </div>
                <ul className="divide-y divide-white/[0.04]">
                  {DEMO_EVENTS.map((e, i) => (
                    <li key={e.time} className="flex items-start gap-3 px-4 py-2.5 text-[12px]">
                      <span className="num-tabular shrink-0 font-mono text-[10px] text-white/30">
                        {e.time}
                      </span>
                      <span className="shrink-0 rounded border border-white/10 px-1.5 py-px font-mono text-[9px] tracking-[0.1em] text-white/55">
                        {e.agent}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded border px-1.5 py-px font-mono text-[9px] tracking-[0.1em]",
                          LEVEL_STYLE[e.level]
                        )}
                      >
                        {e.level}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-white/60">{c.dash.events[i]}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/[0.04] px-4 py-2">
                  <span className="blink-caret font-mono text-[11px] text-brand-blue/80">▍</span>
                  <span className="ml-1 font-mono text-[10px] text-white/30">
                    {c.dash.listening}
                  </span>
                </div>
              </div>

              {/* selected agent detail */}
              <AnimatePresence mode="wait">
                <motion.aside
                  key={agent.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                  aria-live="polite"
                >
                  <p className="kicker text-[8px] text-white/30">{c.dash.agent}</p>
                  <p className="mt-1.5 font-mono text-lg tracking-[0.12em] text-white">
                    {agent.name}
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="kicker text-[8px] text-white/30">{c.dash.status}</dt>
                      <dd className="mt-1 flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            agent.status === "ACTIVE" && "bg-green-400 pulse-dot",
                            agent.status === "READY" && "bg-brand-blue pulse-dot-blue",
                            agent.status === "STANDBY" && "bg-white/30"
                          )}
                        />
                        <span className="font-mono text-[11px] tracking-[0.14em] text-white/80">
                          {c.agents.status[agent.status]}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="kicker text-[8px] text-white/30">{c.dash.role}</dt>
                      <dd className="mt-1 font-mono text-[11px] tracking-[0.14em] text-brand-blue">
                        {agent.role}
                      </dd>
                    </div>
                  </dl>
                  <Sparkline />
                  <p className="mt-1 font-mono text-[9px] tracking-[0.14em] text-white/25">
                    {c.dash.taskLoad}
                  </p>
                </motion.aside>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-[12px] leading-relaxed text-white/35">
        {c.dash.disclaimer}
      </p>
    </div>
  );
}
