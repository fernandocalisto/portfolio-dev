import type {
  ProfileData,
  ProjectId,
  ProjectSpec,
  SkillSpec,
  TimelineSpec,
} from './types';

export const PROFILE: ProfileData = {
  fullName: 'Fernando Henrique Braga Calisto',
  shortName: 'Fernando Calisto',
  role: {
    pt: 'Desenvolvedor Full-Stack, Arquiteto de Software & Engenheiro de IA',
    en: 'Full-Stack Developer, Software Architect & AI Engineer',
  },
  education: {
    pt: 'Graduando em Engenharia da Computação',
    en: 'B.Sc. Candidate in Computer Engineering',
  },
  location: {
    pt: 'Araçatuba — SP, Brasil (Remoto & Híbrido)',
    en: 'Araçatuba — SP, Brazil (Remote & Hybrid)',
  },
  availability: {
    pt: 'Disponível para projetos B2B & oportunidades remotas',
    en: 'Available for B2B projects & remote roles',
  },
  email: 'fernandocalisto.dev@gmail.com',
  github: 'https://github.com/fernandocalisto',
  linkedin: 'https://www.linkedin.com/in/fernando-henrique-braga-calisto-34a703350/',
  siteUrl: 'https://fernandocalisto.com.br',
  portrait: '/assets/profile.webp',
};

export const PROJECT_IDS: readonly ProjectId[] = [
  'talos',
  'drakon',
  'ai-ecosystem',
  'jasper',
  'panoptes',
];

