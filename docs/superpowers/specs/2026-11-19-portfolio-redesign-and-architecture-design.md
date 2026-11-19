# Portfólio Fernando Calisto — Especificação de Design & Arquitetura

**Data:** 2026-11-19
**Status:** Aguardando revisão final do usuário
**Domínio:** `https://fernandocalisto.com.br`

---

## 1. Objetivo, Público e Critérios de Sucesso

### Intenção Estratégica
Transformar o portfólio de Fernando Henrique Braga Calisto em uma experiência **híbrida** capaz de:
1. **Impressionar recrutadores e lideranças de engenharia** com impacto visual memorável na abertura e prova técnica real nas seções seguintes (diagramas arquiteturais, código/infra limpa e Dobby agindo como agente).
2. **Converter clientes B2B** (TALOS e consultoria sob medida) com um funil de contato contextualizado — tanto pelo formulário quanto pelo próprio chat do Dobby — sem dependência de novos serviços pagos ou contas externas.

### Restrições & Decisões Fixas
- **Privacidade**: remover integralmente telefone (`tel:+5518991554376`) e qualquer menção a WhatsApp em componentes, dados e respostas de API. Canais oficiais: **Formulário, E-mail (`fernandocalisto.dev@gmail.com`), GitHub e LinkedIn**.
- **Sem botão de download de CV** neste ciclo.
- **Sem nova infraestrutura externa** (sem Upstash Redis ou serviços pagos adicionais; manter Vercel Serverless + OpenRouter + Telegram Bot API).
- **Bilíngue completo (`pt-BR` / `en`)**: interface, dados estruturados (projetos, skills, timeline) e respostas do Dobby sincronizados no idioma selecionado.

### Critérios de Sucesso
- Hero full-bleed 3D ("Sistema Saturno") renderizando a 60 FPS em desktop e mobile, com clique/toque funcional nos 5 projetos em órbita e fallback SVG acessível.
- Zero contradições entre os dados exibidos no site e o conhecimento do Dobby (Fonte Única de Verdade).
- Redução do peso dos logos de projetos de ~4,6 MB para <150 KB em WebP.
- Todos os bugs críticos atuais eliminados (botão Sugestões, filtro `welcome-*`, sobreposição e timer do Toast, animações CSS inexistentes, XSS em links do chat, timeout em cascata na Vercel, `og:image` relativo).
- `npm run test`, `npm run typecheck` (cobrindo `src/`, `shared/` e `api/`) e `npm run build` passando sem erros.

---

## 2. Direção Visual & Sistema de Design (*Atelier de Engenharia*)

### Princípios
- **Contraste narrativo**: abertura puramente artística e escultural em tela cheia (`100svh`) no Hero → profundidade de engenharia clara, estruturada e orientada a conteúdo nas seções abaixo.
- **Restrição estética**: eliminar o excesso de badges `ALL-CAPS`, bordas brilhantes repetitivas e cards idênticos. Usar linhas estruturais sutis (`1px`), espaço negativo generoso e contraste WCAG AA+ (`≥ 4.5:1`).
- **Motion intencional**: coreografia de entrada na abertura e transições em resposta a ações do usuário, respeitando `prefers-reduced-motion`.

### Paleta Evoluída (Obsidian + Deep Teal + Bronze/Ouro)
| Token Tailwind | Hex | Uso |
|---|---|---|
| `brand-obsidian` | `#0B0F13` | Fundo principal |
| `brand-surface` | `#12181F` | Superfícies elevadas, modais e janela do chat |
| `brand-card` | `#161E26` | Cards editoriais e painéis de diagrama |
| `brand-hairline` | `#24303C` | Divisores e bordas sutis (`1px`) |
| `brand-ivory` | `#F1EFEA` | Texto principal (marfim quente) |
| `brand-muted` | `#94A3B8` | Texto secundário (contraste AA sobre obsidian/surface) |
| `brand-teal` | `#185B63` | Preenchimentos estruturais e botões secundários |
| `brand-tealLight` | `#38B2AC` | Texto/badges teal sobre fundo escuro (WCAG AA) |
| `brand-gold` | `#C59538` | Assinatura metálica (anéis, destaques editoriais) |
| `brand-copper` | `#D4722C` | CTA principal e acento quente (evolução do `#ba460d`) |
| `brand-crimson` | `#D14338` | Erros críticos e emblema da DRAKON Code |

