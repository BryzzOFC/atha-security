/**
 * EN source of truth for every translatable string on the site.
 * `Copy` (derived from this object) is the contract that the PT-BR
 * translation must match exactly — enforced by the type system.
 */

export const en = {
  nav: {
    links: [
      { href: "#technology", label: "Technology" },
      { href: "#agents", label: "Agents" },
      { href: "#workflow", label: "Workflow" },
      { href: "#product", label: "Product" },
      { href: "#plans", label: "Plans" },
      { href: "#faq", label: "FAQ" },
    ],
    talk: "Talk to us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  hero: {
    aria: "ATHA Security — introduction",
    h1a: "Security for the software",
    h1b: "you build.",
    sub: "A coordinated security system built around specialized agents for detection, analysis, response and verification.",
    ctaPrimary: "Explore ATHA",
    ctaSecondary: "Talk to us",
    scrollHint: "SCROLL",
  },

  problem: {
    tag: "THE PROBLEM",
    h2a: "AI changed how fast we build.",
    h2b: "Security needs to keep up.",
    p1: "AI tools have made software development faster and more accessible than at any point in history. Small teams now ship in weeks what once took quarters — scaffolding features, writing tests, reviewing code, deploying continuously.",
    p2: "But speed does not remove risk. It compounds it. Every accelerated release still carries the same responsibilities as any other piece of software — and security remains the specialized, difficult part that is too often left for later.",
    quote:
      "The problem is not building fast. The problem is building fast without a dedicated security layer.",
    risks: [
      {
        title: "Vulnerabilities",
        text: "Fast-generated code can still ship with exploitable weaknesses.",
      },
      {
        title: "Insecure configurations",
        text: "Defaults, keys and permissions are easy to get wrong at speed.",
      },
      {
        title: "Unvalidated failures",
        text: "Changes that were never tested against real failure modes.",
      },
      {
        title: "Incidents",
        text: "Speed shortens feedback loops — and incident response windows.",
      },
      {
        title: "Monitoring needs",
        text: "Systems need continuous observation, not one-time checks.",
      },
      {
        title: "Verification",
        text: "Every fix needs to be verified against reality, not assumptions.",
      },
    ],
  },

  arch: {
    tag: "THE ATHA APPROACH",
    h2a: "One system. Specialized agents.",
    h2b: "Coordinated defense.",
    p: "ATHA is not a single scanner or an isolated dashboard. It is a coordinated layer where specialized agents share context, divide responsibilities and act under shared safeguards — detection informs analysis, analysis shapes response, response is verified and learned from.",
    sceneAria:
      "Interactive visualization of the ATHA core connected to eight specialized agent roles",
    hud1: "ATHA CORE — COORDINATED DEFENSE GRID",
    hud2: "8 SPECIALIZED ROLES",
    chipsAria: "Agent roles",
    nodes: [
      "DETECTION",
      "ANALYSIS",
      "RESPONSE",
      "VALIDATION",
      "INTEGRITY",
      "AUDIT",
      "RECOVERY",
      "PROTECTION",
    ],
    foot: "A coordinated multi-agent architecture — one shared system, specialized roles.",
  },

  agents: {
    tag: "THE AGENTS",
    h2a: "Specialized agents.",
    h2b: "Clear responsibilities.",
    p: "Each agent owns a specific security responsibility — and works as part of the same coordinated system.",
    statusAria: "Status",
    items: [
      {
        name: "SCANNER",
        status: "ACTIVE",
        role: "DETECTION",
        description: "Detects potential security issues in permitted environments.",
      },
      {
        name: "DETECTIVE",
        status: "ACTIVE",
        role: "ANALYSIS",
        description: "Analyzes security events and reconstructs timelines.",
      },
      {
        name: "BUILDER",
        status: "STANDBY",
        role: "REMEDIATION",
        description: "Helps construct remediation workflows.",
      },
      {
        name: "VALIDATOR",
        status: "READY",
        role: "VERIFICATION",
        description: "Checks whether a remediation actually works.",
      },
      {
        name: "INTEGRITY",
        status: "ACTIVE",
        role: "MONITORING",
        description: "Monitors system integrity.",
      },
      {
        name: "GUARDIAN",
        status: "ACTIVE",
        role: "PROTECTION",
        description: "Coordinates protective responses.",
      },
      {
        name: "AUDITOR",
        status: "READY",
        role: "TRACEABILITY",
        description: "Maintains traceability of important actions.",
      },
      {
        name: "RECOVERY",
        status: "STANDBY",
        role: "RESTORATION",
        description: "Helps restore controlled environments after failures.",
      },
    ],
    status: { ACTIVE: "ACTIVE", READY: "READY", STANDBY: "STANDBY" },
    foot: "Agent responsibilities reflect the current direction of the project — capabilities are introduced progressively and described exactly as they work.",
  },

  how: {
    tag: "HOW IT WORKS",
    h2a: "From signal to",
    h2b: "resolution.",
    steps: [
      {
        step: "DETECT",
        text: "Agents watch permitted environments for signals that deserve attention.",
      },
      {
        step: "ANALYZE",
        text: "Events are examined and reconstructed into a clear, factual timeline.",
      },
      {
        step: "RESPOND",
        text: "Coordinated actions contain what needs to be contained — under safeguards.",
      },
      {
        step: "VERIFY",
        text: "Remediations are checked against reality. Did the fix actually work?",
      },
      {
        step: "LEARN",
        text: "Each resolution strengthens context for the next one.",
      },
    ],
  },

  aibuilt: {
    tag: "SECURITY FOR AI-BUILT SOFTWARE",
    h2a: "Build with AI.",
    h2b: "Protect with ATHA.",
    p1: "Modern teams already use AI to scaffold features, generate tests, review code and accelerate delivery. That acceleration is worth keeping — it does not have to outpace safety.",
    p2: "ATHA exists so the two can move together: while your tooling speeds up how you build, ATHA adds a dedicated layer for security and observability around what you ship — structured, coordinated and designed to be verified.",
    p3: "ATHA is designed to complement your existing stack — adding a coordinated security layer, not replacing your judgement or your current tools.",
    bridge: {
      fast: "BUILD FAST",
      fastSub: "AI-DRIVEN",
      safe: "BUILD SAFELY",
      safeSub: "ATHA-PROTECTED",
    },
    practices: [
      {
        title: "Structured workflows",
        text: "Security processes run alongside rapid development — not after it.",
      },
      {
        title: "Observed, analyzed, documented",
        text: "Security events gain context, timelines and traceable outcomes.",
      },
      {
        title: "Automation under oversight",
        text: "Controlled automation with permissions — never free-running.",
      },
    ],
  },

  workflow: {
    tag: "WORKFLOW",
    h2a: "Watch an event move",
    h2b: "through ATHA.",
    timelineAria: "Timeline of the seven ATHA workflow stages",
    stages: [
      {
        label: "APPLICATION",
        text: "The software your team ships — web apps, APIs, services and AI-built products.",
      },
      {
        label: "ATHA",
        text: "A coordinated security layer is wrapped around the application.",
      },
      {
        label: "MULTIPLE SECURITY AGENTS",
        text: "Specialized agents take position around the system, each with a clear role.",
      },
      {
        label: "EVENT",
        text: "A signal is detected in a permitted environment and becomes a tracked event.",
      },
      {
        label: "ANALYSIS",
        text: "The event is investigated and reconstructed into a factual timeline.",
      },
      {
        label: "RESPONSE",
        text: "A coordinated action is proposed and executed under permission and oversight.",
      },
      {
        label: "VERIFICATION",
        text: "The result is verified, documented and learned from.",
      },
    ],
  },

  why: {
    tag: "WHY ATHA",
    h2a: "Why",
    h2b: "ATHA?",
    p: "Not just a scanner. Not just a chatbot. Not just a dashboard. A coordinated architecture of agents with clear responsibilities.",
    items: [
      {
        title: "Specialized",
        text: "Different security responsibilities can be handled by specialized agents.",
      },
      {
        title: "Coordinated",
        text: "Agents communicate through a coordinated system rather than operating as isolated tools.",
      },
      {
        title: "Observable",
        text: "Security events, tasks and actions can be tracked.",
      },
      {
        title: "Controlled",
        text: "Sensitive operations can require authorization and remain subject to system safeguards.",
      },
      {
        title: "Modular",
        text: "The architecture can evolve as new agents and capabilities are introduced.",
      },
    ],
  },

  trust: {
    tag: "TRUST & SECURITY PRINCIPLES",
    h2a: "Security principles,",
    h2b: "by design.",
    principles: [
      {
        title: "LEAST PRIVILEGE",
        text: "Agents operate with the minimum access required for their role.",
      },
      {
        title: "AUDITABILITY",
        text: "Important actions are recorded and can be reviewed.",
      },
      {
        title: "HUMAN OVERSIGHT",
        text: "People stay in the loop for decisions that matter.",
      },
      {
        title: "FAIL-SAFE DESIGN",
        text: "When something goes wrong, the system defaults to safety.",
      },
      {
        title: "TRACEABLE ACTIONS",
        text: "Every automated step can be traced back to its origin.",
      },
      {
        title: "CONTROLLED AUTOMATION",
        text: "Automation acts within permissions — never beyond them.",
      },
    ],
    foot: "These principles guide how the ATHA architecture is being built — automation with permission, oversight and a complete record of what happened.",
  },

  product: {
    tag: "PRODUCT",
    h2a: "One view of your",
    h2b: "security posture.",
    p: "The ATHA console shows what the system is doing at a glance — agents, events, integrity and the state of every coordinated response. Hover an agent to inspect its role.",
  },

  dash: {
    demoState: "DEMO STATE",
    coreAgents: "CORE AGENTS",
    registered: "Registered agents:",
    kpis: {
      systemStatus: "SYSTEM STATUS",
      online: "ONLINE",
      agents: "AGENTS",
      agentsValue: "71",
      events: "EVENTS",
      active: "ACTIVE",
      threats: "THREATS",
      monitored: "MONITORED",
      integrity: "INTEGRITY",
      verified: "VERIFIED",
    },
    stream: "LIVE EVENT STREAM",
    events: [
      "Scheduled environment scan completed — 0 blockers",
      "Recon signal flagged for analysis in permitted scope",
      "Event timeline reconstructed — 3 nodes",
      "Protective response proposed — awaiting authorization",
      "Remediation check scheduled",
      "Action trail recorded — trace ID attached",
    ],
    listening: "listening for events",
    agent: "AGENT",
    status: "STATUS",
    role: "ROLE",
    taskLoad: "TASK LOAD — LAST 24H",
    disclaimer:
      "Demonstration state — interface visualization of a system snapshot. Not live product data.",
  },

  audience: {
    tag: "WHO IT'S FOR",
    h2a: "Built for the next generation",
    h2b: "of software teams.",
    p: "ATHA is designed for teams that move fast and still take security seriously — no security department required from day one.",
    items: [
      {
        title: "AI DEVELOPMENT",
        text: "Teams building with AI coding tools and agents.",
      },
      {
        title: "STARTUPS",
        text: "Ship fast without building a security team from zero.",
      },
      {
        title: "SAAS",
        text: "Protect multi-tenant products with structured workflows.",
      },
      {
        title: "AGENCIES",
        text: "Deliver client projects with a security layer included.",
      },
      {
        title: "ENGINEERING TEAMS",
        text: "Add observability and control to growing systems.",
      },
    ],
    foot: "As the product matures, this section will feature real stories from teams building with ATHA.",
  },

  plans: {
    tag: "PLANS",
    h2a: "Plans and prices,",
    h2b: "no nonsense.",
    p: "Three plans, real protection in all of them. You pick how much ATHA works for you — and the price can be in Euro, Dollar or Real: just tap the toggle below.",
    currencyLabel: "Currency",
    currencyHint: "Prices show in Euro — tap to switch to Dollar or Real.",
    currencyNames: { EUR: "Euro", USD: "Dollar", BRL: "Real" },
    perMonth: "/month",
    perYear: "/year",
    annualOf: "or",
    monthlyNoCommit: "billed monthly, no commitment",
    sitesLabel: "protected",
    mostComplete: "MOST COMPLETE",
    essentials: "Everything in",
    plus: "plus:",
    bestLabel: "What's good about it",
    limitLabel: "What it does NOT do",
    simple: {
      basic: "You ask, it checks: an X-ray of your site whenever you want.",
      essencial: "Watches your site day and night — and repairs itself if anyone tampers with it.",
      full: "Watches, repairs and even sets traps for the hacker. The full package.",
    },
    tiers: {
      basic: {
        best: "Hunts viruses, checks if anyone touched your site, sets decoy traps and hands you a report — all whenever you ask.",
        limit: "It does not watch on its own. If something happens between checks, you only find out on the next check.",
      },
      essencial: {
        best: "Someone tampers with your site? It goes back to normal by itself in seconds, the virus goes to quarantine on the spot and the evidence gets locked tight.",
        limit: "The defense is visible — a well-prepared attacker could study how it works before striking.",
      },
      full: {
        best: "Everything in Essencial, plus: traps that catch the hacker and ban their IP, invisible defense, and a backup guard that restarts protection if someone kills it.",
        limit: "It is the priciest plan — built for businesses that live off the site. Movie-level hackers (rootkits) nobody serious promises to block.",
      },
    },
    cta: {
      basic: "I want Basic — chat on WhatsApp",
      essencial: "I want Essencial — chat on WhatsApp",
      full: "I want Full — chat on WhatsApp",
    },
    waHelpTitle: "Still unsure about the prices?",
    waHelpText: "Message me on WhatsApp: I'll explain the plans in plain words, answer your questions and help you choose. Zero commitment.",
    waHelpBtn: "Chat now on WhatsApp",
    waHelpNote: "+351 963 024 931 — quick replies",
    waPlanMsg: "Hi! I saw the ATHA Security website and want to know more about the {plan} plan — {price}.",
    waGenericMsg: "Hi! I saw the ATHA Security website and want to know more about plans and pricing.",
    aria: "Plans and pricing",
    features: {
      manual_scan: "Virus hunt on your site (23 known types)",
      baseline_verify: "Checks if anyone touched what they shouldn't",
      canary_manual: "Decoy traps to catch intruders (manual check)",
      drift_manual: "Report of what changed on your site",
      email_support: "Help by email",
      watcher_rt: "24/7 watcher — repairs itself in seconds",
      auto_quarantine: "Puts viruses in quarantine on its own",
      canary_rt: "Traps that alert you right away",
      sealed_state: "Attack evidence locked tight",
      honeypot_ipban: "Trap for the hacker + bans their IP",
      watchdog: "Guard for the guard — protection never dies",
      stealth_mode: "Invisible defense — the hacker can't see it",
      offhost_baseline: "Backup key stored off-site",
      managed_report: "Monthly attack report, plain and simple",
      direct_support: "Priority support, cuts the line",
    },
    footnote:
      "Examining your site is free in every plan — you don't even need to pay. What you pay for is the 24/7 protection.",
  },

  ctaband: {
    aria: "Get in touch with ATHA",
    h2: "Bringing security closer to the way you build.",
    ctaPrimary: "Talk to ATHA",
    ctaSecondary: "Explore the system",
  },

  faq: {
    tag: "FAQ",
    h2a: "Questions,",
    h2b: "answered.",
    items: [
      {
        q: "What is ATHA Security?",
        a: "ATHA is a coordinated security system built around specialized agents that detect, analyze, respond to and verify security events. It is designed as a layer that brings structure, observability and controlled automation to the way software teams handle security.",
      },
      {
        q: "Who is ATHA built for?",
        a: "ATHA is designed for teams that build software quickly — especially with AI tooling — and still want to take security seriously: developers, startups, SaaS builders, agencies and engineering teams that need a security layer without hiring an entire security department from day one.",
      },
      {
        q: "How does the multi-agent architecture work?",
        a: "Instead of one monolithic tool, ATHA distributes security work across specialized agents — detection, analysis, response, verification and more. Agents share context through a coordinated system: detection informs analysis, analysis shapes response, and every response is verified and documented.",
      },
      {
        q: "Does ATHA replace existing security tools?",
        a: "No. ATHA is designed to complement and coordinate security processes, not necessarily to replace every tool you already use. It aims to bring structure and shared context around the tooling and workflows you already have.",
      },
      {
        q: "Can teams control automated actions?",
        a: "Yes. The system is designed so that sensitive operations can require authorization and remain subject to safeguards. Teams define what agents are allowed to do, and automation stays within those permissions.",
      },
      {
        q: "How does ATHA handle sensitive operations?",
        a: "Sensitive operations follow core security principles: least privilege, auditability, human oversight, fail-safe design and traceable actions. Important steps are recorded and can be reviewed.",
      },
      {
        q: "Is ATHA available today?",
        a: "ATHA is a product in active development. The architecture, agents and interface shown here represent the current direction of the project — not a commercially available release yet. If you want to follow its progress or talk to the team, reach out.",
      },
    ],
  },

  final: {
    line1: "The software we build is changing.",
    line2: "Security should change with it.",
    h2: "The future of cybersecurity.",
    cta: "Talk to us",
    formTag: "GET IN TOUCH",
    formH2: "Talk to the team.",
    formP: "Tell us about your team and what you are building — we will get back to you.",
    name: "NAME",
    email: "WORK EMAIL",
    message: "MESSAGE",
    namePlaceholder: "Ada Lovelace",
    emailPlaceholder: "you@company.com",
    messagePlaceholder: "Tell us about your team and what you're building.",
    send: "Talk to us",
    sending: "Sending…",
    sentH: "Message received.",
    sentP: "Thank you for reaching out. The ATHA team will review your message and get back to you.",
    genericError: "Something went wrong. Please try again.",
    staticNote:
      "This site is served statically — the button opens your email app with the message pre-filled for the ATHA team.",
    formAria: "Contact form",
  },

  footer: {
    blurb: "Security infrastructure for the next generation of software.",
    devStatus: "PRODUCT IN ACTIVE DEVELOPMENT",
    navigate: "NAVIGATE",
    company: "COMPANY",
    productLinks: [
      { href: "#product", label: "Product" },
      { href: "#technology", label: "Technology" },
      { href: "#security", label: "Security" },
      { href: "#about", label: "About" },
    ],
    companyLinks: [
      { href: "#contact", label: "Contact" },
      { href: "#faq", label: "FAQ" },
    ],
    privacy: "Privacy",
    terms: "Terms",
    atLaunch: "Available at launch",
    rights: "ATHA Security. All rights reserved.",
    builtWith: "Built with care — and with security in mind.",
  },
};

export type Copy = typeof en;
