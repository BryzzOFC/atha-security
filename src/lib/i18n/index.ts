/**
 * Full-site i18n (EN / PT-BR) — built on top of the shared lang store
 * (src/lib/lang.ts). Components call `useCopy()` and read strings from
 * it; switching the language in the header (or in the phone chat)
 * re-renders every mounted consumer at once.
 *
 * Shape safety: `pt` is typed as `Copy` (typeof en), so any missing key
 * or mismatched list length between the two languages fails `tsc`.
 */

import { useLang } from "@/lib/lang";
import { en, type Copy } from "./en";
import { pt } from "./pt";

export type { Copy };

export const COPY: Record<"en" | "pt", Copy> = { en, pt };

/** The translated copy for the active language (reactive). */
export function useCopy(): Copy {
  const [lang] = useLang();
  return COPY[lang];
}
