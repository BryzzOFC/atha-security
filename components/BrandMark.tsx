import { cn } from "@/lib/utils";

/** ATHA brand mark — a geometric "A" shield. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7"
        style={{ stroke: "var(--mark-line)", fill: "var(--mark-fill)" }}
        strokeWidth="1.5"
      />
      <path
        d="M16 7.5 L23.5 24 M16 7.5 L8.5 24 M11.4 18.4 H20.6"
        style={{ stroke: "url(#atha-mark-grad)" }}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14.6" r="1.7" fill="#ff8a2b" />
      <defs>
        <linearGradient id="atha-mark-grad" x1="8" y1="7" x2="24" y2="24">
          <stop style={{ stopColor: "var(--mark-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-2)" }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
