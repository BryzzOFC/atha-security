"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { BrandMark } from "@/components/BrandMark";
import { useLang } from "@/lib/lang";
import {
  clamp,
  damp,
  easeOutBack,
  easeOutCubic,
  easeOutQuart,
  seg,
} from "@/lib/animations/easing";
import PhoneFrame from "./PhoneFrame";
import ChatThread from "./ChatThread";

/**
 * The keynote scene — a branded stage where an iPhone-class device
 * fades in half-sideways ("meio de lado"), spins a full 360° through
 * its BACK (real second face on the device), snaps front-facing on
 * landing, boots the ATHA Messages app — and the agent group chat
 * plays: the FIRST message is scroll-gated, then the remaining ones
 * land automatically on a steady beat (1s). Scrolling back above
 * the gate scrubs the thread; coming down again replays it.
 * The stage background (aurora mesh) lives in HeroSection; this scene
 * renders transparent over it and stays legible in both themes — the
 * phone itself is always a dark device screen.
 *
 * Scroll choreography (damped progress p):
 *   0.03–0.16  stage lights fade up
 *   0.10–0.47  phone rises half-sideways, holds the angled pose for a
 *              beat, then rotates 360° through the back at a slow,
 *              cinematic pace and snaps to front (easeOutBack), light
 *              trails behind, pointer parallax once landed
 *   0.455–0.69 landing: flash + double shockwave ring, contact glow and
 *              floor reflection fade in
 *   0.49–0.61  specular sweep across the glass
 *   0.53–0.59  boot overlay flickers out, Messages app revealed — the
 *              first message waits for a scroll past ≈0.62, the rest
 *              arrive automatically (1s apart)
 *   0.55–0.65  launch captions blur in — "The biggest innovation of all."
 *   top        scrolling back above the gate scrubs the thread away —
 *              coming down again replays it
 *
 * Bilingual: the EN / PT-BR pill inside the chat header (and the site
 * header) switches the conversation, the captions and the boot line
 * live, at any moment.
 *
 * Reduced motion: static settled poster on the lit stage, full
 * conversation visible.
 */
const E0 = 0.1;
// slow cinematic 360° — the entrance window is ~1.6× the original span,
// so the same scroll amount turns the device far less (feels heavier)
const E1 = 0.47;

const CAP_WINDOWS: [number, number][] = [
  [0.55, 0.605],
  [0.57, 0.625],
  [0.59, 0.65],
];