export const PROJECTS: readonly ProjectSpec[] = [
  {
    id: 'talos',
    shortName: 'TALOS',
    title: {
      pt: 'TALOS — Automação Empresarial & IA',
      en: 'TALOS — Enterprise Automation & AI',
    },
    subtitle: {
      pt: 'Soluções B2B Customizadas & Agentes Autônomos',
      en: 'Custom B2B Solutions & Autonomous AI Agents',
    },
    role: {
      pt: 'Fundador & Tech Lead Full-Stack',
      en: 'Founder & Full-Stack Tech Lead',
    },
    category: 'startup',
    tag: {
      pt: 'Startup B2B',
      en: 'B2B Startup',
    },
    accentColor: '#D4722C',
    badgeTextColor: '#F4A261',
    logo: '/assets/talos-logo.webp',
    summary: {
      pt: 'Arquitetura e desenvolvimento de soluções tecnológicas sob medida para empresas que buscam escala operacional por meio de automação de processos complexos e agentes autônomos de IA.',
      en: 'Custom software architecture and engineering for companies seeking operational scale through complex workflow automation and autonomous AI agents.',
    },
    challenge: {
      pt: 'Empresas perdem centenas de horas em tarefas manuais, reconciliações repetitivas e comunicação descentralizada, elevando custos operacionais e riscos de erro humano.',
      en: 'Organizations lose hundreds of hours to manual workflows, repetitive reconciliations and fragmented communication, driving up costs and human error.',
    },
    architecture: [
      {
        pt: 'Pipelines assíncronos orientados a eventos conectando bancos relacionais e APIs de parceiros',
        en: 'Asynchronous event-driven pipelines connecting relational databases and partner APIs',
      },
      {
        pt: 'Orquestração de Agentes LLM com memória de contexto e ferramentas (Tool Calling)',
        en: 'LLM Agent orchestration with contextual memory and deterministic Tool Calling',
      },
      {
        pt: 'Painéis administrativos em React + TypeScript com telemetria operacional em tempo real',
        en: 'React + TypeScript operations dashboards with real-time execution telemetry',
      },
    ],
    techStack: ['Java Spring Boot', 'Python', 'React', 'n8n', 'PostgreSQL', 'Docker', 'LLMs'],
    skillIds: ['spring', 'python', 'react', 'typescript', 'ai-automation', 'postgres', 'docker', 'rest-apis'],
    metrics: [
      {
        pt: 'Redução de até 70% no tempo de processamento manual em fluxos corporativos',
        en: 'Up to 70% reduction in manual processing time across business workflows',
      },
      {
        pt: 'Integração multi-canal via webhooks e APIs RESTful seguras',
        en: 'Multi-channel integration through secure webhooks and RESTful APIs',
      },
      {
        pt: 'Arquitetura modular pronta para expansão sob demanda',
        en: 'Modular architecture engineered for on-demand horizontal growth',
      },
    ],
    featured: true,
    link: 'https://talos.fernandocalisto.com.br',
    orbit: { ringIndex: 0, radius: 2.35, speed: 0.24, initialAngle: 0.4, size: 0.145 },
    diagram: {
      viewBoxWidth: 680,
      viewBoxHeight: 220,
      nodes: [
        {
          id: 'ingest',
          label: { pt: 'Webhooks & APIs', en: 'Webhooks & APIs' },
          sublabel: { pt: 'ERP / CRM', en: 'ERP / CRM' },
          detail: {
            pt: 'Ingestão segura de eventos de ERPs, CRMs e canais de atendimento com validação de assinatura.',
            en: 'Secure ingestion of ERP, CRM and customer-channel events with signature verification.',
          },
          x: 78,
          y: 110,
          accent: 'teal',
        },
        {
          id: 'bus',
          label: { pt: 'Event Bus & n8n', en: 'Event Bus & n8n' },
          sublabel: { pt: 'Filas Assíncronas', en: 'Async Queues' },
          detail: {
            pt: 'Roteamento assíncrono tolerante a falhas com reprocessamento automático e controle de concorrência.',
            en: 'Fault-tolerant async routing with automatic retries and concurrency control.',
          },
          x: 226,
          y: 110,
          accent: 'gold',
        },
        {
          id: 'agents',
          label: { pt: 'Agentes LLM', en: 'LLM Agents' },
          sublabel: { pt: 'Memória + Tools', en: 'Memory + Tools' },
          detail: {
            pt: 'Agentes autônomos com Tool Calling estruturado, memória persistente e guardrails de saída.',
            en: 'Autonomous agents with structured Tool Calling, persistent memory and output guardrails.',
          },
          x: 374,
          y: 62,
          accent: 'copper',
        },
        {
          id: 'core',
          label: { pt: 'Spring Boot + PG', en: 'Spring Boot + PG' },
          sublabel: { pt: 'Domínio & Dados', en: 'Domain & Data' },
          detail: {
            pt: 'Núcleo transacional em Java Spring Boot com persistência relacional íntegra em PostgreSQL.',
            en: 'Transactional core in Java Spring Boot backed by ACID relational persistence in PostgreSQL.',
          },
          x: 374,
          y: 158,
          accent: 'teal',
        },
        {
          id: 'dash',
          label: { pt: 'Dashboard React', en: 'React Dashboard' },
          sublabel: { pt: 'Telemetria Live', en: 'Live Telemetry' },
          detail: {
            pt: 'Interface executiva em React + TypeScript para auditoria de fluxos, SLAs e intervenção humana.',
            en: 'Executive React + TypeScript UI for workflow auditing, SLAs and human-in-the-loop review.',
          },
          x: 560,
          y: 110,
          accent: 'gold',
        },
      ],
      edges: [
        { from: 'ingest', to: 'bus' },
        { from: 'bus', to: 'agents' },
        { from: 'bus', to: 'core' },
        { from: 'agents', to: 'core' },
        { from: 'agents', to: 'dash' },
        { from: 'core', to: 'dash' },
      ],
    },
  },
  {
    id: 'drakon',
    shortName: 'DRAKON Code',
    title: {
      pt: 'DRAKON Code — Empresa Júnior',
      en: 'DRAKON Code — Junior Enterprise',
    },
    subtitle: {
      pt: 'Sistemas Sob Medida para Transformação Regional',
      en: 'Custom Software Systems for Regional Digitalization',
    },
    role: {
      pt: 'CEO & Arquiteto de Software',
      en: 'CEO & Software Architect',
    },
    category: 'enterprise',
    tag: {
      pt: 'Empresa Júnior',
      en: 'Junior Enterprise',
    },
    accentColor: '#D14338',
    badgeTextColor: '#F87171',
    logo: '/assets/drakon-logo.webp',
    summary: {
      pt: 'Liderança executiva e arquitetura de sistemas na empresa júnior de Engenharia da Computação, levando engenharia de padrão industrial a empresas regionais.',
      en: 'Executive leadership and software architecture at the Computer Engineering junior enterprise, delivering industrial-grade systems for regional businesses.',
    },
    challenge: {
      pt: 'Pequenos e médios negócios regionais com processos analógicos sem acesso a consultorias de software de alta qualidade a custos viáveis.',
      en: 'Regional SMBs running manual analog workflows without accessible, high-standard software engineering partners.',
    },
    architecture: [
      {
        pt: 'Clean Architecture e MVC em Spring Boot para manutenção sustentável por diferentes turmas de desenvolvedores',
        en: 'Clean Architecture and MVC in Spring Boot enabling sustainable maintenance across rotating student squads',
      },
      {
        pt: 'Deploy automatizado com containerização Docker e bancos PostgreSQL gerenciados em nuvem',
        en: 'Automated containerized deployments with Docker and cloud-managed PostgreSQL databases',
      },
      {
        pt: 'Governança de engenharia com code review rigoroso e esteira CI/CD no GitHub',
        en: 'Engineering governance via strict code reviews and automated GitHub CI/CD pipelines',
      },
    ],
    techStack: ['Java', 'Spring Boot', 'TypeScript', 'React', 'PostgreSQL', 'Git / GitHub CI'],
    skillIds: ['spring', 'typescript', 'react', 'tailwind', 'postgres', 'docker', 'git-ci', 'rest-apis'],
    metrics: [
      {
        pt: 'Liderança de equipe multidisciplinar de desenvolvedores e gerentes de produto',
        en: 'Leadership of a multidisciplinary team of engineers and product managers',
      },
      {
        pt: 'Múltiplos sistemas entregues em produção com alta satisfação de clientes locais',
        en: 'Multiple production systems delivered with high local client satisfaction',
      },
      {
        pt: 'Formação prática contínua de novos talentos de Engenharia da Computação',
        en: 'Continuous hands-on mentorship for emerging Computer Engineering talent',
      },
    ],
    featured: true,
    link: 'https://www.linkedin.com/company/drakon-code',
    orbit: { ringIndex: 1, radius: 2.95, speed: 0.19, initialAngle: 2.1, size: 0.135 },
    diagram: {
      viewBoxWidth: 680,
      viewBoxHeight: 220,
      nodes: [
        {
          id: 'discovery',
          label: { pt: 'Descoberta & Escopo', en: 'Discovery & Scope' },
          sublabel: { pt: 'Produto', en: 'Product' },
          detail: {
            pt: 'Mapeamento de processos do cliente regional, requisitos funcionais e modelagem de domínio.',
            en: 'Regional client workflow mapping, functional requirements and domain modeling.',
          },
          x: 88,
          y: 110,
          accent: 'gold',
        },
        {
          id: 'backend',
          label: { pt: 'Spring Boot Core', en: 'Spring Boot Core' },
          sublabel: { pt: 'Clean Architecture', en: 'Clean Architecture' },
          detail: {
            pt: 'Camadas isoladas de domínio, casos de uso e adaptadores REST para fácil onboarding de novos membros.',
            en: 'Isolated domain, use-case and REST adapter layers for smooth team onboarding.',
          },
          x: 264,
          y: 62,
          accent: 'crimson',
        },
        {
          id: 'frontend',
          label: { pt: 'React + TypeScript', en: 'React + TypeScript' },
          sublabel: { pt: 'Design System', en: 'Design System' },
          detail: {
            pt: 'Interfaces responsivas fortemente tipadas com componentes reutilizáveis e foco em usabilidade.',
            en: 'Strongly typed responsive interfaces built with reusable components and clarity.',
          },
          x: 264,
          y: 158,
          accent: 'teal',
        },
        {
          id: 'cicd',
          label: { pt: 'GitHub CI/CD', en: 'GitHub CI/CD' },
          sublabel: { pt: 'Review + Testes', en: 'Review + Tests' },
          detail: {
            pt: 'Code review obrigatório, lint, build automatizado e validação antes de cada release.',
            en: 'Mandatory code reviews, linting, automated builds and checks on every release.',
          },
          x: 446,
          y: 110,
          accent: 'gold',
        },
        {
          id: 'cloud',
          label: { pt: 'Docker + Cloud DB', en: 'Docker + Cloud DB' },
          sublabel: { pt: 'Produção', en: 'Production' },
          detail: {
            pt: 'Containers padronizados e PostgreSQL gerenciado com backups automáticos e observabilidade.',
            en: 'Standardized containers and managed PostgreSQL with automated backups and monitoring.',
          },
          x: 598,
          y: 110,
          accent: 'teal',
        },
      ],
      edges: [
        { from: 'discovery', to: 'backend' },
        { from: 'discovery', to: 'frontend' },
        { from: 'backend', to: 'cicd' },
        { from: 'frontend', to: 'cicd' },
        { from: 'cicd', to: 'cloud' },
      ],
    },
  },
  {
    id: 'ai-ecosystem',
    shortName: 'AI Pipelines',
    title: {
      pt: 'Ecossistemas de Automação & IA',
      en: 'AI & Automation Ecosystems',
    },
    subtitle: {
      pt: 'Pipelines Inteligentes, n8n & Orquestração de APIs',
      en: 'Intelligent Pipelines, n8n & API Orchestration',
    },
    role: {
      pt: 'Engenheiro de IA & Automação',
      en: 'AI & Automation Engineer',
    },
    category: 'ai',
    tag: {
      pt: 'AI-First',
      en: 'AI-First',
    },
    accentColor: '#185B63',
    badgeTextColor: '#38B2AC',
    logo: '/assets/ai-logo.webp',
    summary: {
      pt: 'Pipelines autônomos integrando APIs corporativas, serviços em Python/FastAPI, fluxos n8n e LLMs para extração estruturada de dados, relatórios executivos e roteamento inteligente.',
      en: 'Autonomous pipelines connecting enterprise APIs, Python/FastAPI workers, n8n workflows and LLMs for structured data extraction, executive reports and smart routing.',
    },
    challenge: {
      pt: 'Sistemas legados desconectados que não trocam informações entre si, criando silos de dados e lentidão na tomada de decisão.',
      en: 'Disconnected legacy systems creating data silos and delaying strategic decision-making.',
    },
    architecture: [
      {
        pt: 'Workers assíncronos em Python + FastAPI para ingestão, limpeza e normalização de payloads heterogêneos',
        en: 'Async Python + FastAPI workers for ingestion, cleaning and normalization of heterogeneous payloads',
      },
      {
        pt: 'Webhooks bidirecionais orquestrados via n8n integrando CRM, ERP e mensageria',
        en: 'Bidirectional webhooks orchestrated through n8n bridging CRM, ERP and messaging',
      },
      {
        pt: 'Camada de extração com JSON Schema estrito sobre APIs OpenAI, Claude e Gemini',
        en: 'Strict JSON Schema extraction layer over OpenAI, Claude and Gemini APIs',
      },
    ],
    techStack: ['Python', 'FastAPI', 'n8n', 'OpenAI / Claude APIs', 'REST APIs', 'JSON Schema'],
    skillIds: ['python', 'fastapi', 'ai-automation', 'node', 'rest-apis'],
    metrics: [
      {
        pt: 'Execução 24/7 com tolerância a falhas e reprocessamento automático de erros',
        en: '24/7 fault-tolerant execution with automated dead-letter retries',
      },
      {
        pt: 'Geração automatizada de relatórios analíticos estratégicos para diretoria',
        en: 'Automated generation of executive analytical reports',
      },
      {
        pt: 'Consistência de dados em tempo real entre CRM, ERP e atendimento',
        en: 'Real-time data consistency across CRM, ERP and support channels',
      },
    ],
    featured: true,
    link: 'https://github.com/fernandocalisto',
    orbit: { ringIndex: 2, radius: 3.45, speed: 0.15, initialAngle: 3.7, size: 0.13 },
    diagram: {
      viewBoxWidth: 680,
      viewBoxHeight: 220,
      nodes: [
        {
          id: 'legacy',
          label: { pt: 'CRM / ERP Legados', en: 'Legacy CRM / ERP' },
          sublabel: { pt: 'Silos de Dados', en: 'Data Silos' },
          detail: {
            pt: 'Fontes heterogêneas (planilhas, APIs legadas e webhooks) unificadas em um fluxo contínuo.',
            en: 'Heterogeneous data sources unified into a single continuous event stream.',
          },
          x: 84,
          y: 110,
          accent: 'teal',
        },
        {
          id: 'workers',
          label: { pt: 'Python + FastAPI', en: 'Python + FastAPI' },
          sublabel: { pt: 'Sanitização', en: 'Sanitization' },
          detail: {
            pt: 'Microserviços assíncronos que higienizam, deduplicam e validam contratos JSON Schema.',
            en: 'Async microservices cleaning, deduplicating and enforcing JSON Schema contracts.',
          },
          x: 252,
          y: 110,
          accent: 'gold',
        },
        {
          id: 'llm',
          label: { pt: 'Roteador LLM', en: 'LLM Router' },
          sublabel: { pt: 'OpenAI / Claude', en: 'OpenAI / Claude' },
          detail: {
            pt: 'Classificação semântica, resumo executivo e extração estruturada com fallback entre modelos.',
            en: 'Semantic classification, executive summarization and structured extraction with model fallback.',
          },
          x: 422,
          y: 66,
          accent: 'copper',
        },
        {
          id: 'n8n',
          label: { pt: 'Orquestração n8n', en: 'n8n Orchestrator' },
          sublabel: { pt: 'Retries 24/7', en: '24/7 Retries' },
          detail: {
            pt: 'Disparo resiliente de ações, alertas operacionais e sincronização bidirecional.',
            en: 'Resilient action dispatch, operational alerts and bidirectional synchronization.',
          },
          x: 422,
          y: 156,
          accent: 'teal',
        },
        {
          id: 'output',
          label: { pt: 'Relatórios & Ações', en: 'Reports & Actions' },
          sublabel: { pt: 'Tempo Real', en: 'Real-Time' },
          detail: {
            pt: 'Entrega automática de dashboards, relatórios estratégicos e atualizações sincronizadas.',
            en: 'Automated delivery of strategic briefings and synchronized operational updates.',
          },
          x: 594,
          y: 110,
          accent: 'gold',
        },
      ],
      edges: [
        { from: 'legacy', to: 'workers' },
        { from: 'workers', to: 'llm' },
        { from: 'workers', to: 'n8n' },
        { from: 'llm', to: 'n8n' },
        { from: 'llm', to: 'output' },
        { from: 'n8n', to: 'output' },
      ],
    },
  },
  {
    id: 'jasper',
    shortName: 'JasperReports',
    title: {
      pt: 'JasperReports Developer Tools',
      en: 'JasperReports Developer Tools',
    },
    subtitle: {
      pt: 'Extensão VS Code para Relatórios Corporativos',
      en: 'VS Code Extension for Enterprise Reporting',
    },
    role: {
      pt: 'Autor & Desenvolvedor',
      en: 'Author & Creator',
    },
    category: 'devtool',
    tag: {
      pt: 'VS Code Extension',
      en: 'VS Code Extension',
    },
    accentColor: '#1E6FA8',
    badgeTextColor: '#60A5FA',
    logo: '/assets/jasper-logo.webp',
    summary: {
      pt: 'Extensão leve para VS Code que substitui o pesado Jaspersoft Studio — edição nativa de .jrxml, preview PDF em tempo real, integração direta com bancos de dados e deploy no JasperServer sem processos em background.',
      en: 'Lightweight VS Code extension replacing heavyweight Jaspersoft Studio — native .jrxml editing, live PDF preview, direct database inspection and JasperServer deploy with zero background daemons.',
    },
    challenge: {
      pt: 'O Jaspersoft Studio (baseado em Eclipse) consome memória excessiva, trava com frequência e exige serviços pesados apenas para compilar relatórios em ambientes corporativos e hospitalares.',
      en: 'Eclipse-based Jaspersoft Studio consumes excessive RAM, freezes often and demands heavy runtime services just to compile reports in enterprise and healthcare teams.',
    },
    architecture: [
      {
        pt: 'Arquitetura Zero-Daemon: engine Java compila sob demanda e encerra imediatamente, sem processos residentes',
        en: 'Zero-Daemon architecture: Java compiler spawns on demand and exits cleanly with zero idle RAM footprint',
      },
      {
        pt: 'Credenciais isoladas no keyring nativo do sistema operacional via VS Code SecretStorage',
        en: 'Database and server credentials isolated in the OS keyring via VS Code SecretStorage',
      },
      {
        pt: 'Preview PDF.js com live reload, inspetor de campos SQL e autocomplete para $F{}, $P{} e $V{}',
        en: 'PDF.js live-reload preview, SQL field inspector and intelligent autocomplete for $F{}, $P{} and $V{}',
      },
    ],
    techStack: ['TypeScript', 'Node.js', 'Java', 'JasperReports 6.21', 'PostgreSQL', 'Oracle', 'VS Code API'],
    skillIds: ['typescript', 'node', 'spring', 'postgres', 'vscode-api', 'git-ci'],
    metrics: [
      {
        pt: 'Publicado no VS Code Marketplace com suporte a PostgreSQL, Oracle e drivers JDBC customizados',
        en: 'Published on the VS Code Marketplace supporting PostgreSQL, Oracle and custom JDBC drivers',
      },
      {
        pt: 'Compilação e preview instantâneo sem servidor — exige apenas Java 11+ no PATH',
        en: 'Serverless local report compilation and preview requiring only Java 11+ on PATH',
      },
      {
        pt: 'Integração REST v2 nativa com JasperServer para versionamento e deploy',
        en: 'Native JasperServer REST v2 integration for report deployment and management',
      },
    ],
    featured: true,
    link: 'https://marketplace.visualstudio.com/items?itemName=fernandocalisto.jasper-reports-tools',
    orbit: { ringIndex: 0, radius: 2.35, speed: 0.24, initialAngle: 3.54, size: 0.13 },
    diagram: {
      viewBoxWidth: 680,
      viewBoxHeight: 220,
      nodes: [
        {
          id: 'editor',
          label: { pt: 'VS Code Editor', en: 'VS Code Editor' },
          sublabel: { pt: '.jrxml + LSP', en: '.jrxml + LSP' },
          detail: {
            pt: 'Snippets, inspeção de SQL e autocomplete inteligente para expressões $F{}, $P{} e $V{}.',
            en: 'Snippets, SQL field inspection and smart autocomplete for $F{}, $P{} and $V{} expressions.',
          },
          x: 84,
          y: 110,
          accent: 'blue',
        },
        {
          id: 'compiler',
          label: { pt: 'Zero-Daemon Java', en: 'Zero-Daemon Java' },
          sublabel: { pt: 'Compila Sob Demanda', en: 'On-Demand Engine' },
          detail: {
            pt: 'Processo Java efêmero compila o relatório via JasperReports 6.21 e libera 100% da RAM ao finalizar.',
            en: 'Ephemeral Java process compiles via JasperReports 6.21 and frees 100% of RAM on exit.',
          },
          x: 266,
          y: 110,
          accent: 'gold',
        },
        {
          id: 'preview',
          label: { pt: 'Preview PDF.js', en: 'PDF.js Preview' },
          sublabel: { pt: 'Live Reload', en: 'Live Reload' },
          detail: {
            pt: 'Webview integrada no VS Code atualizando o PDF renderizado a cada salvamento do arquivo.',
            en: 'Integrated VS Code webview refreshing the rendered PDF on every save.',
          },
          x: 454,
          y: 64,
          accent: 'teal',
        },
        {
          id: 'secrets',
          label: { pt: 'SecretStorage', en: 'SecretStorage' },
          sublabel: { pt: 'OS Keyring', en: 'OS Keyring' },
          detail: {
            pt: 'Credenciais JDBC e tokens criptografados no cofre nativo do Windows, macOS ou Linux.',
            en: 'JDBC credentials and tokens encrypted inside the native OS keychain.',
          },
          x: 454,
          y: 158,
          accent: 'copper',
        },
        {
          id: 'targets',
          label: { pt: 'DB & JasperServer', en: 'DB & JasperServer' },
          sublabel: { pt: 'PG / Oracle / REST v2', en: 'PG / Oracle / REST v2' },
          detail: {
            pt: 'Consultas diretas em PostgreSQL/Oracle e deploy autenticado via API REST v2 do JasperServer.',
            en: 'Direct PostgreSQL/Oracle queries and authenticated deploy via JasperServer REST v2.',
          },
          x: 602,
          y: 110,
          accent: 'blue',
        },
      ],
      edges: [
        { from: 'editor', to: 'compiler' },
        { from: 'compiler', to: 'preview' },
        { from: 'compiler', to: 'secrets' },
        { from: 'secrets', to: 'targets' },
        { from: 'compiler', to: 'targets' },
      ],
    },
  },
  {
    id: 'panoptes',
    shortName: 'PANOPTES',
    title: {
      pt: 'PANOPTES — Inteligência Forense & Visão Computacional',
      en: 'PANOPTES — Forensic Intelligence & Computer Vision',
    },
    subtitle: {
      pt: 'Triagem de Vídeos Air-Gapped, Query-by-Image & Cadeia de Custódia',
      en: 'Air-Gapped Video Triage, Query-by-Image & Chain of Custody',
    },
    role: {
      pt: 'Arquiteto de Software & Visão Computacional',
      en: 'Software & Computer Vision Architect',
    },
    category: 'ai',
    tag: {
      pt: 'Visão & Forense',
      en: 'Vision & Forensics',
    },
    accentColor: '#C59538',
    badgeTextColor: '#E5B85B',
    logo: '/assets/panoptes-logo.webp',
    summary: {
      pt: 'Plataforma forense 100% offline (air-gapped) inspirada em Argos Panoptes para triagem ultrarrápida de vídeos em CPU, seleção de "Frames Quentes", busca multimodal por imagem e cadeia de custódia criptográfica imutável.',
      en: '100% offline (air-gapped) forensic platform inspired by Argus Panoptes for CPU-first video triage, Hot Frame selection, multimodal Query-by-Image search and immutable cryptographic chain of custody.',
    },
    challenge: {
      pt: 'Investigações periciais exigem analisar horas de vídeo em máquinas isoladas da internet e sem GPUs dedicadas, onde rodar modelos pesados frame a frame torna a operação inviável.',
      en: 'Forensic investigations require triaging hours of footage on air-gapped CPU-only machines where frame-by-frame deep inference is prohibitively slow.',
    },
    architecture: [
      {
        pt: 'Funil em cascata de 3 estágios (< 1 ms/frame) via luminância, variância do Laplaciano (nitidez), histograma HSV e distância de Hamming (dHash) antes do Hotness Score semântico',
        en: '3-stage cascade funnel (< 1 ms/frame) using luminance, Laplacian sharpness, HSV histograms and dHash Hamming distance before lightweight semantic Hotness Scoring',
      },
      {
        pt: 'Motor Query-by-Image multimodal combinando hashes perceptuais (pHash/dHash), assinaturas estruturais/faciais e grafos de correlação entre casos (NetworkX)',
        en: 'Multimodal Query-by-Image engine combining perceptual hashes (pHash/dHash), structural/facial signatures and cross-case correlation graphs (NetworkX)',
      },
      {
        pt: 'Cadeia de custódia em SQLite (evidence.db) encadeada com SHA-256, validação Human-in-the-Loop e emissão automatizada de Laudo Pericial em PDF/JSON',
        en: 'Forensic chain of custody in SQLite (evidence.db) hash-chained with SHA-256, Human-in-the-Loop validation and automated PDF/JSON Forensic Report generation',
      },
    ],
    techStack: ['Python', 'OpenCV', 'NumPy / SciPy', 'NetworkX', 'SQLite (SHA-256)', 'Streamlit', 'ReportLab'],
    skillIds: ['python', 'opencv', 'ai-automation', 'postgres'],
    metrics: [
      {
        pt: 'Descarte automático de >90% dos frames redundantes ou borrados antes da extração profunda em CPU',
        en: 'Automatic discard of >90% redundant or blurred frames before deep CPU extraction',
      },
      {
        pt: 'Operação 100% local (air-gapped) com auditoria criptográfica de integridade SHA-256',
        en: '100% local air-gapped operation with SHA-256 cryptographic integrity verification',
      },
      {
        pt: 'Busca ativa Query-by-Image com ranqueamento explicável por cena, objetos, rosto e hash perceptual',
        en: 'Explainable Query-by-Image ranking across scene, objects, face/pose and perceptual hash',
      },
    ],
    featured: true,
    orbit: { ringIndex: 1, radius: 2.95, speed: 0.19, initialAngle: 5.2, size: 0.14 },
    diagram: {
      viewBoxWidth: 680,
      viewBoxHeight: 220,
      nodes: [
        {
          id: 'video',
          label: { pt: 'Vídeo Air-Gapped', en: 'Air-Gapped Video' },
          sublabel: { pt: '100% Local / CPU', en: '100% Local / CPU' },
          detail: {
            pt: 'Ingestão forense local sem rede externa, preservando hash original da mídia de entrada.',
            en: 'Offline forensic media ingestion preserving the original input cryptographic hash.',
          },
          x: 78,
          y: 110,
          accent: 'gold',
        },
        {
          id: 'funnel',
          label: { pt: 'Funil 3 Estágios', en: '3-Stage Funnel' },
          sublabel: { pt: '< 1 ms/frame', en: '< 1 ms/frame' },
          detail: {
            pt: 'Descarta >90% dos frames via luminância, nitidez Laplaciano, histograma HSV e dHash.',
            en: 'Discards >90% of frames via luminance, Laplacian sharpness, HSV histograms and dHash.',
          },
          x: 230,
          y: 110,
          accent: 'copper',
        },
        {
          id: 'qbi',
          label: { pt: 'Query-by-Image', en: 'Query-by-Image' },
          sublabel: { pt: 'Hot Frames + Grafos', en: 'Hot Frames + Graphs' },
          detail: {
            pt: 'Busca reversa multimodal e correlação de entidades entre múltiplos casos com NetworkX.',
            en: 'Multimodal reverse search and cross-case entity correlation using NetworkX graphs.',
          },
          x: 386,
          y: 64,
          accent: 'teal',
        },
        {
          id: 'custody',
          label: { pt: 'evidence.db', en: 'evidence.db' },
          sublabel: { pt: 'SQLite SHA-256', en: 'SQLite SHA-256' },
          detail: {
            pt: 'Log imutável encadeado criptograficamente registrando cada ação de validação humana.',
            en: 'Cryptographically chained immutable audit log recording every human validation step.',
          },
          x: 386,
          y: 158,
          accent: 'gold',
        },
        {
          id: 'report',
          label: { pt: 'Laudo Pericial', en: 'Forensic Report' },
          sublabel: { pt: 'PDF / JSON', en: 'PDF / JSON' },
          detail: {
            pt: 'Emissão determinística via ReportLab com evidências ranqueadas e provas de integridade.',
            en: 'Deterministic ReportLab output with ranked visual evidence and integrity proofs.',
          },
          x: 576,
          y: 110,
          accent: 'gold',
        },
      ],
      edges: [
        { from: 'video', to: 'funnel' },
        { from: 'funnel', to: 'qbi' },
        { from: 'funnel', to: 'custody' },
        { from: 'qbi', to: 'custody' },
        { from: 'qbi', to: 'report' },
        { from: 'custody', to: 'report' },
      ],
    },
  },
];

