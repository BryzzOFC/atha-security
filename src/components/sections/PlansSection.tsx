"use client";

import { useState } from "react";
import { Reveal, SectionTag } from "@/components/ui/reveal";
import { useCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import plansJson from "../../../public/atha/plans.json";

// The catalog is baked by the ATHA engine itself (atha_cli.py plan_bake) —
// the site renders the same file the license system enforces.
type Currency = "EUR" | "USD" | "BRL";
type PlanDoc = {
  id: "basic" | "essencial" | "full";
  order: number;
  sites: number;
  price: Record<Currency, { monthly: number; annual: number }>;
  features: string[];
};
type PlansDoc = {
  schema: string;
  version: string;
  currency_order: Currency[];
  feature_order: string[];
  plans: PlanDoc[];
};

const plans = plansJson as unknown as PlansDoc;

const SYMBOL: Record<Currency, string> = { EUR: "€", USD: "$", BRL: "R$" };
const PLAN_NAME: Record<PlanDoc["id"], string> = {
  basic: "ATHA Basic",
  essencial: "ATHA Essencial",
  full: "ATHA Full",
};

// WhatsApp direto — interesse em preços/compra vai reto pro dono.
const WA_NUMBER = "351963024931";
function waLink(msg: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Check({ highlight }: { highlight?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "mt-0.5 h-3.5 w-3.5 shrink-0",
        highlight ? "text-brand-orange" : "text-foreground/40",
      )}
    >
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlansSection() {
  const c = useCopy();
  const [currency, setCurrency] = useState<Currency>("EUR");

  const planById = (id: PlanDoc["id"]) =>
    plans.plans.find((p) => p.id === id) as PlanDoc;

  const deltaFeatures = (id: PlanDoc["id"]) => {
    const prevId: Record<PlanDoc["id"], PlanDoc["id"] | null> = {
      basic: null,
      essencial: "basic",
      full: "essencial",
    };
    const plan = planById(id);
    const prev = prevId[id] ? planById(prevId[id] as PlanDoc["id"]) : null;
    if (!prev) return plan.features;
    return plan.features.filter((f) => !prev.features.includes(f));
  };

  return (
    <section
      id="plans"
      aria-label={c.plans.aria}
      className="relative scroll-mt-20 border-t border-foreground/[0.05] py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionTag index="10" label={c.plans.tag} />
          <h2
            className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {c.plans.h2a} <span className="text-foreground/50">{c.plans.h2b}</span>
          </h2>
          <p className="mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/60">
            {c.plans.p}
          </p>
        </Reveal>

        {/* currency toggle — Euro por padrao, troca com um toque */}
        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/40">
              {c.plans.currencyLabel}
            </span>
            <div
              role="group"
              aria-label={c.plans.currencyLabel}
              className="flex overflow-hidden rounded-lg border border-foreground/10"
            >
              {plans.currency_order.map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  aria-pressed={currency === cur}
                  className={cn(
                    "px-4 py-2 text-xs font-medium tracking-wide transition-colors",
                    currency === cur
                      ? "bg-brand-orange/15 text-brand-orange"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  <span className="font-mono">{SYMBOL[cur]}</span> {c.plans.currencyNames[cur]}
                </button>
              ))}
            </div>
            <span className="text-xs text-foreground/35">{c.plans.currencyHint}</span>
          </div>
        </Reveal>

        {/* cards */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {(["basic", "essencial", "full"] as const).map((id, i) => {
            const plan = planById(id);
            const isFull = id === "full";
            const prevId = i > 0 ? (["basic", "essencial", "full"] as const)[i - 1] : null;
            const sym = SYMBOL[currency];
            const monthly = plan.price[currency].monthly;
            const annual = plan.price[currency].annual;
            return (
              <Reveal key={id} delay={0.08 * i} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-xl p-7 transition-all duration-300",
                    isFull
                      ? "border border-brand-orange/40 bg-gradient-to-b from-brand-orange/[0.07] to-transparent shadow-[0_0_60px_-20px] shadow-brand-orange/30 lg:-translate-y-2"
                      : "hairline bg-foreground/[0.015] hover:border-foreground/20",
                  )}
                >
                  {isFull && (
                    <span className="absolute -top-3 left-6 rounded-full bg-brand-orange px-3 py-1 font-mono text-[10px] font-medium tracking-[0.15em] text-black">
                      {c.plans.mostComplete}
                    </span>
                  )}

                  <h3 className="font-mono text-sm tracking-[0.18em] text-foreground">
                    {PLAN_NAME[id]}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground/65">
                    {c.plans.simple[id]}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="num-tabular text-4xl font-semibold text-foreground">
                      {sym}
                      {isFull ? annual : monthly}
                    </span>
                    <span className="text-sm text-foreground/45">
                      {isFull ? c.plans.perYear : c.plans.perMonth}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-foreground/40">
                    {isFull
                      ? `${c.plans.annualOf} ${sym}${monthly} ${c.plans.perMonth} — ${c.plans.monthlyNoCommit}`
                      : `${c.plans.annualOf} ${sym}${annual} ${c.plans.perYear}`}
                  </p>

                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
                    {plan.sites} {plan.sites === 1 ? "site" : "sites"}{" "}
                    {c.plans.sitesLabel}
                  </p>

                  {/* honest advantage / limitation — per plan */}
                  <div className="mt-5 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-orange/80">
                      {c.plans.bestLabel}
                    </p>
                    <p className="mt-1.5 flex items-start gap-2 text-[12px] leading-relaxed text-foreground/70">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange">
                        <path d="M8 1.5L10 6h4l-3.2 2.8 1.2 4.2L8 10.5 4 13l1.2-4.2L2 6h4l2-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                      </svg>
                      <span>{c.plans.tiers[id].best}</span>
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/35">
                      {c.plans.limitLabel}
                    </p>
                    <p className="mt-1.5 flex items-start gap-2 text-[12px] leading-relaxed text-foreground/40">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/35">
                        <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      <span>{c.plans.tiers[id].limit}</span>
                    </p>
                  </div>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {prevId && (
                      <li className="pb-1 text-[13px] font-medium text-foreground/70">
                        {c.plans.essentials} {PLAN_NAME[prevId]} {c.plans.plus}
                      </li>
                    )}
                    {deltaFeatures(id).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/60">
                        <Check highlight={isFull} />
                        <span>
                          {c.plans.features[f as keyof typeof c.plans.features]}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waLink(
                      c.plans.waPlanMsg
                        .replace("{plan}", PLAN_NAME[id])
                        .replace("{price}", isFull
                          ? `${sym}${annual}${c.plans.perYear}`
                          : `${sym}${monthly}${c.plans.perMonth}`),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#1fbf59]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {c.plans.cta[id]}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* duvida nos precos / comprar -> WhatsApp direto */}
        <Reveal delay={0.12}>
          <div className="mt-14 rounded-xl border border-[#25D366]/25 bg-[#25D366]/[0.05] p-8 text-center md:p-10">
            <WhatsAppIcon className="mx-auto h-9 w-9 text-[#25D366]" />
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {c.plans.waHelpTitle}
            </h3>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-foreground/60">
              {c.plans.waHelpText}
            </p>
            <a
              href={waLink(c.plans.waGenericMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-lg bg-[#25D366] px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-[#1fbf59]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {c.plans.waHelpBtn}
            </a>
            <p className="mt-3.5 font-mono text-[11px] tracking-[0.14em] text-foreground/40">
              {c.plans.waHelpNote}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-10 text-center text-xs leading-relaxed text-foreground/35">
            {c.plans.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