export default function PhoneScene({
  progressRef,
  active,
  reduced,
}: {
  progressRef: MutableRefObject<number>;
  active: boolean;
  reduced: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const glowARef = useRef<HTMLDivElement>(null);
  const glowBRef = useRef<HTMLDivElement>(null);
  const streakLRef = useRef<HTMLDivElement>(null);
  const streakRRef = useRef<HTMLDivElement>(null);
  const ringARef = useRef<HTMLDivElement>(null);
  const ringBRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const reflRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const capARef = useRef<HTMLDivElement>(null);
  const capBRef = useRef<HTMLDivElement>(null);
  const capCRef = useRef<HTMLDivElement>(null);
  const capTRef = useRef<HTMLDivElement>(null);

  const pointerRef = useRef({ x: 0, y: 0 });
  const [lang, setLang] = useLang();
  const pt = lang === "pt";

  // pointer parallax target (desktop nicety)
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  const applyFrame = (p: number, t: number, px: number, py: number) => {
    // — stage lights —
    const g = seg(p, 0.03, 0.16);
    if (stageRef.current) stageRef.current.style.opacity = String(g);
    if (spotRef.current) {
      spotRef.current.style.opacity = String(g * (0.72 + 0.28 * Math.sin(t * 0.7)));
      spotRef.current.style.transform = `translateX(-50%) rotate(${(Math.sin(t * 0.33) * 1.5).toFixed(2)}deg)`;
    }
    const breathe = 0.82 + 0.18 * Math.sin(t * 0.55);
    for (const [el, dx, dy] of [
      [glowARef.current, -18, -12],
      [glowBRef.current, 14, 10],
    ] as const) {
      if (!el) continue;
      el.style.opacity = String(g * breathe);
      el.style.transform =
        `translate(calc(-50% + ${(px * dx).toFixed(1)}px), calc(-50% + ${(py * dy).toFixed(1)}px)) ` +
        `scale(${(0.85 + 0.25 * g).toFixed(4)})`;
    }

    // — phone entrance: rises half-sideways, spins 360° through the back,
    //   snaps front-facing on landing —
    const k = seg(p, E0, E1);
    const posK = easeOutQuart(k);
    // a short hold at the angled pose so "meio de lado" reads before the spin
    const spinK = easeOutBack(seg(p, E0 + 0.06, E1), 1.07);
    const SPIN0 = 68; // start angle (deg) — the half-sideways pose
    const landed = k >= 1;
    const y = (1 - posK) * 72;
    const rx = (1 - posK) * 14 + (landed ? -py * 1.7 : 0);
    const ry = SPIN0 + (360 - SPIN0) * spinK + (landed ? px * 2.6 : 0);
    const rz = landed ? Math.sin(t * 0.55) * 0.7 + px * 1.1 : 0;
    const sc = 0.6 + 0.4 * posK;
    const fl = landed ? Math.sin(t * 0.9) * 4 : 0;
    if (phoneRef.current) {
      phoneRef.current.style.opacity = String(seg(p, E0 - 0.045, E0 + 0.05));
      phoneRef.current.style.transform =
        `translate(-50%,-50%) ` +
        `translate3d(${(px * 8).toFixed(2)}px, calc(${y.toFixed(3)}vh + ${fl.toFixed(2)}px), 0) ` +
        `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) ` +
        `scale(${sc.toFixed(4)})`;
    }

    // — light trails behind the rising phone —
    const s = seg(p, E0 - 0.03, E1 + 0.03);
    const sOp = Math.sin(Math.PI * clamp(s)) * 0.5;
    const sY = (1 - posK) * 32;
    const sH = 34 + 46 * s;
    for (const [el, off] of [
      [streakLRef.current, -13],
      [streakRRef.current, 12],
    ] as const) {
      if (!el) continue;
      el.style.opacity = String(sOp);
      el.style.height = `${sH.toFixed(1)}vh`;
      el.style.transform = `translateY(calc(-50% + ${sY.toFixed(2)}vh))`;
      el.style.left = `calc(50% + ${off}vmin)`;
    }

    // — landing: flash + double shockwave —
    const fk = seg(p, 0.455, 0.59);
    if (flashRef.current) {
      flashRef.current.style.opacity = String(Math.sin(Math.PI * clamp(fk)) * 0.2);
      flashRef.current.style.transform = `translate(-50%,-50%) scale(${(0.5 + fk * 1.2).toFixed(3)})`;
    }
    const lkA = seg(p, 0.455, 0.63);
    if (ringARef.current) {
      ringARef.current.style.opacity = String((1 - lkA) * 0.32);
      ringARef.current.style.transform = `translate(-50%,-50%) scale(${(0.35 + 3.2 * easeOutCubic(lkA)).toFixed(3)})`;
    }
    const lkB = seg(p, 0.495, 0.69);
    if (ringBRef.current) {
      ringBRef.current.style.opacity = String((1 - lkB) * 0.26);
      ringBRef.current.style.transform = `translate(-50%,-50%) scale(${(0.3 + 2.7 * easeOutCubic(lkB)).toFixed(3)})`;
    }

    // — contact glow + floor reflection (fade in as the phone settles) —
    const pk = seg(p, 0.43, 0.55);
    const poolG = pk * (0.8 + 0.2 * Math.sin(t * 1.1));
    if (poolRef.current) poolRef.current.style.opacity = String(poolG);
    if (reflRef.current) reflRef.current.style.opacity = String(pk * 0.75);

    // — specular sweep across the glass —
    const sw = seg(p, 0.49, 0.61);
    if (sweepRef.current) {
      sweepRef.current.style.transform = `translateX(${(-130 + 270 * sw).toFixed(2)}%)`;
      sweepRef.current.style.opacity = String(Math.sin(Math.PI * clamp(sw)) * 0.9);
    }

    // — boot overlay flickers out —
    const bk = seg(p, 0.53, 0.59);
    if (bootRef.current) {
      bootRef.current.style.opacity =
        bk >= 1 ? "0" : bk <= 0 ? "1" : String(bk * (0.35 + 0.65 * flick(t)));
    }

    // — launch captions blur in (staggered) —
    const caps = [capARef.current, capBRef.current, capCRef.current];
    caps.forEach((el, i) => {
      if (!el) return;
      const [w0, w1] = CAP_WINDOWS[i];
      const ck = seg(p, w0, w1);
      el.style.opacity = String(ck);
      el.style.transform = `translateY(${((1 - ck) * 16).toFixed(1)}px)`;
      el.style.filter = `blur(${((1 - ck) * 9).toFixed(2)}px)`;
    });
    const ctk = seg(p, 0.55, 0.62);
    if (capTRef.current) {
      capTRef.current.style.opacity = String(ctk);
      capTRef.current.style.transform = `translateY(${((1 - ctk) * 14).toFixed(1)}px)`;
      capTRef.current.style.filter = `blur(${((1 - ctk) * 8).toFixed(2)}px)`;
    }
  };

  useEffect(() => {
    if (reduced) return;
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let pSmooth = progressRef.current;
    let psx = 0;
    let psy = 0;
    let t = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      pSmooth = damp(pSmooth, progressRef.current, 6.5, dt);
      psx = damp(psx, pointerRef.current.x, 2.8, dt);
      psy = damp(psy, pointerRef.current.y, 2.8, dt);
      applyFrame(pSmooth, t, psx, psy);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, progressRef]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ————— the stage (scenario behind the phone) ————— */}
      <div ref={stageRef} className="absolute inset-0" style={{ opacity: reduced ? 1 : 0 }}>
        {/* keynote glows with pointer parallax */}
        <div
          ref={glowARef}
          className="pointer-events-none absolute left-1/2 top-[36%] h-[92vmin] w-[92vmin]"
          style={{
            opacity: reduced ? 1 : 0,
            background:
              "radial-gradient(circle, rgba(77,159,255,0.15) 0%, rgba(77,159,255,0.05) 38%, transparent 65%)",
          }}
        />
        <div
          ref={glowBRef}
          className="pointer-events-none absolute left-1/2 top-[72%] h-[80vmin] w-[110vmin]"
          style={{
            opacity: reduced ? 1 : 0,
            background:
              "radial-gradient(ellipse, rgba(255,138,43,0.13) 0%, rgba(255,138,43,0.04) 40%, transparent 68%)",
          }}
        />

        {/* bokeh orbs — depth behind the device */}
        <div
          className="pointer-events-none absolute left-[16%] top-[24%] h-[26vmin] w-[26vmin] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(77,159,255,0.10) 0%, transparent 65%)",
            filter: "blur(18px)",
            ["--bx" as string]: "3vw",
            ["--by" as string]: "-2vh",
            animation: reduced ? "none" : "atha-bokeh 16s ease-in-out infinite alternate",
          }}
        />
        <div
          className="pointer-events-none absolute right-[12%] top-[58%] h-[34vmin] w-[34vmin] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,138,43,0.09) 0%, transparent 65%)",
            filter: "blur(22px)",
            ["--bx" as string]: "-2.5vw",
            ["--by" as string]: "2vh",
            animation: reduced ? "none" : "atha-bokeh 19s ease-in-out infinite alternate",
          }}
        />

        {/* spotlight cone from above */}
        <div
          ref={spotRef}
          className="pointer-events-none absolute left-1/2 top-0 h-[76vh] w-[68vmin]"
          style={{
            opacity: reduced ? 0.9 : 0,
            background:
              "linear-gradient(to bottom, rgba(150,185,255,0.14) 0%, rgba(150,185,255,0.05) 55%, transparent 82%)",
            clipPath: "polygon(44% 0, 56% 0, 90% 100%, 10% 100%)",
            filter: "blur(14px)",
          }}
        />

        {/* stage floor — perspective grid + horizon glow line */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(160,190,255,0.06) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(160,190,255,0.055) 0 1px, transparent 1px 58px)",
            transform: "perspective(520px) rotateX(62deg) scale(1.7)",
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent 88%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent 88%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-[6%] bottom-[29.6%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,138,43,0.35) 30%, rgba(140,175,255,0.4) 70%, transparent)",
          }}
        />

        {/* drifting motes */}
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: `${m.left}%`,
              bottom: "-4%",
              width: m.size,
              height: m.size,
              background: `radial-gradient(circle, rgba(${m.hue},0.95) 0%, rgba(${m.hue},0) 70%)`,
              ["--mo" as string]: String(m.op),
              ["--mx" as string]: `${m.drift}px`,
              animation: reduced
                ? "none"
                : `atha-mote ${m.dur.toFixed(2)}s linear ${m.delay.toFixed(2)}s infinite`,
              opacity: reduced ? 0.4 : 0,
            }}
          />
        ))}
      </div>

      {/* light trails behind the rising phone */}
      <div
        ref={streakLRef}
        className="pointer-events-none absolute top-1/2 w-[2px]"
        style={{
          opacity: 0,
          background: "linear-gradient(to bottom, transparent, rgba(190,215,255,0.55), transparent)",
          filter: "blur(1.5px)",
        }}
      />
      <div
        ref={streakRRef}
        className="pointer-events-none absolute top-1/2 w-[1.5px]"
        style={{
          opacity: 0,
          background: "linear-gradient(to bottom, transparent, rgba(255,180,120,0.5), transparent)",
          filter: "blur(1.5px)",
        }}
      />

      {/* landing flash + double shockwave */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute left-1/2 top-[53%] h-[100vmin] w-[100vmin]"
        style={{
          opacity: 0,
          background:
            "radial-gradient(circle, rgba(220,235,255,0.22) 0%, rgba(140,175,255,0.10) 38%, transparent 68%)",
        }}
      />
      <div
        ref={ringARef}
        className="pointer-events-none absolute left-1/2 top-[53%] h-[150px] w-[150px] rounded-full border border-foreground/40"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringBRef}
        className="pointer-events-none absolute left-1/2 top-[53%] h-[150px] w-[150px] rounded-full border border-[#ff8a2b]/40"
        style={{ opacity: 0 }}
      />

      {/* the phone (contact glow + reflection ride along inside the wrapper) */}
      <div
        ref={phoneRef}
        className="absolute left-1/2 top-[53%] z-[5]"
        style={
          reduced
            ? {
                opacity: 1,
                transform: "translate(-50%,-50%)",
                perspective: "1400px",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }
            : {
                opacity: 0,
                perspective: "1400px",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }
        }
      >
        <div
          ref={poolRef}
          className="pointer-events-none absolute left-1/2 top-[101%] h-[12vmin] w-[125%]"
          style={{
            opacity: reduced ? 0.8 : 0,
            background:
              "radial-gradient(ellipse, rgba(255,138,43,0.17) 0%, rgba(77,159,255,0.08) 45%, transparent 72%)",
            filter: "blur(10px)",
          }}
        />
        <div
          ref={reflRef}
          className="pointer-events-none absolute left-1/2 top-[103%] h-[34%] w-[62%]"
          style={{
            opacity: reduced ? 0.5 : 0,
            background:
              "linear-gradient(to bottom, rgba(150,180,255,0.11) 0%, rgba(255,138,43,0.05) 40%, transparent 78%)",
            filter: "blur(14px)",
          }}
        />
        <PhoneFrame>
          <ChatThread
            progressRef={progressRef}
            reduced={reduced}
            lang={lang}
            onLangChange={setLang}
          />

          {/* boot overlay */}
          <div
            ref={bootRef}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-black"
            style={{ opacity: reduced ? 0 : 1 }}
          >
            <BrandMark className="h-12 w-12" />
            <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.46em] text-white/80">
              ATHA
            </div>
            <div className="mt-2 px-8 text-center text-[8.5px] uppercase tracking-[0.3em] text-white/30">
              {pt
                ? "Segurança para o software que você constrói"
                : "Security for the software you build"}
            </div>
          </div>

          {/* specular sweep */}
          <div
            ref={sweepRef}
            className="pointer-events-none absolute inset-y-0 left-0 z-[35] w-1/2"
            style={{
              opacity: 0,
              background:
                "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.09) 55%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
        </PhoneFrame>
      </div>

      {/* ————— launch captions ————— */}
      {/* desktop */}
      <div className="absolute left-[6.5%] top-1/2 z-10 hidden max-w-[360px] -translate-y-1/2 lg:block">
        <div ref={capARef} style={capStyle(reduced)}>
          <div className="kicker text-[10px] text-[#ff8a2b]">
            {pt ? "O LANÇAMENTO DO ATHA" : "THE LAUNCH OF ATHA"}
          </div>
        </div>
        <div ref={capBRef} style={capStyle(reduced)}>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground xl:text-[46px]">
            {pt ? "A maior inovação de todas." : "The biggest innovation of all."}
          </h2>
        </div>
        <div ref={capCRef} style={capStyle(reduced)}>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
            {pt
              ? "A manhã em que a corrida da segurança terminou — ao vivo no grupo de chat dos agentes."
              : "The morning the security race ended — live from the agents' group chat."}
          </p>
          <div className="mt-6 flex items-center gap-2 text-foreground/45">
            <BrandMark className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.22em]">
              ATHA Security
            </span>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div
        ref={capTRef}
        className="absolute inset-x-0 top-[9%] z-10 px-6 text-center lg:hidden"
        style={capStyle(reduced)}
      >
        <div className="kicker text-[9px] text-[#ff8a2b]">
          {pt ? "O LANÇAMENTO DO ATHA" : "THE LAUNCH OF ATHA"}
        </div>
        <div className="mt-1.5 text-[17px] font-semibold leading-snug tracking-tight text-foreground">
          {pt ? "A maior inovação de todas." : "The biggest innovation of all."}
        </div>
      </div>

      <style>{sceneCss}</style>
    </div>
  );
}

