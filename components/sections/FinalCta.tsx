"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";
import { useCopy } from "@/lib/i18n";

const CoreScene = dynamic(() => import("@/components/3d/CoreScene/CoreScene"), {
  ssr: false,
});

type FormState = "idle" | "sending" | "sent" | "error";

// Static hosting (GitHub Pages) has no server — the form degrades to a
// mailto: handoff instead of POSTing to /api/contact.
const STATIC_HOST = process.env.NEXT_PUBLIC_STATIC === "1";
const CONTACT_EMAIL = "contact@athasecurity.app";

function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const c = useCopy();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (STATIC_HOST) {
      const subject = encodeURIComponent(`ATHA Security — ${data.get("name")}`);
      const body = encodeURIComponent(
        `${data.get("message")}\n\n— ${data.get("name")} <${data.get("email")}>`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setState("sending");
    setError("");
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        company: data.get("company"), // honeypot
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? c.final.genericError);
        }
        setState("sent");
        form.reset();
      })
      .catch((err: unknown) => {
        setState("error");
        setError(err instanceof Error ? err.message : c.final.genericError);
      });
  }

  if (state === "sent") {
    return (
      <div className="glass-panel rounded-2xl px-8 py-14 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-green-400" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="mt-5 text-xl font-medium text-foreground">{c.final.sentH}</h3>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed text-foreground/55">
          {c.final.sentP}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-2xl p-7 md:p-9" aria-label={c.final.formAria}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="kicker block text-[9px] text-foreground/40">
            {c.final.name}
          </label>
          <input
            id="cf-name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder={c.final.namePlaceholder}
            className="mt-2.5 h-11 w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3.5 text-sm text-foreground placeholder:text-foreground/25 focus:border-brand-blue/60 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="kicker block text-[9px] text-foreground/40">
            {c.final.email}
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={c.final.emailPlaceholder}
            className="mt-2.5 h-11 w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3.5 text-sm text-foreground placeholder:text-foreground/25 focus:border-brand-blue/60 focus:outline-none"
          />
        </div>
      </div>

      {/* honeypot — hidden from humans */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div className="mt-5">
        <label htmlFor="cf-message" className="kicker block text-[9px] text-foreground/40">
          {c.final.message}
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder={c.final.messagePlaceholder}
          className="mt-2.5 w-full resize-none rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3.5 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-brand-blue/60 focus:outline-none"
        />
      </div>

      {state === "error" && (
        <p role="alert" className="mt-4 text-[13px] text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {c.final.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            {c.final.send}
          </>
        )}
      </button>

      {STATIC_HOST && (
        <p className="mt-4 max-w-md text-[12px] leading-relaxed text-foreground/45">
          {c.final.staticNote}
        </p>
      )}
    </form>
  );
}

export default function FinalCta() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useScrollProgress(trackRef);
  const reduced = useReducedMotion();
  const c = useCopy();
  const { ref: sceneRef, inView } = useInView<HTMLDivElement>("200px");

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const line1Opacity = useTransform(scrollYProgress, [0.04, 0.16, 0.3, 0.4], [0, 1, 1, 0]);
  const line1Y = useTransform(scrollYProgress, [0.04, 0.4], [30, -30]);
  const line2Opacity = useTransform(scrollYProgress, [0.42, 0.54, 0.66, 0.76], [0, 1, 1, 0]);
  const line2Y = useTransform(scrollYProgress, [0.42, 0.76], [30, -30]);
  const finalOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.78, 0.98], [40, 0]);
  const frameloop: "always" | "demand" | "never" = inView
    ? reduced
      ? "demand"
      : "always"
    : "never";
  const staticP = reduced ? 0.85 : null;

  return (
    <section id="contact" className="relative scroll-mt-20" aria-labelledby="final-heading">
      {/* scroll-driven core experience */}
      <div ref={trackRef} className="relative h-[280vh]">
        <div ref={sceneRef} className="sticky top-0 h-svh overflow-hidden">
          <CoreScene progressRef={progressRef} staticP={staticP} frameloop={frameloop} />
          <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-40" />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.p
              style={{ opacity: line1Opacity, y: line1Y }}
              className="pointer-events-none absolute max-w-3xl text-center text-balance text-2xl font-medium tracking-tight text-foreground/85 md:text-4xl"
            >
              {c.final.line1}
            </motion.p>
            <motion.p
              style={{ opacity: line2Opacity, y: line2Y }}
              className="pointer-events-none absolute max-w-3xl text-center text-balance text-2xl font-medium tracking-tight text-foreground/85 md:text-4xl"
            >
              {c.final.line2}
            </motion.p>

            <motion.div
              style={{ opacity: finalOpacity, y: finalY }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <BrandMark className="h-7 w-7" />
                <span className="kicker text-foreground">ATHA SECURITY</span>
              </div>
              <h2
                id="final-heading"
                className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
              >
                {c.final.h2}
              </h2>
              <a
                href="#contact-form"
                className="mt-9 inline-flex h-12 min-w-[190px] items-center justify-center rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_36px_rgba(255,255,255,0.3)]"
              >
                {c.final.cta}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* contact form */}
      <div id="contact-form" className="relative scroll-mt-24 border-t border-foreground/[0.05] py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <div className="text-center">
            <p className="kicker text-brand-orange">{c.final.formTag}</p>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground">
              {c.final.formH2}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-foreground/55">
              {c.final.formP}
            </p>
          </div>
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