### Tipografia
- **Display (`font-display`)**: **`Fraunces`** (Google Fonts, peso variável 500–800) — títulos monumentais do Hero e cabeçalhos de seção.
- **UI & Prosa (`font-sans`)**: **`DM Sans`** (pesos 400–700) — todo corpo de texto, botões, formulários e descrições da Timeline (substituindo o uso anterior de `font-mono` em parágrafos longos).
- **Técnica (`font-mono`)**: **`JetBrains Mono`** — estritamente para blocos de código, diagramas arquiteturais, tags de stack técnica e marcadores de anos.

### Animações & Utilitários CSS
Registrar explicitamente no `tailwind.config.js` e `src/index.css`:
- Keyframes: `fadeIn`, `slideUp`, `chatEnter`, `orbitPulse` + utilitário de textura *film grain* sutil (SVG inline em baixa opacidade sobre o fundo) + estilização nativa de scrollbar fina para o chat.
- Regras `@media (prefers-reduced-motion: reduce)` desativando animações contínuas.

---

## 3. Hero Artístico — Sistema Orbital "Saturno" em 3D

### Conceito e Composição (`src/components/sections/Hero.tsx` + `src/components/three/SaturnPortfolioScene.tsx`)
- **Full-bleed (`min-h-[100svh]`)**: o canvas WebGL ocupa 100% do Hero no desktop e no mobile, sem caixas de terminal, métricas genéricas ou seletores técnicos na dobra inicial.
- **Camada Editorial sobre o Canvas**:
  - Nome em escala monumental (`clamp(2.6rem, 7.5vw, 6.2rem)`) em `Fraunces`.
  - Uma frase concisa de posicionamento (traduzida `PT`/`EN`).
  - Duas ações limpas: CTA principal (*"Explorar projetos"*) e ação secundária (*"Iniciar conversa"*), além de indicador minimalista de scroll na base.
  - Gradiente radial/linear sutil ancorando o texto para legibilidade perfeita sobre o WebGL em qualquer viewport.

### Cena 3D (`three` puro, carregado com `React.lazy`)
1. **Planeta Central**: esfera com `ShaderMaterial` GLSL customizado (obsidiana escura + iluminação de borda Fresnel em `#C59538`/`#D4722C` e filamento interno suave em `#2DD4BF`), girando continuamente.
2. **Anéis de Saturno**:
   - Disco inclinado (~24°) formado por nuvem de partículas (`THREE.Points`, ~2.200 partículas no desktop / ~1.000 no mobile) em múltiplos raios concêntricos com variação de brilho ouro/bronze.
   - 2 a 3 trilhas orbitais metálicas finas (`THREE.TorusGeometry` / `THREE.LineLoop`) indicando os planos de órbita dos projetos.
3. **5 Projetos Orbitando em 3D**:
   - Cada projeto de `shared/portfolioData.ts` possui `orbit: { radius, speed, initialAngle, inclination }` e é renderizado como um **orbe 3D luminoso** na cor do projeto + um **marcador HTML sincronizado** projetado a cada frame (`vector.project(camera)`).
   - Profundidade real (`z` na câmera): satélites que passam atrás do planeta reduzem levemente escala e opacidade (`z-index` atrás do núcleo); na frente, ganham nitidez máxima.
   - **Hover / Foco**: desacelera suavemente a velocidade orbital global (fator `0.15x`), expande o satélite e exibe micro-preview com subtítulo/papel.
   - **Clique / Toque no satélite**: rola suavemente para `#laboratorio`, destaca o card correspondente e abre o `ProjectModal` do projeto clicado (atualizando `?projeto=<id>`).
4. **Interação PC & Mobile + Guardrails de Performance**:
   - Desktop: inclinação suave do grupo Saturno seguindo o mouse (lerp).
   - Mobile: câmera afastada proporcionalmente ao aspect ratio (`width < 640`) garantindo enquadramento inteiro na metade superior; arraste horizontal rotaciona o conjunto sem bloquear scroll vertical (`touch-action: pan-y`).
   - `IntersectionObserver` + `visibilitychange` pausam o loop `requestAnimationFrame` quando fora da tela ou aba oculta.
   - `devicePixelRatio` limitado a `Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)`.
   - **Fallback**: se `prefers-reduced-motion` estiver ativo ou a inicialização WebGL falhar, renderiza `<SaturnFallbackSvg />` — uma ilustração vetorial orbital elegante com os mesmos 5 botões clicáveis de projetos.

---

## 4. Seções Editoriais, Diagramas SVG, Contato & Bilíngue

### 4.1 Sistema de Idioma (`src/context/LocaleContext.tsx`)
- Suporta `'pt'` (padrão) e `'en'`, persistido em `localStorage` (`fc_portfolio_locale`).
- Controlado por um toggle compacto `PT | EN` na `Navbar`.
- Atualiza `<html lang="pt-BR|en">`, toda copy da UI, dados estruturados (`projects`, `skills`, `timeline`), chips do Dobby e o parâmetro `locale` enviado ao `/api/chat`.