/** Initial inline style for caption blocks (visible when reduced). */
function capStyle(reduced: boolean): CSSProperties {
  if (reduced) return { opacity: 1, transform: "none", filter: "none" };
  return {
    opacity: 0,
    transform: "translateY(16px)",
    filter: "blur(9px)",
    willChange: "opacity, transform, filter",
  };
}

/** Cheap deterministic flicker for the boot-out moment. */
function flick(t: number): number {
  const v = Math.sin(t * 37) * Math.sin(t * 63 + 1.7);
  return v > 0.2 ? 1 : v > -0.4 ? 0.55 : 0.12;
}

/* Deterministic PRNG so the stage is identical every render. */
function makeRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let z = Math.imul(s ^ (s >>> 15), 1 | s);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

const MOTES = (() => {
  const r = makeRand(20260901);
  return Array.from({ length: 26 }, () => {
    const pick = r();
    const hue = pick < 0.38 ? "255,138,43" : pick < 0.72 ? "122,168,255" : "235,240,255";
    return {
      left: 3 + r() * 94,
      size: 1.5 + r() * 2.6,
      dur: 10 + r() * 13,
      delay: -(r() * 24),
      drift: (r() - 0.5) * 56,
      op: 0.2 + r() * 0.4,
      hue,
    };
  });
})();

const sceneCss = `
@keyframes atha-mote {
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  10% { opacity: var(--mo); }
  86% { opacity: var(--mo); }
  100% { transform: translate3d(var(--mx), -94vh, 0); opacity: 0; }
}
@keyframes atha-bokeh {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(var(--bx), var(--by), 0) scale(1.1); }
}
`;
