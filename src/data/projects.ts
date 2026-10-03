import { ProjectItem } from '../types';

export const projectsData: ProjectItem[] = [
  {
    id: 'talos',
    title: 'TALOS — Automação Empresarial & IA',
    subtitle: 'Soluções B2B Customizadas & Agentes Autônomos',
    role: 'Fundador & Tech Lead Full-Stack',
    category: 'startup',
    tag: 'STARTUP B2B',
    tagColor: '#ba460d',
    accentColor: '#ba460d',
    logo: '/assets/talos-logo.jpg',
    summary: 'Desenvolvimento e arquitetura de soluções tecnológicas customizadas para empresas que buscam escalabilidade e eficiência operacional através de automação de processos complexos e inteligência artificial aplicada.',
    challenge: 'Empresas perdem centenas de horas em tarefas manuais, reconciliações repetitivas e comunicação descentralizada, gerando custos operacionais altos e riscos de erros humanos.',
    architecture: [
      'Pipelines assíncronos orientados a eventos conectando bancos relacionais e APIs de parceiros',
      'Orquestração de Agentes LLM com memória de contexto e ferramentas (Tool Calling)',
      'Painéis administrativos em React + TypeScript com telemetria em tempo real'
    ],
    techStack: ['Java Spring Boot', 'Python', 'React', 'n8n', 'PostgreSQL', 'Docker', 'LLMs'],
    metrics: [
      'Redução de até 70% em tempo de processamento manual em fluxos corporativos',
      'Integração multi-canal via webhooks e APIs RESTful seguras',
      'Arquitetura modular pronta para expansão sob demanda'
    ],
    featured: true,
    link: 'https://talos.fernandocalisto.com.br'
  },
  {
    id: 'drakon',
    title: 'DRAKON Code — Empresa Júnior',
    subtitle: 'Sistemas Sob Medida para Transformação Regional',
    role: 'CEO & Arquiteto de Software',
    category: 'enterprise',
    tag: 'EMPRESA JÚNIOR',
    tagColor: '#c0261c',
    accentColor: '#c0261c',
    logo: '/assets/drakon-logo.png',
    summary: 'Liderança executiva e arquitetura de sistemas na empresa júnior de Engenharia da Computação, impulsionando a transformação digital de negócios locais através de engenharia de software de padrão industrial.',
    challenge: 'Pequenos e médios negócios regionais com processos analógicos sem acesso a consultorias de software de alta qualidade a preços justos.',
    architecture: [
      'Padrão MVC e Clean Architecture em Spring Boot para facilitar manutenção e escala por diferentes times de alunos',
      'Deploy automatizado com containerização e bancos gerenciados em nuvem',
      'Gestão ágil de engenharia com code review rigoroso e esteira CI/CD'
    ],
    techStack: ['Java', 'Spring Boot', 'TypeScript', 'React', 'PostgreSQL', 'Git / GitHub CI'],
    metrics: [
      'Liderança de time multidisciplinar de desenvolvedores e gerentes de produto',
      'Múltiplos projetos entregues com alta satisfação de clientes locais',
      'Capacitação prática contínua de novos talentos universitários'
    ],
    featured: true,
    link: 'https://www.linkedin.com/company/drakon-code'
  },
  {
    id: 'ai-ecosystem',
    title: 'Ecossistemas de Automação & IA',
    subtitle: 'Pipelines Inteligentes, n8n & Orquestração de APIs',
    role: 'Engenheiro de IA & Automação',
    category: 'ai',
    tag: 'AI-FIRST',
    tagColor: '#185b63',
    accentColor: '#185b63',
    logo: '/assets/ai-logo.png',
    summary: 'Construção de pipelines autônomos integrando APIs corporativas, rotinas em Python, nós de automação no n8n e modelos de linguagem para extração de dados, geração de relatórios e tomada de decisão preditiva.',
    challenge: 'Sistemas legados desconectados que não dialogam entre si, gerando silos de dados e lentidão no fluxo decisório das empresas.',
    architecture: [
      'Pipelines híbridos executando scripts Python especializados em processamento assíncrono',
      'Webhooks bidirecionais integrados a bancos de dados e sistemas de mensageria',
      'Camada de sanitização de dados e roteamento inteligente com IA generativa'
    ],
    techStack: ['Python', 'n8n', 'OpenAI / Claude APIs', 'REST APIs', 'FastAPI', 'JSON Schema'],
    metrics: [
      'Execução 24/7 com tolerância a falhas e reprocessamento automático de erros',
      'Automação de relatórios analíticos estratégicos para diretoria',
      'Consistência de dados em tempo real entre CRM, ERP e canais de atendimento'
    ],
    featured: true,
    link: 'https://github.com/fernandocalisto'
  }
];
