"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/**
 * Light / dark theme switch — flips the `.dark` class on <html> through
 * the shared theme store and persists the choice. Colors crossfade via
 * the one-shot `theme-anim` class applied by the store.
 */
export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={
        compact
          ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground"
          : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-foreground/12 text-foreground/60 transition-all duration-200 hover:border-foreground/25 hover:text-foreground"
      }
    >
      <Sun
        className={
          dark ? "h-[18px] w-[18px]" : "hidden h-[18px] w-[18px]"
        }
        aria-hidden="true"
      />
      <Moon
        className={dark ? "hidden h-[18px] w-[18px]" : "h-[18px] w-[18px]"}
        aria-hidden="true"
      />
    </button>
  );
}
