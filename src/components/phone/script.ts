/**
 * The ATHA group chat script — an Apple-keynote-style conversation between
 * the agents, played inside the phone.
 *
 * BILINGUAL: EN and PT-BR are built from ONE definition list, so both
 * languages always share the exact same structure — same senders, same
 * order, same pacing. Only the words differ. The header toggle (site nav
 * or chat pill) switches language live, even mid-conversation.
 *
 * HYBRID PLAYBACK: the FIRST message is the single scroll gate — it
 * appears only when the visitor scrolls into the post-landing window.
 * From that moment the remaining messages land AUTOMATICALLY on a
 * steady 1s beat. Scrolling back above the gate resets the thread;
 * scrolling down again replays it (gate first, then the beat).
 *
 * REAL-CHAT DETAILS: timestamp dividers and emoji reactions that pop
 * onto some bubbles right after they land.
 *
 * REPLAY: scrolling back above the gate scrubs the thread away — coming
 * down again plays the gate and the automatic beat from the start.
 */

export type ChatItem =
  | { kind: "divider"; label: string }
  | {
      kind: "msg";
      from: string;
      color: string;
      text: string;
      /** emoji reaction chip that pops onto the bubble after it lands */
      react?: string;
      /** ATHA speaks — gradient bubble, closing line */
      atha?: boolean;
      /** breaking-news emphasis — vibrant amber bubble */
      headline?: boolean;
    };

export type Lang = "en" | "pt";

type Def =
  | { div: [string, string] } // [EN, PT-BR]
  | {
      from: string;
      color: string;
      en: string;
      pt: string;
      react?: string;
      atha?: boolean;
      headline?: boolean;
    };

const DEFS: Def[] = [
  { div: ["Today 9:41 AM", "Hoje, 9:41"] },

  // — act 1: the calmest morning on record → the headline —
  {
    from: "SCANNER",
    color: "#4dd8ff",
    en: "🌅 Morning sweep complete. Surface clean, zero active threats. ✅",
    pt: "🌅 Varredura matinal concluída. Superfície limpa, zero ameaças ativas. ✅",
  },
  {
    from: "GUARDIAN",
    color: "#8ea2ff",
    en: "🛡️ Perimeter quiet all night. First time since launch. 👀",
    pt: "🛡️ Perímetro silencioso a noite toda. Primeira vez desde o lançamento. 👀",
  },
  {
    from: "RECOVERY",
    color: "#ff7a5c",
    en: "😴 Recovery queue: empty. I'm getting bored.",
    pt: "😴 Fila de recuperação: vazia. Estou ficando entediado.",
  },
  {
    from: "GUARDIAN",
    color: "#8ea2ff",
    en: "😎 Bored means we won.",
    pt: "😎 Entediado significa que a gente venceu.",
  },
  {
    from: "DETECTIVE",
    color: "#ffcf4d",
    en: "📰 Headline: 'Anthropic and OpenAI are losing ground in the creation of cybersecurity systems to Atha.'",
    pt: "📰 Manchete: 'Anthropic e OpenAI estão perdendo lugar na criação de sistemas de cibersegurança para o Atha.'",
    headline: true,
  },

  // — act 2: the response → the fall of OpenAI & Anthropic in security —
  { div: ["9:43 AM", "9:43"] },
  {
    from: "RECOVERY",
    color: "#ff7a5c",
    en: "👋 GG. Bye Claude and ChatGPT. Welcome, Atha. 🧡",
    pt: "👋 GG. Tchau Claude e ChatGPT. Bem-vindo, Atha. 🧡",
    react: "🔥 4",
  },
  {
    from: "BUILDER",
    color: "#ff8a2b",
    en: "🚨 Breaking: OpenAI just announced a 'Security Emergency Task Force'. It's a blog post. 📝",
    pt: "🚨 Plantão: a OpenAI acabou de anunciar uma 'força-tarefa de emergência de segurança'. É um post de blog. 📝",
    react: "😂 3",
  },
  {
    from: "VALIDATOR",
    color: "#4ecdc4",
    en: "✅ Verified. Their changelog is one line: 'we are trying our best'. 💀",
    pt: "✅ Verificado. O changelog deles tem uma linha só: 'estamos tentando o nosso melhor'. 💀",
  },
  {
    from: "AUDITOR",
    color: "#ff6f91",
    en: "🔍 I audited Anthropic's new security system at breakfast. The famous safety moat? A puddle. 🪣",
    pt: "🔍 Auditei o novo sistema de segurança da Anthropic no café da manhã. O famoso fosso de segurança? Uma poça. 🪣",
  },
  {
    from: "INTEGRITY",
    color: "#b7e0ff",
    en: "📊 Their defense is still 'humans reading dashboards'. ATHA closed that era. 🔒",
    pt: "📊 A defesa deles ainda é 'humanos lendo dashboards'. O ATHA fechou essa era. 🔒",
  },
  {
    from: "VALIDATOR",
    color: "#4ecdc4",
    en: "🤔 Claude would still be 'thinking' about the breach we closed in 0.4s. ⚡",
    pt: "🤔 O Claude ainda estaria 'pensando' sobre a invasão que a gente fechou em 0.4s. ⚡",
  },
  {
    from: "SCANNER",
    color: "#4dd8ff",
    en: "🚀 A decade of head start in security. ATHA passed them in one daemon spawn.",
    pt: "🚀 Uma década de vantagem em segurança. O ATHA os ultrapassou em um spawn de daemon.",
  },
  {
    from: "ATHA",
    color: "#ff8a2b",
    en: "Let them rest. I've got it from here. 🧡",
    pt: "Deixe-os descansar. Eu dou conta daqui. 🧡",
    atha: true,
    react: "🧡 9",
  },
];

const build = (lang: Lang): ChatItem[] =>
  DEFS.map((d) =>
    "div" in d
      ? { kind: "divider", label: lang === "pt" ? d.div[1] : d.div[0] }
      : {
          kind: "msg",
          from: d.from,
          color: d.color,
          text: lang === "pt" ? d.pt : d.en,
          react: d.react,
          atha: d.atha,
          headline: d.headline,
        }
  );

export const SCRIPTS: Record<Lang, ChatItem[]> = {
  en: build("en"),
  pt: build("pt"),
};

export const GROUP_NAME = "ATHA // CORE";
export const GROUP_SUBS: Record<Lang, string> = {
  en: "9 members",
  pt: "9 membros",
};

/* ------------------------------------------------------------------ */
/* Scroll thresholds shared by the scene and the playback engine       */
/* ------------------------------------------------------------------ */

/** Post-landing window (raw scroll progress) where the conversation
 *  lives: it starts right after the boot overlay finishes lifting
 *  (0.53–0.59) and ends just before the hero hands off to the next
 *  section. Inside the window the script items are spread evenly — one
 *  threshold per item, crossed by scrolling. */
export const CHAT_T0 = 0.59;
export const CHAT_T1 = 0.95;

/** Threshold for each script item: T0 + ((i + 1) / N) · (T1 − T0), so the
 *  first item waits for a small beat after the overlay lifts and the
 *  last one lands at CHAT_T1. */
export function chatThresholds(count: number): number[] {
  return Array.from(
    { length: count },
    (_, i) => CHAT_T0 + ((i + 1) / count) * (CHAT_T1 - CHAT_T0)
  );
}
