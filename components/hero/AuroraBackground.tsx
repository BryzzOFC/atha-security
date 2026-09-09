import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Aurora mesh — the hero stage background, Lovable-style: four huge,
 * soft brand-color blobs (blue / cyan / violet / orange) drifting slowly
 * over the theme canvas. Light theme shows the vivid pastel mesh on a
 * clean white; dark theme shows the same mesh glowing over deep ink —
 * never plain black. Colors and strengths live in globals.css as
 * `--aur-*` tokens so both themes share one component.
 *
 * Motion is compositor-only (transform) and disabled under
 * prefers-reduced-motion (static mesh remains).
 */
export default function AuroraBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="aurora" aria-hidden="true">
      <div
        className="aurora-blob aurora-b1"
        style={reduced ? { animation: "none" } : undefined}
      />
      <div
        className="aurora-blob aurora-b2"
        style={reduced ? { animation: "none" } : undefined}
      />
      <div
        className="aurora-blob aurora-b3"
        style={reduced ? { animation: "none" } : undefined}
      />
      <div
        className="aurora-blob aurora-b4"
        style={reduced ? { animation: "none" } : undefined}
      />
      {/* quiet center so the keynote copy + phone stay legible */}
      <div className="aurora-clear" />
    </div>
  );
}