export const SKILLS: readonly SkillSpec[] = [
  {
    id: 'spring',
    name: 'Java Spring Boot',
    category: 'backend',
    categoryLabel: { pt: 'Backend & Arquitetura', en: 'Backend & Architecture' },
    icon: 'Cpu',
    color: '#38B2AC',
    projectIds: ['talos', 'drakon', 'jasper'],
    featured: true,
  },
  {
    id: 'react',
    name: 'React.js & Next.js',
    category: 'frontend',
    categoryLabel: { pt: 'Frontend Moderno', en: 'Modern Frontend' },
    icon: 'Layers',
    color: '#38B2AC',
    projectIds: ['talos', 'drakon'],
    featured: true,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    categoryLabel: { pt: 'Tipagem Estrita', en: 'Strict Typing' },
    icon: 'Code2',
    color: '#38B2AC',
    projectIds: ['talos', 'drakon', 'jasper'],
    featured: true,
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    categoryLabel: { pt: 'IA, Visão & Automação', en: 'AI, Vision & Automation' },
    icon: 'Terminal',
    color: '#C59538',
    projectIds: ['talos', 'ai-ecosystem', 'panoptes'],
    featured: true,
  },
  {
    id: 'ai-automation',
    name: 'IA & Automação (n8n, LLMs)',
    category: 'ai',
    categoryLabel: { pt: 'Pipelines AI-First', en: 'AI-First Pipelines' },
    icon: 'Bot',
    color: '#D4722C',
    projectIds: ['talos', 'ai-ecosystem', 'panoptes'],
    featured: true,
  },
  {
    id: 'opencv',
    name: 'OpenCV & Visão Computacional',
    category: 'ai',
    categoryLabel: { pt: 'Forense & CPU Vision', en: 'Forensics & CPU Vision' },
    icon: 'Eye',
    color: '#C59538',
    projectIds: ['panoptes'],
    featured: true,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL & SQL',
    category: 'database',
    categoryLabel: { pt: 'Bancos Relacionais', en: 'Relational Databases' },
    icon: 'Database',
    color: '#38B2AC',
    projectIds: ['talos', 'drakon', 'jasper', 'panoptes'],
    featured: true,
  },
  {
    id: 'node',
    name: 'Node.js & Express',
    category: 'backend',
    categoryLabel: { pt: 'APIs & Ferramentas', en: 'APIs & Tooling' },
    icon: 'Server',
    color: '#C59538',
    projectIds: ['jasper', 'ai-ecosystem'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    categoryLabel: { pt: 'Microserviços Python', en: 'Python Microservices' },
    icon: 'Zap',
    color: '#D4722C',
    projectIds: ['ai-ecosystem'],
  },
  {
    id: 'docker',
    name: 'Docker & Containers',
    category: 'backend',
    categoryLabel: { pt: 'DevOps & Deploy', en: 'DevOps & Deploy' },
    icon: 'Box',
    color: '#38B2AC',
    projectIds: ['talos', 'drakon'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    categoryLabel: { pt: 'Design Systems', en: 'Design Systems' },
    icon: 'Palette',
    color: '#C59538',
    projectIds: ['drakon'],
  },
  {
    id: 'rest-apis',
    name: 'Arquitetura REST & Microservices',
    category: 'backend',
    categoryLabel: { pt: 'Sistemas Distribuídos', en: 'Distributed Systems' },
    icon: 'Network',
    color: '#C59538',
    projectIds: ['talos', 'drakon', 'ai-ecosystem'],
  },
  {
    id: 'git-ci',
    name: 'Git & GitHub CI/CD',
    category: 'backend',
    categoryLabel: { pt: 'Governança & Entrega', en: 'Delivery & Governance' },
    icon: 'GitBranch',
    color: '#38B2AC',
    projectIds: ['drakon', 'jasper'],
  },
  {
    id: 'vscode-api',
    name: 'VS Code Extension API',
    category: 'frontend',
    categoryLabel: { pt: 'Developer Tooling', en: 'Developer Tooling' },
    icon: 'Puzzle',
    color: '#60A5FA',
    projectIds: ['jasper'],
  },
];

export const TIMELINE: readonly TimelineSpec[] = [
  {
    year: '2022',
    period: { pt: 'Início da Jornada', en: 'Beginning' },
    title: { pt: 'De Curioso a Programador', en: 'From Curiosity to Code' },
    tag: { pt: 'Fundamentos', en: 'Foundations' },
    desc: {
      pt: 'Aos 16 anos, transformei uma infância inteira de curiosidade por computadores e hardware nas minhas primeiras linhas de código e algoritmos estruturados.',
      en: 'At age 16, I turned a lifelong curiosity for computers and hardware into my first lines of code and structured algorithms.',
    },
    highlight: { pt: 'Lógica & Algoritmos', en: 'Logic & Algorithms' },
  },
  {
    year: '2023',
    period: { pt: 'Disciplina & Foco', en: 'Discipline & Focus' },
    title: { pt: 'Vida Dupla: Atleta e Desenvolvedor', en: 'Dual Track: Athlete & Developer' },
    tag: { pt: 'Resiliência', en: 'Resilience' },
    desc: {
      pt: 'Conciliei a rotina de alta exigência física e mental como atleta de alto rendimento com estudos diários e aprofundamento em engenharia de software.',
      en: 'Balanced the physical and mental demands of competitive athletics with daily software engineering studies.',
    },
    highlight: { pt: 'Alta Performance & Mindset', en: 'High Performance Mindset' },
  },
  {
    year: '2024',
    period: { pt: 'Formação Técnica', en: 'Academic Foundation' },
    title: { pt: 'A Base Acadêmica & Arquitetura', en: 'Engineering Foundations & Architecture' },
    tag: { pt: 'Engenharia', en: 'Engineering' },
    desc: {
      pt: 'Início da graduação em Engenharia da Computação, estruturando base matemática, estruturas de dados avançadas e sistemas operacionais para projetar software escalável.',
      en: 'Started Computer Engineering degree, building solid foundations in mathematics, advanced data structures and operating systems for scalable software.',
    },
    highlight: { pt: 'Eng. da Computação', en: 'Computer Engineering' },
  },
  {
    year: '2025',
    period: { pt: 'Validação de Mercado', en: 'Market Validation' },
    title: { pt: 'Primeiros Clientes & Automações', en: 'First Clients & Real Automations' },
    tag: { pt: 'Mercado Real', en: 'Real Market' },
    desc: {
      pt: 'Atuação prática e autônoma entregando soluções para clientes reais com scripts Python, interfaces modernas e automação de fluxos corporativos.',
      en: 'Delivered real-world client systems combining Python automation, modern interfaces and workflow orchestration.',
    },
    highlight: { pt: 'Python & Automações B2B', en: 'Python & B2B Automation' },
  },
  {
    year: '2026',
    period: { pt: 'Liderança & Inovação', en: 'Leadership & Innovation' },
    title: { pt: 'Empreendedorismo, TALOS e DRAKON', en: 'Entrepreneurship, TALOS & DRAKON' },
    tag: { pt: 'AI-First & CEO', en: 'AI-First & CEO' },
    desc: {
      pt: 'Fundação da startup TALOS focada em IA empresarial e liderança como CEO na EJ DRAKON Code, projetando arquiteturas completas com Spring Boot, React, Visão Computacional e Agentes de IA.',
      en: 'Founded B2B AI startup TALOS and took leadership as CEO at DRAKON Code, architecting end-to-end systems with Spring Boot, React, Computer Vision and AI Agents.',
    },
    highlight: { pt: 'Founder & CEO', en: 'Founder & CEO' },
  },
];

export function getProjectById(id: string): ProjectSpec | undefined {
  return PROJECTS.find((p) => p.id === id);
}
