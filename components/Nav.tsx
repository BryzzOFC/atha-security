"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import ThemeToggle from "@/components/ThemeToggle";
import { useLang } from "@/lib/lang";
import { useCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Visible EN | PT-BR switch — drives the shared lang store (chat,
 *  keynote captions). High-contrast active state so it reads at a glance. */
function LangToggle({ compact = false }: { compact?: boolean }) {
  const [lang, setLang] = useLang();
  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className="flex shrink-0 items-center rounded-full border border-foreground/15 bg-foreground/[0.05] p-[3px]"
    >
      {(["en", "pt"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-full font-semibold tracking-[0.06em] transition-all duration-200",
            compact ? "px-2.5 py-[5px] text-[10px]" : "px-3 py-[6px] text-[11px]",
            lang === l
              ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(255,255,255,0.28)]"
              : "text-foreground/55 hover:text-foreground"
          )}
        >
          {l === "en" ? "EN" : "PT-BR"}
        </button>
      ))}
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang] = useLang();
  const c = useCopy();

  // keep <html lang> in sync with the chosen UI language
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-foreground/[0.06] bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="ATHA Security — back to top"
        >
          <BrandMark className="h-6 w-6" />
          <span className="kicker text-[12px] text-foreground">ATHA SECURITY</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {c.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-foreground/55 transition-colors duration-200 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <LangToggle />
          <ThemeToggle />
          <a
            href="#contact"
            className="inline-flex h-9 items-center rounded-lg border border-foreground/15 px-4 text-[13px] font-medium text-foreground transition-all duration-300 hover:border-brand-blue/60 hover:shadow-[0_0_20px_rgba(77,159,255,0.25)]"
          >
            {c.nav.talk}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle compact />
          <LangToggle compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.nav.closeMenu : c.nav.openMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground/80 hover:bg-foreground/5"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-foreground/[0.06] bg-background/95 px-6 pb-6 pt-2 backdrop-blur-xl md:hidden"
        >
          {c.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-foreground/[0.04] py-3.5 text-sm text-foreground/70 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
          >
            {c.nav.talk}
          </a>
        </nav>
      )}
    </header>
  );
}
