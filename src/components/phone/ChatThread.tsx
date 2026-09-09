"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { AthaAvatar } from "./PhoneFrame";
import {
  chatThresholds,
  GROUP_NAME,
  GROUP_SUBS,
  SCRIPTS,
  type Lang,
} from "./script";

/**
 * The ATHA Messages app — a live group chat between the agents.
 * Bilingual (EN / PT-BR): the header pill switches language live — the
 * revealed bubbles re-render in the chosen language in place.
 *
 * Playback engine (hybrid — scroll gate + steady beat):
 *   • The FIRST message is the single scroll gate: it appears only when
 *     the visitor scrolls past the post-landing window start.
 *   • From that moment the remaining messages land AUTOMATICALLY on a
 *     steady 1s beat — no further scrolling needed.
 *   • Scrolling back above the gate scrubs the whole thread away and
 *     cancels the beat; coming down again replays it (gate → beat).
 *   • Reactions pop onto some bubbles right after they land.
 * `reduced` renders the full conversation statically (derived state).
 */
export default function ChatThread({
  progressRef,
  reduced,
  lang,
  onLangChange,
}: {
  progressRef: MutableRefObject<number>;
  reduced: boolean;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}) {
  const [rev, setRev] = useState({ shown: 0, batch: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  const script = SCRIPTS[lang];

  // one scroll threshold per script item (structure is shared by both
  // languages, so the thresholds only depend on the item count)
  const thresholds = useMemo(
    () => chatThresholds(script.length),
    [script.length]
  );

  // mirror of the revealed count for the rAF loop — never read during render
  const revRef = useRef(rev);

  const shownCount = reduced ? script.length : rev.shown;

  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const loop = () => {
      // — the FIRST message is the only scroll gate; scrolling back above
      //   it scrubs the thread. Everything past it is time-driven. —
      const p = progressRef.current;
      const armed = p >= thresholds[0];
      const next = armed ? Math.max(revRef.current.shown, 1) : 0;
      if (next !== revRef.current.shown) {
        const nextState = {
          shown: next,
          // first index of the newly revealed batch — the render uses it
          // to cascade the pops instead of landing them as one block
          batch:
            next > revRef.current.shown ? revRef.current.shown : revRef.current.batch,
        };
        revRef.current = nextState;
        setRev(nextState);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, progressRef, thresholds]);

  // — automatic playback: once the first message is on, the remaining
  //   messages land on a steady 1s beat. The gate check inside the
  //   timeout keeps a scroll-back from advancing a thread that the rAF
  //   loop is about to reset anyway. —
  useEffect(() => {
    if (reduced) return;
    if (rev.shown === 0 || rev.shown >= script.length) return;
    const id = setTimeout(() => {
      if (progressRef.current >= thresholds[0] && revRef.current.shown > 0) {
        const next = {
          shown: revRef.current.shown + 1,
          batch: revRef.current.shown,
        };
        revRef.current = next;
        setRev(next);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [rev.shown, reduced, script.length, progressRef, thresholds]);

  // glide to the latest bubble
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [shownCount, reduced]);

  return (
    <div className="flex h-full flex-col bg-black">
      <style>{css}</style>

      {/* nav bar */}
      <div className="relative z-10 flex items-center gap-2 border-b border-white/[0.07] bg-black/70 px-3 pb-[7px] pt-[46px]">
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M8 1 L1.5 8 L8 15" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <AthaAvatar size={30} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold leading-tight text-white/95">
            {GROUP_NAME}
          </div>
          <div className="truncate text-[10.5px] leading-tight text-white/45">
            {GROUP_SUBS[lang]}
          </div>
        </div>

        {/* EN / PT-BR language pill */}
        <div
          role="group"
          aria-label="Language"
          className="flex shrink-0 items-center rounded-full border border-white/[0.09] bg-white/[0.05] p-[2px]"
        >
          {(["en", "pt"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLangChange(l)}
              aria-pressed={lang === l}
              className={`rounded-full px-[7px] py-[3px] text-[8.5px] font-semibold tracking-[0.08em] transition-colors duration-200 ${
                lang === l
                  ? "bg-white/[0.16] text-white"
                  : "text-white/40 hover:text-white/75"
              }`}
            >
              {l === "en" ? "EN" : "PT-BR"}
            </button>
          ))}
        </div>
      </div>

      {/* thread */}
      <div ref={listRef} className="chat-scroll relative flex-1 overflow-y-auto px-3">
        <div className="flex min-h-full flex-col justify-end gap-[6px] pb-[10px] pt-[10px]">
          {shownCount > 0 && script.slice(0, shownCount).map((item, i) =>
            item.kind === "divider" ? (
              <div
                key={i}
                className="self-center py-[3px] text-[9px] font-medium uppercase tracking-[0.18em] text-white/30"
              >
                {item.label}
              </div>
            ) : (
              <div
                key={i}
                className="msg-pop flex max-w-[84%] flex-col items-start"
                style={
                  reduced
                    ? undefined
                    : {
                        animation: "atha-pop 0.52s cubic-bezier(0.22,1,0.36,1) both",
                        // batched reveals cascade in instead of popping as one block
                        animationDelay: `${Math.min(
                          Math.max(i - rev.batch, 0) * 90,
                          360
                        )}ms`,
                      }
                }
              >
                <span
                  className="mb-[2px] pl-[3px] text-[10px] font-semibold tracking-wide"
                  style={{ color: item.color }}
                >
                  {item.from}
                </span>
                <div
                  className="rounded-[16px] rounded-bl-[5px] px-[11px] py-[6px] text-[12.5px] leading-[1.34]"
                  style={
                    item.atha
                      ? {
                          background: "linear-gradient(135deg,#ffa04d 0%,#ff8a2b 45%,#ff5f2e 100%)",
                          color: "#1b0e04",
                          fontWeight: 600,
                          boxShadow: "0 0 26px rgba(255,138,43,0.4)",
                        }
                      : item.headline
                        ? {
                            // breaking-news emphasis — vibrant amber, echoes
                            // DETECTIVE's golden name color
                            background:
                              "linear-gradient(135deg,#ffdf6b 0%,#ffcf4d 42%,#ffb02e 100%)",
                            color: "#241703",
                            fontWeight: 600,
                            boxShadow: "0 0 24px rgba(255,207,77,0.38)",
                          }
                        : { background: "#232327", color: "#f2f2f5" }
                  }
                >
                  {item.text}
                </div>

                {/* emoji reaction — pops onto the bubble a beat after landing */}
                {item.react && (
                  <span
                    className="mt-[3px] rounded-full border border-white/[0.09] bg-[#2a2a2f] px-[7px] py-[2.5px] text-[10px] leading-none text-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                    style={
                      reduced
                        ? undefined
                        : { animation: "atha-react 0.4s cubic-bezier(0.22,1,0.36,1) 0.5s both" }
                    }
                  >
                    {item.react}
                  </span>
                )}
              </div>
            )
          )}
        </div>

        {/* top fade — thread scrolling under the nav */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* input bar */}
      <div className="relative z-10 px-3 pb-[24px] pt-[6px]">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.07] py-[7px] pl-[11px] pr-[13px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" />
            <path d="M8 5 v6 M5 8 h6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="flex-1 text-[12.5px] text-white/35">
            {lang === "pt" ? "Mensagem" : "Message"}
          </span>
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" aria-hidden="true">
            <rect x="3" y="0.7" width="7" height="11.6" rx="3.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" />
            <path d="M1.4 7.4a5.1 5.1 0 0 0 10.2 0 M6.5 12.5 v3.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const css = `
@keyframes atha-pop {
  0% { opacity: 0; transform: translateY(10px) scale(0.965); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes atha-react {
  0% { opacity: 0; transform: translateY(4px) scale(0.82); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.chat-scroll { scrollbar-width: none; -ms-overflow-style: none; }
.chat-scroll::-webkit-scrollbar { display: none; }
`;