### 4.2 Navbar (`src/components/layout/Navbar.tsx`)
- Barra de progresso de leitura (`1.5px`) no topo acompanhando o scroll da página.
- **ScrollSpy** (`IntersectionObserver`) destacando o link da seção ativa (`#sobre`, `#timeline`, `#skills`, `#laboratorio`, `#contato`).
- Toggle `PT | EN` + botão de contato + menu mobile com `Escape` e clique fora.

### 4.3 Sobre (`src/components/sections/About.tsx`)
- Layout assimétrico editorial (retrato otimizado com `width`/`height` explícitos + bio fluida em `DM Sans` + 3 pilares: TALOS, DRAKON Code, Engenharia & Performance).
- **Links sociais**: apenas **E-mail**, **GitHub** e **LinkedIn** (telefone removido).

### 4.4 Trajetória (`src/components/sections/Timeline.tsx`)
- Mantém a navegação sequencial `2022–2026` com suporte a teclado (`ArrowLeft` / `ArrowRight`) quando focada.
- Descrição em `DM Sans` (legibilidade editorial); anos, períodos e contadores em `JetBrains Mono`.

### 4.5 Skills Conectadas aos Projetos (`src/components/sections/Skills.tsx`)
- Remove o rótulo `"Intermediário"` repetido e mostra **evidência prática** (ex.: `"3 projetos"` / nomes resumidos dos projetos onde foi aplicada).
- Novas skills adicionadas para refletir os cases reais: **OpenCV & Visão Computacional**, **FastAPI**, **Git / CI-CD**, **VS Code API**.
- **Filtro cruzado Skill → Projetos**: clicar em uma skill seleciona o filtro ativo por skill na seção de Projetos (`selectedSkillId`), exibindo um banner discreto na seção de projetos (*"Filtrando por: Python — Limpar"*) e rolando suavemente até `#laboratorio`.

### 4.6 Projetos, Deep-Linking & Diagramas Arquiteturais SVG (`Projects.tsx` + `ProjectModal.tsx`)
- **Logos otimizados**: os 5 arquivos de logo convertidos para `.webp` (`256×256`), mantendo a estética original com redução >95% de bytes.
- **Badges acessíveis**: cada projeto define `accentColor` e `badgeTextColor` (contraste ≥ 4.5:1 sobre `#12181F`).
- **Deep-linking**:
  - Ao montar o `App`, lê `URLSearchParams.get('projeto')`. Se corresponder a um ID válido (`talos`, `drakon`, `ai-ecosystem`, `jasper`, `panoptes`), rola para `#laboratorio` e abre o `ProjectModal`.
  - Ao abrir/fechar o modal, sincroniza `?projeto=<id>` via `window.history.replaceState` sem recarregar a página.
- **Diagrama Arquitetural SVG Interativo (`src/components/ui/ProjectArchitectureDiagram.tsx`)**:
  - Um componente declarativo que renderiza um fluxo arquitetural vetorial responsivo (com setas animadas sutis e nós clicáveis/hover exibindo tooltip/legenda técnica em `PT`/`EN`) sob medida para cada um dos 5 projetos:
    - `talos`: Webhooks/APIs → Event Bus / n8n → Agentes LLM (Memória + Tool Calling) → Spring Boot + PostgreSQL → Dashboard React.
    - `drakon`: Descoberta → Clean Architecture (Spring Boot + React/TS) → GitHub CI/CD → Containers & Cloud DB.
    - `ai-ecosystem`: CRM/ERP Legados → Workers Python/FastAPI → Sanitização & Roteamento LLM → Relatórios 24/7.
    - `jasper`: Editor `.jrxml` (VS Code) → Engine Java Zero-Daemon → Preview PDF.js + SecretStorage → JasperServer v2 / DB.
    - `panoptes`: Vídeo Air-Gapped → Funil 3 Estágios (`<1ms/frame`) → Hot Frames + Query-by-Image (NetworkX) → `evidence.db` (SHA-256) → Laudo PDF.
- **Ações do Modal**:
  - **"Perguntar ao Dobby"**: fecha o modal, abre o `ChatWidget` e envia automaticamente uma pergunta contextualizada no idioma ativo sobre aquele projeto.
  - **"Conversar sobre este projeto"**: fecha o modal, define o contexto do formulário de contato (`subject: 'project'`, projeto associado e rascunho editável de mensagem) e rola até `#contato`.
  - **Acessibilidade**: focus trap no modal, restauração de foco ao elemento disparador e tratamento coordenado de `Escape` (se o chat estiver aberto acima do modal, fecha o chat primeiro).

