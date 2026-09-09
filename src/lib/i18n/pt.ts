/**
 * PT-BR translation — must satisfy `Copy` (derived from the EN object),
 * so a missing/extra key or a mismatched list length breaks `tsc`.
 */

import type { Copy } from "./en";

export const pt: Copy = {
  nav: {
    links: [
      { href: "#technology", label: "Tecnologia" },
      { href: "#agents", label: "Agentes" },
      { href: "#workflow", label: "Fluxo" },
      { href: "#product", label: "Produto" },
      { href: "#plans", label: "Planos" },
      { href: "#faq", label: "FAQ" },
    ],
    talk: "Fale conosco",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },

  hero: {
    aria: "ATHA Security — introdução",
    h1a: "Segurança para o software",
    h1b: "que você constrói.",
    sub: "Um sistema de segurança coordenado, construído em torno de agentes especializados para detecção, análise, resposta e verificação.",
    ctaPrimary: "Conheça o ATHA",
    ctaSecondary: "Fale conosco",
    scrollHint: "ROLE",
  },

  problem: {
    tag: "O PROBLEMA",
    h2a: "A IA mudou o quão rápido construímos.",
    h2b: "A segurança precisa acompanhar.",
    p1: "As ferramentas de IA tornaram o desenvolvimento de software mais rápido e mais acessível do que em qualquer outro momento da história. Equipes pequenas agora entregam em semanas o que antes levava trimestres — estruturando funcionalidades, escrevendo testes, revisando código e publicando continuamente.",
    p2: "Mas velocidade não elimina o risco. Ela o multiplica. Cada versão acelerada ainda carrega as mesmas responsabilidades de qualquer outro software — e a segurança continua sendo a parte especializada e difícil que, com muita frequência, fica para depois.",
    quote:
      "O problema não é construir rápido. O problema é construir rápido sem uma camada dedicada de segurança.",
    risks: [
      {
        title: "Vulnerabilidades",
        text: "Código gerado com pressa ainda pode chegar ao público com falhas exploráveis.",
      },
      {
        title: "Configurações inseguras",
        text: "Padrões, chaves e permissões são fáceis de errar quando se tem pressa.",
      },
      {
        title: "Falhas não validadas",
        text: "Mudanças que nunca foram testadas contra modos reais de falha.",
      },
      {
        title: "Incidentes",
        text: "Velocidade encurta os ciclos de feedback — e as janelas de resposta a incidentes.",
      },
      {
        title: "Necessidade de monitoramento",
        text: "Sistemas precisam de observação contínua, não de checagens pontuais.",
      },
      {
        title: "Verificação",
        text: "Toda correção precisa ser verificada contra a realidade, não contra suposições.",
      },
    ],
  },

  arch: {
    tag: "A ABORDAGEM ATHA",
    h2a: "Um sistema. Agentes especializados.",
    h2b: "Defesa coordenada.",
    p: "O ATHA não é um scanner único nem um dashboard isolado. É uma camada coordenada em que agentes especializados compartilham contexto, dividem responsabilidades e agem sob salvaguardas compartilhadas — a detecção informa a análise, a análise molda a resposta, a resposta é verificada e gera aprendizado.",
    sceneAria:
      "Visualização interativa do núcleo do ATHA conectado a oito papéis especializados de agentes",
    hud1: "NÚCLEO ATHA — GRADE DE DEFESA COORDENADA",
    hud2: "8 PAPÉIS ESPECIALIZADOS",
    chipsAria: "Papéis dos agentes",
    nodes: [
      "DETECÇÃO",
      "ANÁLISE",
      "RESPOSTA",
      "VALIDAÇÃO",
      "INTEGRIDADE",
      "AUDITORIA",
      "RECUPERAÇÃO",
      "PROTEÇÃO",
    ],
    foot: "Uma arquitetura multi-agente coordenada — um sistema compartilhado, papéis especializados.",
  },

  agents: {
    tag: "OS AGENTES",
    h2a: "Agentes especializados.",
    h2b: "Responsabilidades claras.",
    p: "Cada agente é dono de uma responsabilidade específica de segurança — e trabalha como parte do mesmo sistema coordenado.",
    statusAria: "Status",
    items: [
      {
        name: "SCANNER",
        status: "ACTIVE",
        role: "DETECÇÃO",
        description: "Detecta possíveis problemas de segurança em ambientes permitidos.",
      },
      {
        name: "DETECTIVE",
        status: "ACTIVE",
        role: "ANÁLISE",
        description: "Analisa eventos de segurança e reconstrói linhas do tempo.",
      },
      {
        name: "BUILDER",
        status: "STANDBY",
        role: "REMEDIAÇÃO",
        description: "Ajuda a construir fluxos de remediação.",
      },
      {
        name: "VALIDATOR",
        status: "READY",
        role: "VERIFICAÇÃO",
        description: "Verifica se uma remediação realmente funciona.",
      },
      {
        name: "INTEGRITY",
        status: "ACTIVE",
        role: "MONITORAMENTO",
        description: "Monitora a integridade do sistema.",
      },
      {
        name: "GUARDIAN",
        status: "ACTIVE",
        role: "PROTEÇÃO",
        description: "Coordena respostas de proteção.",
      },
      {
        name: "AUDITOR",
        status: "READY",
        role: "RASTREABILIDADE",
        description: "Mantém a rastreabilidade de ações importantes.",
      },
      {
        name: "RECOVERY",
        status: "STANDBY",
        role: "RESTAURAÇÃO",
        description: "Ajuda a restaurar ambientes controlados após falhas.",
      },
    ],
    status: { ACTIVE: "ATIVO", READY: "PRONTO", STANDBY: "EM ESPERA" },
    foot: "As responsabilidades dos agentes refletem a direção atual do projeto — capacidades são introduzidas progressivamente e descritas exatamente como funcionam.",
  },

  how: {
    tag: "COMO FUNCIONA",
    h2a: "Do sinal à",
    h2b: "resolução.",
    steps: [
      {
        step: "DETECTAR",
        text: "Agentes observam ambientes permitidos em busca de sinais que merecem atenção.",
      },
      {
        step: "ANALISAR",
        text: "Eventos são examinados e reconstruídos em uma linha do tempo clara e factual.",
      },
      {
        step: "RESPONDER",
        text: "Ações coordenadas contêm o que precisa ser contido — sob salvaguardas.",
      },
      {
        step: "VERIFICAR",
        text: "As remediações são testadas contra a realidade. A correção funcionou de verdade?",
      },
      {
        step: "APRENDER",
        text: "Cada resolução fortalece o contexto para a próxima.",
      },
    ],
  },

  aibuilt: {
    tag: "SEGURANÇA PARA SOFTWARE FEITO COM IA",
    h2a: "Construa com IA.",
    h2b: "Proteja com o ATHA.",
    p1: "Equipes modernas já usam IA para estruturar funcionalidades, gerar testes, revisar código e acelerar entregas. Essa aceleração vale a pena ser mantida — ela não precisa superar a segurança.",
    p2: "O ATHA existe para que os dois avancem juntos: enquanto suas ferramentas aceleram a forma de construir, o ATHA adiciona uma camada dedicada de segurança e observabilidade ao redor do que você entrega — estruturada, coordenada e desenhada para ser verificada.",
    p3: "O ATHA foi desenhado para complementar o seu stack atual — adicionando uma camada coordenada de segurança, não substituindo o seu julgamento nem as suas ferramentas.",
    bridge: {
      fast: "CONSTRUA RÁPIDO",
      fastSub: "GUIADO POR IA",
      safe: "CONSTRUA COM SEGURANÇA",
      safeSub: "PROTEGIDO PELO ATHA",
    },
    practices: [
      {
        title: "Fluxos estruturados",
        text: "Processos de segurança rodam junto com o desenvolvimento rápido — não depois dele.",
      },
      {
        title: "Observado, analisado, documentado",
        text: "Eventos de segurança ganham contexto, linhas do tempo e resultados rastreáveis.",
      },
      {
        title: "Automação sob supervisão",
        text: "Automação controlada, com permissões — nunca solta.",
      },
    ],
  },

  workflow: {
    tag: "FLUXO",
    h2a: "Veja um evento se mover",
    h2b: "pelo ATHA.",
    timelineAria: "Linha do tempo dos sete estágios do fluxo do ATHA",
    stages: [
      {
        label: "APLICAÇÃO",
        text: "O software que a sua equipe entrega — web apps, APIs, serviços e produtos construídos com IA.",
      },
      {
        label: "ATHA",
        text: "Uma camada coordenada de segurança é aplicada em volta da aplicação.",
      },
      {
        label: "MÚLTIPLOS AGENTES",
        text: "Agentes especializados assumem posição ao redor do sistema, cada um com um papel claro.",
      },
      {
        label: "EVENTO",
        text: "Um sinal é detectado em um ambiente permitido e se torna um evento rastreado.",
      },
      {
        label: "ANÁLISE",
        text: "O evento é investigado e reconstruído em uma linha do tempo factual.",
      },
      {
        label: "RESPOSTA",
        text: "Uma ação coordenada é proposta e executada sob permissão e supervisão.",
      },
      {
        label: "VERIFICAÇÃO",
        text: "O resultado é verificado, documentado e gera aprendizado.",
      },
    ],
  },

  why: {
    tag: "POR QUE O ATHA",
    h2a: "Por que",
    h2b: "o ATHA?",
    p: "Não é só um scanner. Não é só um chatbot. Não é só um dashboard. É uma arquitetura coordenada de agentes com responsabilidades claras.",
    items: [
      {
        title: "Especializado",
        text: "Diferentes responsabilidades de segurança podem ser cuidadas por agentes especializados.",
      },
      {
        title: "Coordenado",
        text: "Os agentes se comunicam por meio de um sistema coordenado, em vez de operar como ferramentas isoladas.",
      },
      {
        title: "Observável",
        text: "Eventos, tarefas e ações de segurança podem ser acompanhados.",
      },
      {
        title: "Controlado",
        text: "Operações sensíveis podem exigir autorização e permanecem sujeitas às salvaguardas do sistema.",
      },
      {
        title: "Modular",
        text: "A arquitetura pode evoluir à medida que novos agentes e capacidades são introduzidos.",
      },
    ],
  },

  trust: {
    tag: "CONFIANÇA E PRINCÍPIOS DE SEGURANÇA",
    h2a: "Princípios de segurança,",
    h2b: "por design.",
    principles: [
      {
        title: "MENOR PRIVILÉGIO",
        text: "Os agentes operam com o acesso mínimo necessário para o seu papel.",
      },
      {
        title: "AUDITABILIDADE",
        text: "Ações importantes são registradas e podem ser revisadas.",
      },
      {
        title: "SUPERVISÃO HUMANA",
        text: "Pessoas participam das decisões que importam.",
      },
      {
        title: "DESIGN À PROVA DE FALHAS",
        text: "Quando algo dá errado, o sistema assume o padrão seguro.",
      },
      {
        title: "AÇÕES RASTREÁVEIS",
        text: "Cada passo automatizado pode ser rastreado até a sua origem.",
      },
      {
        title: "AUTOMAÇÃO CONTROLADA",
        text: "A automação age dentro das permissões — nunca além delas.",
      },
    ],
    foot: "Esses princípios guiam como a arquitetura do ATHA está sendo construída — automação com permissão, supervisão e um registro completo do que aconteceu.",
  },

  product: {
    tag: "PRODUTO",
    h2a: "Uma visão da sua",
    h2b: "postura de segurança.",
    p: "O console do ATHA mostra o que o sistema está fazendo num relance — agentes, eventos, integridade e o estado de cada resposta coordenada. Passe o mouse sobre um agente para inspecionar o papel dele.",
  },

  dash: {
    demoState: "ESTADO DE DEMO",
    coreAgents: "AGENTES PRINCIPAIS",
    registered: "Agentes registrados:",
    kpis: {
      systemStatus: "STATUS DO SISTEMA",
      online: "ONLINE",
      agents: "AGENTES",
      agentsValue: "71",
      events: "EVENTOS",
      active: "ATIVO",
      threats: "AMEAÇAS",
      monitored: "MONITORADO",
      integrity: "INTEGRIDADE",
      verified: "VERIFICADO",
    },
    stream: "FLUXO DE EVENTOS AO VIVO",
    events: [
      "Varredura programada do ambiente concluída — 0 bloqueios",
      "Sinal de reconhecimento marcado para análise no escopo permitido",
      "Linha do tempo do evento reconstruída — 3 nós",
      "Resposta de proteção proposta — aguardando autorização",
      "Verificação da remediação agendada",
      "Trilha de ações registrada — ID de rastreio anexado",
    ],
    listening: "ouvindo eventos",
    agent: "AGENTE",
    status: "STATUS",
    role: "PAPEL",
    taskLoad: "CARGA DE TAREFAS — ÚLTIMAS 24H",
    disclaimer:
      "Estado de demonstração — visualização da interface com um snapshot do sistema. Não são dados de produto ao vivo.",
  },

  audience: {
    tag: "PARA QUEM É",
    h2a: "Feito para a próxima geração",
    h2b: "de equipes de software.",
    p: "O ATHA foi desenhado para equipes que se movem rápido e ainda levam segurança a sério — sem precisar de um departamento de segurança desde o primeiro dia.",
    items: [
      {
        title: "DESENVOLVIMENTO COM IA",
        text: "Equipes que constroem com ferramentas de código e agentes de IA.",
      },
      {
        title: "STARTUPS",
        text: "Entregue rápido sem precisar montar um time de segurança do zero.",
      },
      {
        title: "SAAS",
        text: "Proteja produtos multi-tenant com fluxos estruturados.",
      },
      {
        title: "AGÊNCIAS",
        text: "Entregue projetos de clientes com uma camada de segurança incluída.",
      },
      {
        title: "TIMES DE ENGENHARIA",
        text: "Adicione observabilidade e controle a sistemas em crescimento.",
      },
    ],
    foot: "Conforme o produto amadurece, esta seção vai trazer histórias reais de equipes que constroem com o ATHA.",
  },

  plans: {
    tag: "PLANOS",
    h2a: "Planos e preços,",
    h2b: "sem complicação.",
    p: "Três planos, proteção de verdade em todos. Você escolhe quanto o ATHA trabalha por você — e o preço pode ser em Euro, Dólar ou Real: só tocar ali embaixo.",
    currencyLabel: "Moeda",
    currencyHint: "O preço aparece em Euro — toque pra trocar pra Dólar ou Real.",
    currencyNames: { EUR: "Euro", USD: "Dólar", BRL: "Real" },
    perMonth: "/mês",
    perYear: "/ano",
    annualOf: "ou",
    monthlyNoCommit: "cobrado mensalmente, sem fidelidade",
    sitesLabel: "protegido(s)",
    mostComplete: "MAIS COMPLETO",
    essentials: "Tudo do",
    plus: "mais:",
    bestLabel: "O que tem de bom",
    limitLabel: "O que ele NÃO faz",
    simple: {
      basic: "Você pede, ele examina: um raio-X do seu site quando você quiser.",
      essencial: "Fica de olho no seu site dia e noite — e conserta sozinho se mexerem nele.",
      full: "Vigia, conserta e ainda arma armadilhas pro hacker. O pacote completo.",
    },
    tiers: {
      basic: {
        best: "Caça vírus, confere se alguém mexeu no site, arma armadilhas e te entrega um relatório — tudo na hora que você pedir.",
        limit: "Não fica vigiando sozinho. Se algo acontecer entre uma checagem e outra, você só descobre na próxima checagem.",
      },
      essencial: {
        best: "Alguém mexe no seu site? Ele volta ao normal sozinho em segundos, o vírus vai pra quarentena na hora e as provas ficam trancadas a chave.",
        limit: "A defesa dá pra ser vista — um hacker bem preparado pode estudar como ela funciona antes de atacar.",
      },
      full: {
        best: "Tudo do Essencial, mais: armadilha que pega o hacker e bloqueia o IP dele, defesa invisível e um vigia reserva que religa a proteção se tentarem matar ela.",
        limit: "É o plano mais caro — feito pra quem vive do site. Hacker de filme (nível rootkit) ninguém sério promete bloquear.",
      },
    },
    cta: {
      basic: "Quero o Basic — chamar no WhatsApp",
      essencial: "Quero o Essencial — chamar no WhatsApp",
      full: "Quero o Full — chamar no WhatsApp",
    },
    waHelpTitle: "Ainda com dúvida nos preços?",
    waHelpText: "Me chama no WhatsApp: eu explico os planos do seu jeito, tiro suas dúvidas e te ajudo a escolher. Sem compromisso nenhum.",
    waHelpBtn: "Falar agora no WhatsApp",
    waHelpNote: "+351 963 024 931 — resposta rápida",
    waPlanMsg: "Olá! Vi o site da ATHA Security e quero saber mais sobre o plano {plan} — {price}.",
    waGenericMsg: "Olá! Vi o site da ATHA Security e quero saber mais sobre os planos e preços.",
    aria: "Planos e preços",
    features: {
      manual_scan: "Caça vírus no site (23 tipos conhecidos)",
      baseline_verify: "Confere se alguém mexeu onde não devia",
      canary_manual: "Armadilhas isca pra pegar intruso (checagem manual)",
      drift_manual: "Relatório do que mudou no site",
      email_support: "Ajuda por email",
      watcher_rt: "Vigia 24h — conserta sozinho em segundos",
      auto_quarantine: "Bota o vírus na quarentena sozinho",
      canary_rt: "Armadilhas que avisam na hora",
      sealed_state: "Provas do ataque trancadas a chave",
      honeypot_ipban: "Armadilha pro hacker + bloqueia o IP dele",
      watchdog: "Vigia do vigia — a proteção não morre",
      stealth_mode: "Defesa invisível — o hacker não enxerga",
      offhost_baseline: "Cópia da chave guardada fora de casa",
      managed_report: "Relatório mensal dos ataques, mastigado",
      direct_support: "Furo de fila no suporte",
    },
    footnote:
      "Examinar o seu site é de graça em qualquer plano — nem precisa pagar. O que se paga é a proteção 24h.",
  },

  ctaband: {
    aria: "Entre em contato com o ATHA",
    h2: "Aproximando a segurança da forma como você constrói.",
    ctaPrimary: "Fale com o ATHA",
    ctaSecondary: "Explorar o sistema",
  },

  faq: {
    tag: "FAQ",
    h2a: "Perguntas,",
    h2b: "respondidas.",
    items: [
      {
        q: "O que é o ATHA Security?",
        a: "O ATHA é um sistema de segurança coordenado, construído em torno de agentes especializados que detectam, analisam, respondem e verificam eventos de segurança. Ele foi desenhado como uma camada que traz estrutura, observabilidade e automação controlada à forma como as equipes de software lidam com segurança.",
      },
      {
        q: "Para quem o ATHA foi construído?",
        a: "O ATHA foi desenhado para equipes que constroem software com rapidez — especialmente com ferramentas de IA — e ainda querem levar segurança a sério: desenvolvedores, startups, criadores de SaaS, agências e times de engenharia que precisam de uma camada de segurança sem contratar um departamento inteiro desde o primeiro dia.",
      },
      {
        q: "Como funciona a arquitetura multi-agente?",
        a: "Em vez de uma ferramenta monolítica, o ATHA distribui o trabalho de segurança entre agentes especializados — detecção, análise, resposta, verificação e mais. Os agentes compartilham contexto por meio de um sistema coordenado: a detecção informa a análise, a análise molda a resposta, e cada resposta é verificada e documentada.",
      },
      {
        q: "O ATHA substitui as ferramentas de segurança existentes?",
        a: "Não. O ATHA foi desenhado para complementar e coordenar processos de segurança, não necessariamente para substituir cada ferramenta que você já usa. O objetivo é trazer estrutura e contexto compartilhado em volta das ferramentas e dos fluxos que você já tem.",
      },
      {
        q: "As equipes podem controlar as ações automatizadas?",
        a: "Sim. O sistema foi desenhado para que operações sensíveis possam exigir autorização e permaneçam sujeitas a salvaguardas. As equipes definem o que os agentes podem fazer, e a automação permanece dentro dessas permissões.",
      },
      {
        q: "Como o ATHA lida com operações sensíveis?",
        a: "Operações sensíveis seguem princípios essenciais de segurança: menor privilégio, auditabilidade, supervisão humana, design à prova de falhas e ações rastreáveis. Passos importantes são registrados e podem ser revisados.",
      },
      {
        q: "O ATHA está disponível hoje?",
        a: "O ATHA é um produto em desenvolvimento ativo. A arquitetura, os agentes e a interface mostrados aqui representam a direção atual do projeto — ainda não é um lançamento comercial. Se você quiser acompanhar o progresso ou falar com o time, entre em contato.",
      },
    ],
  },

  final: {
    line1: "O software que construímos está mudando.",
    line2: "A segurança deveria mudar junto.",
    h2: "O futuro da cibersegurança.",
    cta: "Fale conosco",
    formTag: "ENTRE EM CONTATO",
    formH2: "Fale com o time.",
    formP: "Conte sobre o seu time e o que você está construindo — nós vamos responder.",
    name: "NOME",
    email: "E-MAIL PROFISSIONAL",
    message: "MENSAGEM",
    namePlaceholder: "Ada Lovelace",
    emailPlaceholder: "voce@empresa.com",
    messagePlaceholder: "Conte sobre o seu time e o que você está construindo.",
    send: "Fale conosco",
    sending: "Enviando…",
    sentH: "Mensagem recebida.",
    sentP: "Obrigado pelo contato. O time do ATHA vai revisar a sua mensagem e responder.",
    genericError: "Algo deu errado. Tente novamente.",
    staticNote:
      "Este site é hospedado estaticamente — o botão abre seu aplicativo de e-mail com a mensagem pronta para o time do ATHA.",
    formAria: "Formulário de contato",
  },

  footer: {
    blurb: "Infraestrutura de segurança para a próxima geração de software.",
    devStatus: "PRODUTO EM DESENVOLVIMENTO ATIVO",
    navigate: "NAVEGAR",
    company: "EMPRESA",
    productLinks: [
      { href: "#product", label: "Produto" },
      { href: "#technology", label: "Tecnologia" },
      { href: "#security", label: "Segurança" },
      { href: "#about", label: "Sobre" },
    ],
    companyLinks: [
      { href: "#contact", label: "Contato" },
      { href: "#faq", label: "FAQ" },
    ],
    privacy: "Privacidade",
    terms: "Termos",
    atLaunch: "Disponível no lançamento",
    rights: "ATHA Security. Todos os direitos reservados.",
    builtWith: "Construído com cuidado — e com segurança em mente.",
  },
};
