"use client";

import { BrandMark } from "@/components/BrandMark";
import { useCopy } from "@/lib/i18n";

export default function Footer() {
  const c = useCopy();

  return (
    <footer className="mt-auto border-t border-foreground/[0.06] bg-background" aria-label="Footer">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-6 w-6" />
              <span className="kicker text-[12px] text-foreground">ATHA SECURITY</span>
            </div>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-foreground/45">
              {c.footer.blurb}
            </p>
            <p className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-foreground/30">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
              {c.footer.devStatus}
            </p>
          </div>

          <nav aria-label={c.footer.navigate}>
            <p className="kicker text-[9px] text-foreground/35">{c.footer.navigate}</p>
            <ul className="mt-5 space-y-3">
              {c.footer.productLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-foreground/55 transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company links">
            <p className="kicker text-[9px] text-foreground/35">{c.footer.company}</p>
            <ul className="mt-5 space-y-3">
              {c.footer.companyLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-foreground/55 transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <span
                  aria-disabled="true"
                  title={c.footer.atLaunch}
                  className="cursor-not-allowed text-sm text-foreground/25"
                >
                  {c.footer.privacy}
                </span>
              </li>
              <li>
                <span
                  aria-disabled="true"
                  title={c.footer.atLaunch}
                  className="cursor-not-allowed text-sm text-foreground/25"
                >
                  {c.footer.terms}
                </span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-foreground/[0.05] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-foreground/30">
            © {new Date().getFullYear()} {c.footer.rights}
          </p>
          <p className="text-[12px] text-foreground/30">{c.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
