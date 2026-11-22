import type { ContactSubject, Locale, ScrollableSectionId } from '../../shared/types';

export interface TranslationDictionary {
  nav: {
    brandAria: string;
    links: Record<ScrollableSectionId, string>;
    cta: string;
    menuToggleAria: string;
    languageToggleAria: string;
  };
  hero: {
    availability: string;
    eyebrow: string;
    headlineFirst: string;
    headlineSecond: string;
    tagline: string;
    primaryCta: string;
    secondaryCta: string;
    orbitHint: string;
    scrollLabel: string;
    satelliteClickAria: (projectName: string) => string;
  };
  about: {
    sectionTitle: string;
    heading: string;
    bioParagraph1: string;
    bioParagraph2Prefix: string;
    bioParagraph2Middle: string;
    bioParagraph2Suffix: string;
    bioParagraph3: string;
    pillarTalosRole: string;
    pillarDrakonRole: string;
    pillarPerfTitle: string;
    pillarPerfSubtitle: string;
    emailAria: string;
    githubAria: string;
    linkedinAria: string;
  };
  timeline: {
    sectionTitle: string;
    rangeLabel: string;
    focusPrefix: string;
    prev: string;
    next: string;
    prevAria: string;
    nextAria: string;
    goToYearAria: (year: string) => string;
    stepOf: (current: number, total: number) => string;
    keyboardHint: string;
  };
  skills: {
    sectionTitle: string;
    subtitle: string;
    hint: string;
    categories: Record<'all' | 'backend' | 'frontend' | 'ai' | 'database', string>;
    usedInCount: (count: number) => string;
    activeFilterLabel: string;
    clearSelection: string;
  };
  projects: {
    sectionTitle: string;
    subtitle: string;
    categories: Record<'all' | 'startup' | 'enterprise' | 'ai' | 'devtool', string>;
    filteringBySkill: (skillName: string) => string;
    clearSkillFilter: string;
    emptyFilter: string;
    architectureCta: string;
    visitCta: string;
    contactCta: string;
  };
  modal: {
    closeAria: string;
    close: string;
    diagramTitle: string;
    diagramHint: string;
    challengeTitle: string;
    architectureTitle: string;
    stackTitle: string;
    metricsTitle: string;
    askDobby: string;
    visitProject: string;
    discussProject: string;
  };
  contact: {
    sectionTitle: string;
    heading: string;
    intro: string;
    emailLabel: string;
    copyEmail: string;
    copiedEmail: string;
    copiedToast: string;
    githubLabel: string;
    linkedinLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    emailFieldLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjects: Record<ContactSubject, string>;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    fillAllError: string;
    genericError: string;
    successMessage: (name: string) => string;
    projectPrefillMessage: (projectTitle: string) => string;
  };
  chat: {
    fabPill: string;
    openAria: string;
    closeAria: string;
    dialogAria: string;
    roleBadge: string;
    statusOnline: string;
    resetTitle: string;
    minimizeTitle: string;
    placeholder: string;
    sendAria: string;
    stopAria: string;
    footerLabel: string;
    showSuggestions: string;
    hideSuggestions: string;
    suggestionsHeading: string;
    copyReply: string;
    copied: string;
    retry: string;
    openProjectAction: (shortName: string) => string;
    scrollAction: (sectionLabel: string) => string;
    leadCardTitle: string;
    leadNameLabel: string;
    leadEmailLabel: string;
    leadSubjectLabel: string;
    leadMessageLabel: string;
    leadConfirmButton: string;
    leadSendingButton: string;
    leadSentLabel: string;
    leadErrorLabel: string;
    welcomeMessage: string;
    askProjectPrompt: (projectTitle: string) => string;
    quickPrompts: readonly { label: string; prompt: string }[];
  };
  footer: {
    rights: string;
    builtWith: string;
    mindset: string;
    backToTop: string;
    backToTopAria: string;
  };
  toast: {
    closeAria: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  pt: {
    nav: {
      brandAria: 'Fernando Calisto — Página Inicial',
      links: {
        sobre: 'Sobre',
        timeline: 'Trajetória',
        skills: 'Competências',
        laboratorio: 'Projetos',
        contato: 'Contato',
      },
      cta: 'Conversar',
      menuToggleAria: 'Alternar menu de navegação',
      languageToggleAria: 'Alternar idioma para inglês',
    },
    hero: {
      availability: 'Disponível para projetos B2B & oportunidades remotas',
      eyebrow: 'Atelier de Engenharia de Software & IA',
      headlineFirst: 'Fernando Henrique',
      headlineSecond: 'Braga Calisto',
      tagline:
        'Arquitetura de software escalável, sistemas corporativos e ecossistemas autônomos de IA — clique nos projetos em órbita para explorar.',
      primaryCta: 'Explorar projetos',
      secondaryCta: 'Iniciar conversa',
      orbitHint: 'Clique em um projeto na órbita para abrir o estudo de caso',
      scrollLabel: 'Explorar',
      satelliteClickAria: (name) => `Abrir estudo de caso do projeto ${name}`,
    },
    about: {
      sectionTitle: 'Sobre',
      heading: 'Engenharia, Liderança Executiva e Resiliência',
      bioParagraph1:
        'Graduando em Engenharia da Computação focado em arquiteturas de software escaláveis, sistemas distribuídos e interfaces modernas. Combino mentalidade de engenharia de produto com automação corporativa e IA aplicada.',
      bioParagraph2Prefix: 'Sou fundador da startup ',
      bioParagraph2Middle: ' e atuo como CEO da empresa júnior ',
      bioParagraph2Suffix: ', liderando a arquitetura e entrega de soluções tecnológicas de ponta a ponta.',
      bioParagraph3:
        'Minha trajetória também inclui vivência internacional como atleta de alto rendimento — base que consolidou disciplina, foco cirúrgico e consistência sob pressão.',
      pillarTalosRole: 'Fundador & Tech Lead Full-Stack',
      pillarDrakonRole: 'CEO & Arquiteto de Software',
      pillarPerfTitle: 'Engenharia & Alta Performance',
      pillarPerfSubtitle: 'Arquitetura escalável, visão de produto e sistemas AI-First',
      emailAria: 'Enviar e-mail para Fernando Calisto',
      githubAria: 'Perfil no GitHub',
      linkedinAria: 'Perfil no LinkedIn',
    },
    timeline: {
      sectionTitle: 'Trajetória',
      rangeLabel: '2022 — Presente',
      focusPrefix: 'Foco',
      prev: 'Anterior',
      next: 'Próximo',
      prevAria: 'Ir para o marco anterior',
      nextAria: 'Ir para o próximo marco',
      goToYearAria: (year) => `Ir para o ano ${year}`,
      stepOf: (c, t) => `${c} de ${t}`,
      keyboardHint: 'Use ← → para navegar',
    },
    skills: {
      sectionTitle: 'Competências & Arquitetura',
      subtitle: 'Tecnologias validadas em projetos reais — clique para filtrar os cases abaixo',
      hint: 'Clique em qualquer tecnologia para filtrar os projetos correspondentes',
      categories: {
        all: 'Todas',
        backend: 'Backend & Arquitetura',
        frontend: 'Frontend & Tooling',
        ai: 'IA & Visão',
        database: 'Dados',
      },
      usedInCount: (n) => (n === 1 ? '1 projeto em produção' : `${n} projetos`),
      activeFilterLabel: 'Filtrando projetos',
      clearSelection: 'Limpar filtro',
    },
    projects: {
      sectionTitle: 'Projetos & Estudos de Caso',
      subtitle: 'Arquitetura real, decisões técnicas e impacto mensurável',
      categories: {
        all: 'Todos',
        startup: 'Startup B2B',
        enterprise: 'Empresa Júnior',
        ai: 'IA & Visão',
        devtool: 'DevTools',
      },
      filteringBySkill: (name) => `Filtrando por competência: ${name}`,
      clearSkillFilter: 'Limpar filtro',
      emptyFilter: 'Nenhum projeto corresponde à combinação atual de filtros.',
      architectureCta: 'Arquitetura',
      visitCta: 'Acessar',
      contactCta: 'Conversar',
    },
    modal: {
      closeAria: 'Fechar estudo de caso',
      close: 'Fechar',
      diagramTitle: 'Fluxo de Arquitetura Interativo',
      diagramHint: 'Passe o mouse ou clique em um bloco para inspecionar a decisão técnica',
      challengeTitle: 'O Desafio de Engenharia',
      architectureTitle: 'Decisões de Arquitetura & Solução',
      stackTitle: 'Stack Aplicada',
      metricsTitle: 'Impacto & Resultados',
      askDobby: 'Perguntar ao Dobby',
      visitProject: 'Acessar projeto',
      discussProject: 'Conversar sobre este projeto',
    },
    contact: {
      sectionTitle: 'Contato',
      heading: 'Vamos conversar sobre seu próximo desafio',
      intro:
        'Aberto a conversas sobre arquitetura de software, projetos B2B na TALOS, consultoria de IA e oportunidades de engenharia.',
      emailLabel: 'E-mail direto',
      copyEmail: 'Copiar',
      copiedEmail: 'Copiado',
      copiedToast: 'E-mail copiado para a área de transferência.',
      githubLabel: 'GitHub',
      linkedinLabel: 'LinkedIn',
      nameLabel: 'Seu nome',
      namePlaceholder: 'Como posso chamar você?',
      emailFieldLabel: 'Seu e-mail',
      emailPlaceholder: 'voce@empresa.com',
      subjectLabel: 'Assunto',
      subjects: {
        talos: 'Projeto B2B / TALOS',
        opportunity: 'Vaga / Recrutamento',
        drakon: 'Parceria DRAKON Code',
        project: 'Sobre um Projeto do Portfólio',
        other: 'Outro assunto',
      },
      messageLabel: 'Mensagem',
      messagePlaceholder: 'Conte um pouco sobre o contexto, desafio técnico ou oportunidade...',
      submit: 'Enviar mensagem',
      sending: 'Enviando...',
      fillAllError: 'Por favor, preencha nome, e-mail e mensagem.',
      genericError:
        'Não foi possível enviar sua mensagem agora. Tente novamente ou escreva diretamente para fernandocalisto.dev@gmail.com.',
      successMessage: (name) =>
        `Obrigado, ${name}! Mensagem recebida com sucesso. Retorno em breve.`,
      projectPrefillMessage: (title) =>
        `Olá Fernando! Vi o estudo de caso "${title}" no seu portfólio e gostaria de conversar mais sobre ele.`,
    },
    chat: {
      fabPill: 'Pergunte ao Dobby 🧦',
      openAria: 'Abrir assistente Dobby',
      closeAria: 'Fechar assistente Dobby',
      dialogAria: 'Dobby — Guia Oficial do Portfólio de Fernando Calisto',
      roleBadge: 'Guia Agente',
      statusOnline: 'Online • Guia interativo',
      resetTitle: 'Reiniciar conversa',
      minimizeTitle: 'Minimizar chat',
      placeholder: 'Pergunte sobre projetos, arquitetura ou peça para enviar contato...',
      sendAria: 'Enviar mensagem',
      stopAria: 'Interromper resposta',
      footerLabel: 'Dobby • Guia Oficial',
      showSuggestions: 'Sugestões',
      hideSuggestions: 'Ocultar sugestões',
      suggestionsHeading: 'Perguntas sugeridas',
      copyReply: 'Copiar',
      copied: 'Copiado',
      retry: 'Tentar novamente',
      openProjectAction: (name) => `Abrir estudo de caso: ${name}`,
      scrollAction: (label) => `Ir para ${label}`,
      leadCardTitle: 'Rascunho de contato pronto para envio',
      leadNameLabel: 'Nome',
      leadEmailLabel: 'E-mail',
      leadSubjectLabel: 'Assunto',
      leadMessageLabel: 'Mensagem',
      leadConfirmButton: 'Confirmar e enviar ao Fernando',
      leadSendingButton: 'Enviando ao Fernando...',
      leadSentLabel: 'Enviado! Fernando recebeu sua mensagem.',
      leadErrorLabel: 'Falha ao enviar. Tente novamente ou use a seção Contato.',
      welcomeMessage:
        'Olá! Dobby é o elfo doméstico e guia oficial do portfólio de **Fernando Calisto**! 🧦✨\n\nPosso explicar a arquitetura de **TALOS**, **PANOPTES**, **JasperReports Tools** e **DRAKON Code**, abrir estudos de caso diretamente na tela ou encaminhar uma mensagem sua direto ao Fernando.\n\nComo Dobby pode ajudar hoje?',
      askProjectPrompt: (title) =>
        `Dobby, pode detalhar as principais decisões de arquitetura e resultados do projeto "${title}"?`,
      quickPrompts: [
        { label: '🧦 Quem é você?', prompt: 'Quem é você?' },
        { label: '💼 TALOS & IA B2B', prompt: 'Me conte sobre a arquitetura e resultados da TALOS.' },
        {
          label: '👁️ PANOPTES (Forense)',
          prompt: 'Como funciona o funil de 3 estágios e a cadeia de custódia do PANOPTES?',
        },
        {
          label: '🧩 JasperReports VS Code',
          prompt: 'Como funciona a arquitetura Zero-Daemon da extensão JasperReports Tools?',
        },
        {
          label: '🚀 DRAKON Code',
          prompt: 'Como é a atuação do Fernando como CEO e arquiteto na DRAKON Code?',
        },
        {
          label: '📫 Enviar contato pelo chat',
          prompt: 'Quero enviar uma mensagem para conversar com o Fernando.',
        },
      ],
    },
    footer: {
      rights: '© 2026 Fernando Henrique Braga Calisto. Todos os direitos reservados.',
      builtWith: 'Engenharia com',
      mindset: '& mentalidade',
      backToTop: 'Topo',
      backToTopAria: 'Voltar ao topo da página',
    },
    toast: {
      closeAria: 'Fechar notificação',
    },
  },
  en: {
    nav: {
      brandAria: 'Fernando Calisto — Home',
      links: {
        sobre: 'About',
        timeline: 'Timeline',
        skills: 'Skills',
        laboratorio: 'Projects',
        contato: 'Contact',
      },
      cta: 'Get in touch',
      menuToggleAria: 'Toggle navigation menu',
      languageToggleAria: 'Switch language to Portuguese',
    },
    hero: {
      availability: 'Available for B2B projects & remote roles',
      eyebrow: 'Software Architecture & AI Atelier',
      headlineFirst: 'Fernando Henrique',
      headlineSecond: 'Braga Calisto',
      tagline:
        'Scalable software architecture, enterprise systems and autonomous AI pipelines — click any orbiting project to explore.',
      primaryCta: 'Explore projects',
      secondaryCta: 'Start a conversation',
      orbitHint: 'Click any project in orbit to inspect its architecture',
      scrollLabel: 'Scroll',
      satelliteClickAria: (name) => `Open case study for ${name}`,
    },
    about: {
      sectionTitle: 'About',
      heading: 'Engineering, Executive Leadership & Resilience',
      bioParagraph1:
        'Computer Engineering undergraduate focused on scalable software architectures, distributed backends and refined interfaces. I pair product-engineering discipline with enterprise automation and applied AI.',
      bioParagraph2Prefix: 'I am the founder of ',
      bioParagraph2Middle: ' and serve as CEO of junior enterprise ',
      bioParagraph2Suffix: ', leading end-to-end architecture and software delivery.',
      bioParagraph3:
        'My background also includes international experience as a high-performance athlete — forging discipline, sharp focus and consistency under pressure.',
      pillarTalosRole: 'Founder & Full-Stack Tech Lead',
      pillarDrakonRole: 'CEO & Software Architect',
      pillarPerfTitle: 'Engineering & High Performance',
      pillarPerfSubtitle: 'Scalable architecture, product mindset and AI-First systems',
      emailAria: 'Send an email to Fernando Calisto',
      githubAria: 'GitHub profile',
      linkedinAria: 'LinkedIn profile',
    },
    timeline: {
      sectionTitle: 'Timeline',
      rangeLabel: '2022 — Present',
      focusPrefix: 'Focus',
      prev: 'Previous',
      next: 'Next',
      prevAria: 'Go to previous milestone',
      nextAria: 'Go to next milestone',
      goToYearAria: (year) => `Jump to year ${year}`,
      stepOf: (c, t) => `${c} of ${t}`,
      keyboardHint: 'Use ← → keys to navigate',
    },
    skills: {
      sectionTitle: 'Skills & Architecture',
      subtitle: 'Technologies proven in real systems — click any skill to filter projects below',
      hint: 'Click any technology to filter matching case studies',
      categories: {
        all: 'All',
        backend: 'Backend & Architecture',
        frontend: 'Frontend & Tooling',
        ai: 'AI & Vision',
        database: 'Data',
      },
      usedInCount: (n) => (n === 1 ? '1 production project' : `${n} projects`),
      activeFilterLabel: 'Filtering projects',
      clearSelection: 'Clear filter',
    },
    projects: {
      sectionTitle: 'Projects & Case Studies',
      subtitle: 'Real system architecture, technical trade-offs and measurable impact',
      categories: {
        all: 'All',
        startup: 'B2B Startup',
        enterprise: 'Junior Enterprise',
        ai: 'AI & Vision',
        devtool: 'DevTools',
      },
      filteringBySkill: (name) => `Filtered by skill: ${name}`,
      clearSkillFilter: 'Clear filter',
      emptyFilter: 'No project matches the current filter combination.',
      architectureCta: 'Architecture',
      visitCta: 'Visit',
      contactCta: 'Discuss',
    },
    modal: {
      closeAria: 'Close case study',
      close: 'Close',
      diagramTitle: 'Interactive Architecture Flow',
      diagramHint: 'Hover or select any node to inspect its engineering role',
      challengeTitle: 'Engineering Challenge',
      architectureTitle: 'Architectural Decisions & Solution',
      stackTitle: 'Technology Stack',
      metricsTitle: 'Impact & Outcomes',
      askDobby: 'Ask Dobby',
      visitProject: 'Visit project',
      discussProject: 'Discuss this project',
    },
    contact: {
      sectionTitle: 'Contact',
      heading: "Let's talk about your next engineering challenge",
      intro:
        'Open to conversations about software architecture, custom B2B automation at TALOS, applied AI and remote engineering roles.',
      emailLabel: 'Direct email',
      copyEmail: 'Copy',
      copiedEmail: 'Copied',
      copiedToast: 'Email address copied to clipboard.',
      githubLabel: 'GitHub',
      linkedinLabel: 'LinkedIn',
      nameLabel: 'Your name',
      namePlaceholder: 'How should I address you?',
      emailFieldLabel: 'Your email',
      emailPlaceholder: 'you@company.com',
      subjectLabel: 'Subject',
      subjects: {
        talos: 'B2B Project / TALOS',
        opportunity: 'Role / Recruiting',
        drakon: 'DRAKON Code Partnership',
        project: 'About a Portfolio Project',
        other: 'Other inquiry',
      },
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me about your context, technical challenge or opportunity...',
      submit: 'Send message',
      sending: 'Sending...',
      fillAllError: 'Please fill in your name, email and message.',
      genericError:
        'Could not send your message right now. Please retry or email fernandocalisto.dev@gmail.com directly.',
      successMessage: (name) => `Thank you, ${name}! Your message has been sent. I will reply soon.`,
      projectPrefillMessage: (title) =>
        `Hi Fernando! I just reviewed the "${title}" case study on your portfolio and would love to discuss it further.`,
    },
    chat: {
      fabPill: 'Ask Dobby 🧦',
      openAria: 'Open Dobby assistant',
      closeAria: 'Close Dobby assistant',
      dialogAria: "Dobby — Fernando Calisto's Official Portfolio Guide",
      roleBadge: 'Agent Guide',
      statusOnline: 'Online • Interactive guide',
      resetTitle: 'Reset conversation',
      minimizeTitle: 'Minimize chat',
      placeholder: 'Ask about projects, architecture or send a message to Fernando...',
      sendAria: 'Send message',
      stopAria: 'Stop response',
      footerLabel: 'Dobby • Official Guide',
      showSuggestions: 'Suggestions',
      hideSuggestions: 'Hide suggestions',
      suggestionsHeading: 'Suggested questions',
      copyReply: 'Copy',
      copied: 'Copied',
      retry: 'Try again',
      openProjectAction: (name) => `Open case study: ${name}`,
      scrollAction: (label) => `Go to ${label}`,
      leadCardTitle: 'Contact draft ready to send',
      leadNameLabel: 'Name',
      leadEmailLabel: 'Email',
      leadSubjectLabel: 'Subject',
      leadMessageLabel: 'Message',
      leadConfirmButton: 'Confirm and send to Fernando',
      leadSendingButton: 'Sending to Fernando...',
      leadSentLabel: 'Sent! Fernando received your message.',
      leadErrorLabel: 'Could not send right now. Retry or use the Contact section.',
      welcomeMessage:
        "Hello! Dobby is the house-elf and official guide to **Fernando Calisto**'s portfolio! 🧦✨\n\nDobby can walk you through the architecture of **TALOS**, **PANOPTES**, **JasperReports Tools** and **DRAKON Code**, open case studies right on screen, or deliver a message straight to Fernando.\n\nHow may Dobby help today?",
      askProjectPrompt: (title) =>
        `Dobby, can you explain the key architectural decisions and impact behind "${title}"?`,
      quickPrompts: [
        { label: '🧦 Who are you?', prompt: 'Who are you?' },
        { label: '💼 TALOS & B2B AI', prompt: 'Tell me about TALOS architecture and B2B impact.' },
        {
          label: '👁️ PANOPTES (Forensics)',
          prompt: 'How does the 3-stage funnel and chain of custody work in PANOPTES?',
        },
        {
          label: '🧩 JasperReports VS Code',
          prompt: 'How does the Zero-Daemon architecture of JasperReports Tools work?',
        },
        {
          label: '🚀 DRAKON Code',
          prompt: "What was Fernando's leadership and architecture role at DRAKON Code?",
        },
        {
          label: '📫 Contact via chat',
          prompt: 'I would like to send a message to Fernando.',
        },
      ],
    },
    footer: {
      rights: '© 2026 Fernando Henrique Braga Calisto. All rights reserved.',
      builtWith: 'Engineered with',
      mindset: '& mindset',
      backToTop: 'Top',
      backToTopAria: 'Back to top',
    },
    toast: {
      closeAria: 'Dismiss notification',
    },
  },
};
