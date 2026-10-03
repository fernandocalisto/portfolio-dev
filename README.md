# Developer Tech Portfolio — Fernando Henrique Braga Calisto

Portfólio profissional de **Desenvolvedor Full-Stack e Arquiteto de Software**, construído em **React 18 + Vite + TypeScript + Tailwind CSS** com foco em alta performance, acessibilidade e mentalidade **AI-First**.

---

## 🚀 Como Executar o Projeto

Com o **Node.js** instalado em seu ambiente:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar a chave de API do Gemini (Google AI Studio)
# Crie seu arquivo .env.local a partir do .env.example:
# GEMINI_API_KEY=sua_chave_aqui
# Obtenha gratuitamente em: https://aistudio.google.com/app/apikey

# 3. Iniciar servidor de desenvolvimento local
npm run dev

# 4. Compilar para produção (TypeScript check + Vite bundle otimizado)
npm run build

# 5. Pré-visualizar a versão compilada em produção
npm run preview
```

O servidor local iniciará tipicamente em `http://localhost:3000`. O endpoint serverless `/api/chat` é emulado automaticamente pelo Vite em ambiente de desenvolvimento, integrando-se diretamente ao modelo Gemini 1.5 Flash.

---

## 📁 Arquitetura do Projeto

```bash
Fernando Calisto/
├── api/                    # Funções Serverless (Vercel / Netlify / Vite Dev)
│   └── chat.ts             # Handler seguro com streaming Gemini 1.5 Flash
├── public/                 # Assets estáticos (favicon SVG, logos, preview)
│   ├── assets/
│   ├── favicon.svg         # Favicon customizado com monograma <FC/>
│   └── preview.png
├── src/
│   ├── components/
│   │   ├── chat/           # Assistente IA com Gemini 1.5 Flash
│   │   │   ├── ChatWidget.tsx         # Widget flutuante e modal responsivo
│   │   │   ├── ChatMessageItem.tsx    # Balão de mensagem do usuário e IA
│   │   │   ├── ChatMessageContent.tsx # Renderizador Markdown seguro e cópia de código
│   │   │   └── ChatQuickChips.tsx     # Chips de perguntas sugeridas
│   │   ├── layout/
│   │   │   ├── Navbar.tsx   # Header fixo com Drawer responsivo mobile
│   │   │   └── Footer.tsx   # Rodapé técnico
│   │   ├── sections/
│   │   │   ├── Hero.tsx     # Hero com terminal "The Living Architecture" interativo
│   │   │   ├── About.tsx    # Perfil, vivência como atleta e pilares
│   │   │   ├── Timeline.tsx # Trajetória com cards Dark Glassmorphism e seletor anual
│   │   │   ├── Skills.tsx   # Matriz de competências com filtros por categoria
│   │   │   ├── Projects.tsx # Bento Grid com acionamento de case study
│   │   │   └── Contact.tsx  # Canais diretos e formulário com validação e Toast
│   │   └── ui/
│   │       ├── ProjectModal.tsx # Modal de detalhamento da arquitetura de cada projeto
│   │       └── Toast.tsx        # Notificação acessível (sem alerts nativos)
│   ├── data/                # Conteúdo isolado do código de renderização
│   │   ├── chatContext.ts   # System prompt e base de conhecimento da IA
│   │   ├── projects.ts      # Dados e métricas de TALOS, DRAKON Code e IA
│   │   ├── timeline.ts      # Marcos de 2022 a 2026
│   │   └── skills.ts        # Tecnologias (Java, React, Python, n8n, etc.)
│   ├── hooks/               # Custom hooks React
│   │   └── useChat.ts       # Gerenciamento de streaming SSE e histórico
│   ├── types/               # Tipagem TypeScript estrita
│   │   ├── chat.ts          # Interfaces de mensagens, payloads e streaming
│   │   └── index.ts
│   ├── utils/               # Utilitários (ex: clsx + tailwind-merge)
│   │   └── cn.ts
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Ponto de entrada React
│   └── index.css            # Diretivas Tailwind e gradientes sutis
├── index.html               # HTML5 base com Open Graph, Twitter cards e SEO
├── index.legacy.html        # Backup do HTML estático monolítico original
├── vite.config.ts           # Configuração Vite com alias `@/`
├── tailwind.config.js       # Tokens de design do tema escuro
└── package.json
```

---

## 🛠️ Resumo do Perfil & Seções

- **Nome:** Fernando Henrique Braga Calisto
- **Cargo:** Desenvolvedor Full-Stack e Arquiteto de Software
- **Stack Principal:** Java Spring Boot, React, Node.js, TypeScript, PostgreSQL, Python, IA & Automação (n8n, LLMs)
- **Projetos em Destaque:**
  - **TALOS — Automação Empresarial e IA**: Soluções B2B customizadas, automação de processos corporativos complexos e implementação estratégica de IA adaptada a cada modelo de negócio.
  - **DRAKON Code — Empresa Júnior de Tecnologia**: Liderança executiva como CEO, democratização da engenharia de software de ponta e desenvolvimento de sistemas sob medida para impulsionar negócios locais.
  - **Ecossistemas de Automação e IA**: Resolução de desafios complexos com pipelines autônomos, orquestração de APIs, Python, fluxos no n8n e agentes de IA (LLMs) para alavancar a produtividade operacional.
- **Contato:** (18) 99155-4376 | fernandocalisto.dev@gmail.com

---

## 🧠 Habilidades do Stitch Instaladas (`stitch-skills`)

As habilidades e plugins do repositório [`google-labs-code/stitch-skills`](https://github.com/google-labs-code/stitch-skills) permanecem preservados em [`.agents/`](file:///c:/Users/ferna/OneDrive/Documentos/Fernando%20Calisto/.agents) para futura integração e expansão.