### 4.7 Contato & Toast (`Contact.tsx` + `Toast.tsx`)
- **Canais**: E-mail com botão **"Copiar e-mail"** (+ Toast de confirmação), GitHub e LinkedIn (zero menção a WhatsApp/telefone).
- **Formulário**:
  - Campo **Assunto** (`Projeto B2B / TALOS`, `Vaga / Recrutamento`, `Parceria DRAKON Code`, `Sobre um Projeto`, `Outro`), preenchido automaticamente quando originado de um case.
  - Campo **honeypot** invisível (`website`, `tabIndex={-1}`, `autoComplete="off"`).
  - Fallback de erro sugere o e-mail direto (`fernandocalisto.dev@gmail.com`).
- **Toast**: posicionado em `fixed top-20 right-6 z-[100000]` com `timerRef` no `App.tsx` fazendo `clearTimeout` antes de agendar o fechamento.

---

## 5. Arquitetura de Dados Compartilhados (`shared/`)

Para garantir **Fonte Única de Verdade** entre o frontend (`src/`) e as Vercel Serverless Functions (`api/`):

```text
shared/
├── types.ts                # Tipos de domínio, Locale ('pt' | 'en'), ações do Dobby e payloads de API
├── portfolioData.ts        # Perfil, projetos (PT/EN + orbitConfig + diagramSpecs), skills e timeline
├── buildDobbyPrompt.ts     # Gera o system prompt do Dobby dinamicamente a partir de portfolioData + locale
├── dobbyActions.ts         # Parser puro de diretivas [[ACTION:...]] (seguro para streaming parcial)
└── security.ts             # Allowlist de CORS, sanitização de URLs (anti-XSS) e helpers de validação
```

- **Compatibilidade Vercel + Vite**:
  - `api/chat.ts` e `api/contact.ts` importam de `../shared/...` (empacotado automaticamente pelo runtime `@vercel/node` e resolvido pelo `ssrLoadModule` no `vite.config.ts`).
  - `tsconfig.json` / `tsconfig.api.json` verificam `src/`, `shared/` e `api/` via `npm run typecheck`.

---

## 6. Dobby Agente Ativo & Engenharia do Chat

### 6.1 Protocolo de Diretivas Estruturadas no Stream
Para manter compatibilidade com 100% dos modelos `:free` do OpenRouter em streaming SSE:
- O system prompt instrui o Dobby a, quando útil, anexar ao final da resposta diretivas no formato:
  - `[[ACTION:open_project:<projectId>]]` — validado contra IDs reais de `portfolioData.ts`.
  - `[[ACTION:scroll:<sectionId>]]` — validado contra `sobre | timeline | skills | laboratorio | contato`.
  - `[[ACTION:lead_draft:{"name":"...","email":"...","subject":"...","message":"..."}]]` — validado por schema estrito (tamanhos máximos e formato de e-mail).
- `parseDobbyMessage(rawText)` em `shared/dobbyActions.ts`:
  - Remove blocos `[[ACTION:...]]` completos (e oculta trechos parciais `[[ACTION:...` ainda chegando no stream) do texto exibido ao usuário.
  - Retorna `{ visibleText, actions }`.
- **Renderização na UI (`ChatMessageItem.tsx`)**:
  - `open_project` / `scroll`: renderiza botões interativos elegantes na base da resposta (ex.: *"Abrir estudo de caso: PANOPTES"* ou *"Ir para Contato"*). Ao clicar, executa a ação na página (no mobile, minimiza o chat para revelar o modal/seção).
  - `lead_draft`: renderiza um **Card de Confirmação de Lead** com resumo de Nome, E-mail, Assunto e Mensagem + botão **"Confirmar e enviar ao Fernando"**. Somente após o clique humano explícito o frontend chama `POST /api/contact` com `source: 'dobby_chat'` (impedindo disparo involuntário por prompt injection).

### 6.2 Correções & UX do Chat
- **Filtro de histórico (`useChat.ts`)**: alterar `m.id !== 'welcome-msg'` para `!m.id.startsWith('welcome-')` (resolve vazamento pós-`clearChat`).
- **Chips de sugestão (`ChatWidget.tsx`)**: desvincular o toggle manual *"Sugestões"* da condição `messages.length <= 2` (por padrão visível quando `messages.length <= 2`, e sempre visível quando o usuário clicar em *"Sugestões"*).
- **Input aprimorado**: `<textarea>` auto-expansível (`Enter` envia, `Shift+Enter` quebra linha), contador discreto próximo de 500 caracteres.
- **Ações por mensagem**: botão de copiar resposta do Dobby + botão *"Tentar novamente"* em mensagens de erro (reenviando a última pergunta do usuário).
- **Sanitização de links (`ChatMessageContent.tsx`)**: toda URL em `[label](url)` passa por `sanitizeSafeUrl(url)` (`shared/security.ts`), aceitando apenas `https:`, `http:` e `mailto:`.

