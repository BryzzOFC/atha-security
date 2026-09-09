import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";

/**
 * iPhone 18 Pro Max — pure CSS/DOM device mockup, now a REAL 3D object:
 * a front face (titanium rim, screen, Dynamic Island) and a matching
 * BACK face (glass back, pro camera island, ATHA mark) so the entrance
 * spin shows the device from behind. Both faces carry
 * backface-visibility:hidden inside a preserve-3d wrapper — only one is
 * ever visible, exactly like a physical phone mid-flip.
 * The screen content is passed as children so the scene can stack the
 * chat, the boot overlay and the specular sweep inside it.
 */

const RIM_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(150deg,#787d88 0%,#2a2d34 16%,#101216 42%,#1d2026 62%,#43464e 84%,#8a8f9a 100%)",
  boxShadow:
    "0 48px 140px -24px rgba(0,0,0,0.92), 0 0 90px rgba(77,159,255,0.10), 0 0 140px rgba(255,138,43,0.08), inset 0 0 2px rgba(255,255,255,0.28)",
};

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        width: "min(340px, 76vw, 41vh)",
        aspectRatio: "9 / 19.2",
        // the root itself carries the 3D context — any intermediate
        // element with the default `flat` would flatten the faces and
        // break backface culling during the spin
        transformStyle: "preserve-3d",
      }}
    >
      {/* ————— FRONT face ————— */}
        <div
          className="relative h-full w-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* side buttons — left edge (action + volumes) */}
          <SideButton className="-left-[2.5px] top-[104px] h-[26px]" />
          <SideButton className="-left-[2.5px] top-[152px] h-[46px]" />
          <SideButton className="-left-[2.5px] top-[208px] h-[46px]" />
          {/* power — right edge */}
          <SideButton className="-right-[2.5px] top-[176px] h-[72px]" />

          {/* titanium rim */}
          <div
            className="h-full w-full rounded-[58px] p-[3px]"
            style={RIM_STYLE}
          >
            {/* black bezel */}
            <div className="h-full w-full rounded-[55px] bg-black p-[9px]">
              {/* screen */}
              <div className="relative h-full w-full overflow-hidden rounded-[46px] bg-black">
                {/* content (chat / boot / sweep) */}
                <div className="absolute inset-0">{children}</div>

                {/* status bar */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[26px] pt-[15px] text-white">
                  <span className="text-[13px] font-semibold tracking-wide">9:41</span>
                  <StatusIcons />
                </div>

                {/* dynamic island */}
                <div
                  className="pointer-events-none absolute left-1/2 top-[11px] z-30 flex h-[26px] w-[88px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[9px]"
                  style={{ boxShadow: "inset 0 0 2px rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-[9px] w-[9px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 35%, #24314a 0%, #0a0d14 62%)",
                    }}
                  />
                </div>

                {/* glass reflection */}
                <div
                  className="pointer-events-none absolute inset-0 z-40 rounded-[46px]"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.02) 16%, transparent 36%, transparent 70%, rgba(255,255,255,0.05) 100%)",
                  }}
                />

                {/* home indicator */}
                <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-40 h-[4px] w-[104px] -translate-x-1/2 rounded-full bg-white/85" />
              </div>
            </div>
          </div>
        </div>

        {/* ————— BACK face (mirrored plane — DOM-left reads viewer-left) ————— */}
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* power lands viewer-left from the back; volumes viewer-right */}
          <SideButton className="-left-[2.5px] top-[176px] h-[72px]" />
          <SideButton className="-right-[2.5px] top-[104px] h-[26px]" />
          <SideButton className="-right-[2.5px] top-[152px] h-[46px]" />
          <SideButton className="-right-[2.5px] top-[208px] h-[46px]" />

          {/* titanium rim */}
          <div
            className="h-full w-full rounded-[58px] p-[3px]"
            style={RIM_STYLE}
          >
            {/* glass back */}
            <div
              className="relative h-full w-full overflow-hidden rounded-[55px]"
              style={{
                background:
                  "linear-gradient(148deg,#33383f 0%,#1c1f26 22%,#101319 46%,#0b0e13 72%,#181b22 100%)",
              }}
            >
              {/* soft top-light sheen */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 34% at 50% -4%, rgba(255,255,255,0.10) 0%, transparent 62%), linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 74%, rgba(255,255,255,0.035) 100%)",
                }}
              />

              {/* pro camera island */}
              <div
                className="absolute left-[18px] top-[18px] h-[112px] w-[112px] rounded-[34px]"
                style={{
                  background:
                    "linear-gradient(145deg,#2b2f38 0%,#14171d 55%,#0c0f14 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.16), inset 0 -1px 1px rgba(0,0,0,0.6), 0 10px 26px rgba(0,0,0,0.55)",
                }}
              >
                <Lens className="left-[11px] top-[11px]" />
                <Lens className="left-[11px] top-[63px]" />
                <Lens className="right-[11px] top-[37px]" />
                {/* flash + lidar */}
                <div
                  className="absolute right-[22px] top-[16px] h-[10px] w-[10px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, #fff7e0 0%, #c9b98a 45%, #55503c 100%)",
                    boxShadow: "inset 0 0 2px rgba(0,0,0,0.5)",
                  }}
                />
                <div
                  className="absolute bottom-[13px] right-[19px] h-[13px] w-[13px] rounded-full bg-black/70"
                  style={{ boxShadow: "inset 0 0 3px rgba(90,120,200,0.35)" }}
                />
              </div>

              {/* centered brand */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <BrandMark className="h-14 w-14 opacity-90" />
                <div className="mt-3 text-[9px] font-medium uppercase tracking-[0.42em] text-white/30">
                  ATHA SECURITY
                </div>
              </div>

              {/* bottom regulatory line, like an engraving */}
              <div className="absolute inset-x-0 bottom-[26px] text-center text-[7px] uppercase tracking-[0.3em] text-white/12">
                Designed by ATHA
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

function SideButton({ className }: { className: string }) {
  return (
    <div
      className={`absolute w-[3px] rounded-[2px] ${className ?? ""}`}
      style={{
        background: "linear-gradient(90deg,#3a3d45,#191b20)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.18)",
      }}
    />
  );
}

/** Camera lens — stacked glass rings with a faint coating glint. */
function Lens({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-[38px] w-[38px] rounded-full ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(circle at 38% 32%, #46536b 0%, #1a2333 26%, #0a0e16 58%, #04060a 100%)",
        boxShadow:
          "inset 0 0 0 3px rgba(255,255,255,0.06), inset 0 0 0 7px rgba(0,0,0,0.85), 0 0 0 2px rgba(255,255,255,0.05), 0 2px 6px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="absolute inset-[9px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 42% 36%, rgba(120,160,255,0.30) 0%, rgba(20,28,44,0.9) 46%, #05070c 100%)",
        }}
      />
    </div>
  );
}

function StatusIcons() {
  return (
    <span className="flex items-center gap-[6px]">
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={i * 4.4}
            y={8 - i * 2.6}
            width="3"
            height={3 + i * 2.6}
            rx="0.9"
            fill="white"
            opacity={i === 3 ? 0.45 : 1}
          />
        ))}
      </svg>
      {/* wifi */}
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true">
        <path d="M8 9.8 L6.1 7.9 a2.7 2.7 0 0 1 3.8 0 Z" fill="white" />
        <path
          d="M3.9 5.9a5.8 5.8 0 0 1 8.2 0"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M1.6 3.6a9 9 0 0 1 12.8 0"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {/* battery */}
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="white" opacity="0.4" />
        <rect x="2" y="2" width="15" height="8" rx="1.8" fill="white" />
        <path d="M23 4 v4 a2 2 0 0 0 0-4Z" fill="white" opacity="0.4" />
      </svg>
    </span>
  );
}

/** Small round avatar with the ATHA mark, used in the chat header. */
export function AthaAvatar({ size = 30 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(140deg,#10141f 0%,#0a0d14 100%)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 0 12px rgba(77,159,255,0.22)",
      }}
    >
      <BrandMark className="h-[58%] w-[58%]" />
    </div>
  );
}
