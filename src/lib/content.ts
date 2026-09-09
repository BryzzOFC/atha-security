/** ATHA Security — site content. All copy follows strict no-claims guidelines:
 *  no invented clients, metrics, testimonials or absolute guarantees. */

export type Agent = {
  name: string;
  role: string;
  status: "ACTIVE" | "READY" | "STANDBY";
  description: string;
};

export const AGENTS: Agent[] = [
  {
    name: "SCANNER",
    role: "DETECTION",
    status: "ACTIVE",
    description: "Detects potential security issues in permitted environments.",
  },
  {
    name: "DETECTIVE",
    role: "ANALYSIS",
    status: "ACTIVE",
    description: "Analyzes security events and reconstructs timelines.",
  },
  {
    name: "BUILDER",
    role: "REMEDIATION",
    status: "STANDBY",
    description: "Helps construct remediation workflows.",
  },
  {
    name: "VALIDATOR",
    role: "VERIFICATION",
    status: "READY",
    description: "Checks whether a remediation actually works.",
  },
  {
    name: "INTEGRITY",
    role: "MONITORING",
    status: "ACTIVE",
    description: "Monitors system integrity.",
  },
  {
    name: "GUARDIAN",
    role: "PROTECTION",
    status: "ACTIVE",
    description: "Coordinates protective responses.",
  },
  {
    name: "AUDITOR",
    role: "TRACEABILITY",
    status: "READY",
    description: "Maintains traceability of important actions.",
  },
  {
    name: "RECOVERY",
    role: "RESTORATION",
    status: "STANDBY",
    description: "Helps restore controlled environments after failures.",
  },
];

export const ARCHITECTURE_NODES = [
  "DETECTION",
  "ANALYSIS",
  "RESPONSE",
  "VALIDATION",
  "INTEGRITY",
  "AUDIT",
  "RECOVERY",
  "PROTECTION",
] as const;

export const RISKS = [
  {
    icon: "bug",
    title: "Vulnerabilities",
    text: "Fast-generated code can still ship with exploitable weaknesses.",
  },
  {
    icon: "settings",
    title: "Insecure configurations",
    text: "Defaults, keys and permissions are easy to get wrong at speed.",
  },
  {
    icon: "alert",
    title: "Unvalidated failures",
    text: "Changes that were never tested against real failure modes.",
  },
  {
    icon: "siren",
    title: "Incidents",
    text: "Speed shortens feedback loops — and incident response windows.",
  },
  {
    icon: "radar",
    title: "Monitoring needs",
    text: "Systems need continuous observation, not one-time checks.",
  },
  {
    icon: "clipboard",
    title: "Verification",
    text: "Every fix needs to be verified against reality, not assumptions.",
  },
] as const;

export const HOW_IT_WORKS = [
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
] as const;

export const WORKFLOW_STAGES = [
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
] as const;

export const WHY_ATHA = [
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
] as const;

export const PRINCIPLES = [
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
] as const;

export const AUDIENCE = [
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
] as const;

export const FAQ_ITEMS = [
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
] as const;

export const DEMO_EVENTS = [
  { time: "14:32:07", agent: "SCANNER", level: "INFO", msg: "Scheduled environment scan completed — 0 blockers" },
  { time: "14:33:41", agent: "SCANNER", level: "FLAG", msg: "Recon signal flagged for analysis in permitted scope" },
  { time: "14:34:12", agent: "DETECTIVE", level: "INFO", msg: "Event timeline reconstructed — 3 nodes" },
  { time: "14:36:58", agent: "GUARDIAN", level: "ACTION", msg: "Protective response proposed — awaiting authorization" },
  { time: "14:38:20", agent: "VALIDATOR", level: "INFO", msg: "Remediation check scheduled" },
  { time: "14:41:03", agent: "AUDITOR", level: "INFO", msg: "Action trail recorded — trace ID attached" },
] as const;