---

## 7. Backend Serverless (`/api/chat.ts`, `/api/contact.ts`) & Segurança

### 7.1 `/api/chat.ts`
- **Orçamento de Timeout Compatível com Vercel (`maxDuration: 30`)**:
  - Budget global de **24.000 ms** para seleção de modelo.
  - Timeout individual de **7.000 ms** por tentativa de conexão inicial ao OpenRouter (`AbortController`).
  - Verifica tempo restante antes de tentar o próximo modelo da lista.
  - Lista de fallback termina em `'openrouter/free'` como rede de segurança caso algum slug específico saia do ar.
- **Stream vazio**: se o upstream devolver HTTP `200` mas encerrar sem nenhum chunk de texto, emite evento SSE `{ error: ... }` amigável (permitindo retry no frontend).
- **Suporte a idioma**: lê `locale` (`'pt' | 'en'`, default `'pt'`) do body e chama `buildDobbyPrompt(locale)`.
- **Tipagem**: interfaces explícitas para `ApiRequest` / `ApiResponse` (sem `any`).

### 7.2 `/api/contact.ts`
- **Payload estendido**: `{ name, email, subject?, message, source?, website? }`.
- **Honeypot**: se `website` vier preenchido (não vazio), retorna `200 { success: true }` imediatamente sem acionar o Telegram.
- **Timeout no Telegram**: `AbortController` de **8.000 ms** na requisição à API do Telegram.
- **Formatação no Telegram**: inclui badge de origem (`Formulário do Site` ou `Lead Qualificado via Dobby 🤖`) e o campo **Assunto** escapado em HTML.
- **Mensagens de erro**: atualizadas sem menção a WhatsApp (sugerindo envio direto para `fernandocalisto.dev@gmail.com`).

### 7.3 Segurança & Headers
- **CORS restrito (`shared/security.ts`)**: allowlist para `https://fernandocalisto.com.br`, `https://www.fernandocalisto.com.br`, domínio dinâmico `https://${process.env.VERCEL_URL}` e `http://localhost:*` / `http://127.0.0.1:*` em dev. Define `Vary: Origin`.
- **Headers HTTP (`vercel.json`)**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 8. SEO Técnico, Otimização de Assets & Testes

### SEO (`index.html` + `public/`)
- `og:image` e `twitter:image` com URL absoluta (`https://fernandocalisto.com.br/preview.png`).
- `<link rel="canonical" href="https://fernandocalisto.com.br/" />`.
- Bloco `<script type="application/ld+json">` com schema `Person` + `WebSite` (sem telefone, com links oficiais GitHub/LinkedIn e projetos).
- Criação de `public/robots.txt` e `public/sitemap.xml`.

### Otimização de Assets
- Conversão dos 5 logos de projetos (`talos-logo`, `drakon-logo`, `ai-logo`, `jasper-logo`, `panoptes-logo`) para `.webp` redimensionados em `256×256` (reduzindo ~4,6 MB → <150 KB).
- Conversão de `profile.jpg` para `profile.webp` (`512×512`) mantendo `public/preview.png` em PNG para compatibilidade universal com crawlers Open Graph (WhatsApp/LinkedIn/Twitter).

### Estratégia de Testes (Vitest)
Adicionar `vitest` em `devDependencies` e suíte unitária focada nas regras críticas:
1. `shared/__tests__/security.test.ts`: sanitização anti-XSS de URLs (`javascript:`, `data:`, `https:`, `mailto:`) e allowlist de CORS.
2. `shared/__tests__/dobbyActions.test.ts`: extração de `[[ACTION:open_project:...]]`, `[[ACTION:scroll:...]]`, `[[ACTION:lead_draft:...]]`, validação contra IDs inexistentes e ocultação de tags parciais durante streaming.
3. `shared/__tests__/buildDobbyPrompt.test.ts`: geração consistente em `pt` e `en`, garantia de ausência de telefone/WhatsApp e inclusão dos 5 projetos.
4. `api/__tests__/handlers.test.ts`: validação de payload, honeypot silencioso no `/api/contact`, rejeição de métodos não-POST e filtro de histórico `welcome-*`.
