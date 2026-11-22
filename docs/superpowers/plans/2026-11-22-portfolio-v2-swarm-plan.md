# Portfólio Fernando Calisto v2 — Plano de Implementação Multi-Agente (Swarm)

> **For agentic workers:** Execute Wave 0 sequentially on the base feature branch, then dispatch Wave 1 across 4 parallel Swarm workers (`workspace: "share"`, one dedicated git branch per worker, zero overlapping files), then merge and wire in Wave 2. Steps use checkbox (`- [ ]`) syntax for tracking. Every task ends with an atomic micro-commit.

**Goal:** Repaginar o portfólio de Fernando Henrique Braga Calisto com estética editorial *Atelier de Engenharia*, Hero 3D interativo em Three.js ("Sistema Saturno" com os 5 projetos orbitando clicáveis), diagramas arquiteturais SVG nos estudos de caso, suporte bilíngue completo (`pt`/`en`), Fonte Única de Verdade (`shared/`), Dobby como agente ativo (ações na UI + captação de leads confirmada) e hardening de APIs, assets e SEO.

**Architecture:** Um módulo puro `shared/` (sem dependências de React/DOM) serve simultaneamente o frontend (`src/`) e as Vercel Serverless Functions (`api/`), gerando dados bilíngues, o prompt do Dobby, o parser de ações em streaming e as regras de segurança/CORS. O Hero carrega a cena WebGL Three.js em chunk assíncrono (`React.lazy`) com fallback SVG acessível, enquanto as seções abaixo mantêm foco técnico, contraste WCAG AA e funil de conversão contextual.

**Tech Stack:** React 18, TypeScript 5.7, Vite 6, Tailwind CSS 3, Three.js (`three` + `@types/three`), Lucide React, Vitest, Vercel Serverless Functions, OpenRouter SSE, Telegram Bot API.

**Spec:** [2026-11-19-portfolio-redesign-and-architecture-design.md](file:///c:/Users/ferna/OneDrive/Documentos/Fernando%20Calisto/docs/superpowers/specs/2026-11-19-portfolio-redesign-and-architecture-design.md)

---

## Global Constraints

- **Privacidade absoluta:** remover `tel:+5518991554376` e toda menção a telefone/WhatsApp em componentes, dados, prompt do Dobby, mensagens de erro da API e JSON-LD. Canais oficiais: Formulário, `fernandocalisto.dev@gmail.com`, `https://github.com/fernandocalisto` e `https://www.linkedin.com/in/fernando-henrique-braga-calisto-34a703350/`.
- **Zero serviços externos novos:** sem Upstash Redis, sem bancos ou contas novas; manter apenas OpenRouter + Telegram Bot API + Vercel.
- **Sem botão de download de CV** neste ciclo.
- **Paleta & Contraste WCAG AA (`≥ 4.5:1`):** `obsidian: #0B0F13`, `surface: #12181F`, `card: #161E26`, `hairline: #24303C`, `ivory: #F1EFEA`, `muted: #94A3B8`, `teal: #185B63`, `tealLight: #38B2AC`, `gold: #C59538`, `copper: #D4722C`, `crimson: #D14338`.
- **Tipografia:** `Fraunces` (display), `DM Sans` (UI e corpo de texto), `JetBrains Mono` (somente código, diagramas, tags de stack e anos).
- **Performance & Acessibilidade:** `three` em chunk lazy separado; `devicePixelRatio` limitado (`≤ 2` desktop / `≤ 1.5` mobile); pausa WebGL via `IntersectionObserver` + `visibilitychange`; fallback SVG para `prefers-reduced-motion`/sem WebGL; logos em `.webp` (`256×256`, total < 150 KB) e `profile.webp` (`512×512`); `preview.png` mantido em PNG.
- **Idiomas:** `'pt'` (padrão) e `'en'`, sincronizados entre UI, dados, URL/DOM `<html lang>` e payload `locale` do `/api/chat`.
- **Micro-commits:** cada tarefa (e sub-etapa atômica relevante) gera seu próprio commit descritivo (`chore:`, `feat:`, `fix:`, `perf:`, `test:`).

## Review Focus

1. **Chunk parcial de diretiva `[[ACTION:...]]` no streaming SSE:** o parser deve ocultar tags incompletas (`[[ACT`, `[[ACTION:open_project:pa`) durante o streaming para nunca piscar sintaxe crua na tela, e extrair corretamente ao fechar `]]`. (Coberto em **Task 2**.)
2. **Injeção de URL ou payload malicioso pelo LLM:** `[x](javascript:alert(1))`, `[[ACTION:open_project:__proto__]]` e `[[ACTION:lead_draft:...]]` com e-mail inválido ou campos gigantes devem ser descartados/sanitizados sem quebrar a renderização. (Coberto em **Task 2** e **Task 3**.)
3. **Timeout em cascata e stream HTTP 200 vazio em `/api/chat.ts`:** orçamento global de `24.000 ms`, timeout individual de `7.000 ms` por tentativa, fallback final `'openrouter/free'` e emissão de erro SSE amigável se nenhum token for recebido. (Coberto em **Task 10**.)
4. **Honeypot preenchido e injeção HTML em `/api/contact.ts`:** campo `website` preenchido retorna `200 { success: true }` *sem* chamar o Telegram; tags `<script>` em `name`/`subject`/`message` são escapadas antes do `parse_mode: 'HTML'`. (Coberto em **Task 10**.)
5. **Sobreposição de overlays (`ProjectModal` + `ChatWidget`), `?projeto=` inválido e `welcome-*` pós-`clearChat`:** `Escape` fecha o chat antes do modal; query `?projeto=invalido` é ignorada com segurança; `clearChat()` não vaza mensagem de boas-vindas no `history`. (Coberto em **Task 8** e **Task 11**.)

---

## Estratégia de Execução no Swarm (Topologia DAG & Branches)

```text
main
 └── feat/portfolio-v2-foundation   (Wave 0 — Coordenador, sequencial, Tasks 1–4)
      ├── feat/hero-saturn-3d       (Wave 1 · Worker `saturn-3d`,   Task 5)
      ├── feat/sections-diagrams    (Wave 1 · Worker `sections-ui`, Tasks 6–7)
      ├── feat/dobby-agent-ui       (Wave 1 · Worker `dobby-ui`,    Task 8)
      └── feat/api-security-seo     (Wave 1 · Worker `backend-seo`, Tasks 9–10)
                │
                ▼ (Merge ordenado sem conflitos)
         feat/portfolio-v2          (Wave 2 — Coordenador, Task 11: Wiring, Build & QA Visual)
```

### Matriz de Propriedade Exclusiva na Wave 1 (Zero Conflitos de Arquivo)

| Frente / Branch | Worker Swarm | Arquivos Exclusivos |
|---|---|---|
| **A** `feat/hero-saturn-3d` | `saturn-3d` | `src/components/three/SaturnPortfolioScene.tsx`, `src/components/three/SaturnFallbackSvg.tsx`, `src/components/sections/Hero.tsx` |
| **B** `feat/sections-diagrams` | `sections-ui` | `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/sections/About.tsx`, `src/components/sections/Timeline.tsx`, `src/components/sections/Skills.tsx`, `src/components/sections/Projects.tsx`, `src/components/sections/Contact.tsx`, `src/components/ui/ProjectArchitectureDiagram.tsx`, `src/components/ui/ProjectModal.tsx`, `src/components/ui/Toast.tsx` |
| **C** `feat/dobby-agent-ui` | `dobby-ui` | `src/hooks/useChat.ts`, `src/components/chat/ChatMessageContent.tsx`, `src/components/chat/ChatMessageItem.tsx`, `src/components/chat/ChatQuickChips.tsx`, `src/components/chat/ChatWidget.tsx`, `src/hooks/__tests__/useChatHistory.test.ts` |
| **D** `feat/api-security-seo` | `backend-seo` | `api/chat.ts`, `api/contact.ts`, `api/__tests__/handlers.test.ts`, `vercel.json`, `index.html`, `public/robots.txt`, `public/sitemap.xml`, `README.md` |

> **Regra para workers da Wave 1:** Nenhum worker edita `package.json`, `shared/*`, `tailwind.config.js`, `src/index.css`, `src/App.tsx` ou arquivos de outro worker. Caso falte algum contrato em `shared/`, reportar ao coordenador.

---

## Mapa Completo de Arquivos

### Criados
- `tsconfig.api.json` — checagem TypeScript estrita para `api/` e `shared/`
- `vitest.config.ts` — configuração da suíte Vitest
- `shared/types.ts` — tipos canônicos de domínio, i18n, ações do Dobby e HTTP API
- `shared/portfolioData.ts` — fonte única de verdade (perfil, 5 projetos PT/EN + órbita + diagrama, 14 skills, 5 marcos timeline)
- `shared/security.ts` — `sanitizeSafeUrl`, `isAllowedOrigin`, `applyCorsHeaders`, `escapeHtml`, `validateContactPayload`
- `shared/dobbyActions.ts` — `parseDobbyMessage` (extração segura de `[[ACTION:...]]` em streaming)
- `shared/buildDobbyPrompt.ts` — gerador dinâmico do system prompt bilíngue do Dobby
- `shared/__tests__/security.test.ts`, `shared/__tests__/dobbyActions.test.ts`, `shared/__tests__/buildDobbyPrompt.test.ts`
- `src/i18n/translations.ts` — dicionário completo `pt` / `en` para labels da UI
- `src/context/LocaleContext.tsx` — provider + hook `useLocale()` sincronizado com `localStorage` e `<html lang>`
- `src/components/three/SaturnPortfolioScene.tsx` — cena Three.js + GLSL Fresnel + anéis de partículas + 5 satélites projetados 3D→2D
- `src/components/three/SaturnFallbackSvg.tsx` — fallback orbital SVG clicável
- `src/components/ui/ProjectArchitectureDiagram.tsx` — diagramas arquiteturais SVG interativos dos 5 projetos
- `src/hooks/__tests__/useChatHistory.test.ts` — testes de montagem de histórico pós-`clearChat`
- `api/__tests__/handlers.test.ts` — testes de `/api/contact` e `/api/chat`
- `public/assets/{talos-logo,drakon-logo,ai-logo,jasper-logo,panoptes-logo,profile}.webp`
- `public/robots.txt`, `public/sitemap.xml`

### Modificados
- `package.json`, `tsconfig.json`, `tailwind.config.js`, `src/index.css`, `vite.config.ts`
- `src/types/index.ts`, `src/types/chat.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/timeline.ts`
- `src/main.tsx`, `src/App.tsx`
- `src/components/layout/{Navbar,Footer}.tsx`
- `src/components/sections/{Hero,About,Timeline,Skills,Projects,Contact}.tsx`
- `src/components/ui/{ProjectModal,Toast}.tsx`
- `src/hooks/useChat.ts`, `src/components/chat/{ChatWidget,ChatMessageItem,ChatMessageContent,ChatQuickChips}.tsx`
- `api/chat.ts`, `api/contact.ts`, `vercel.json`, `index.html`, `README.md`

---

## WAVE 0 — Fundação & Contratos Compartilhados (`feat/portfolio-v2-foundation`)

### Task 1: Branch Base, Dependências, TypeScript (`api/` + `shared/`) e Vitest

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `tsconfig.api.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: scripts npm `test` (`vitest run`), `test:watch` (`vitest`), `typecheck` (`tsc --noEmit && tsc -p tsconfig.api.json --noEmit`), `build` (`npm run typecheck && vite build`); dependências `three`, `@types/three`, `vitest`.

- [ ] **Step 1: Criar a branch base da fundação**
  Run: `git checkout -b feat/portfolio-v2-foundation`
  Expected: `Switched to a new branch 'feat/portfolio-v2-foundation'`

- [ ] **Step 2: Instalar `three`, `@types/three` e `vitest`**
  Run: `npm install three; npm install -D @types/three vitest`
  Expected: `package.json` atualizado com `three` em `dependencies` e `@types/three`, `vitest` em `devDependencies`.

- [ ] **Step 3: Configurar `tsconfig.json`, `tsconfig.api.json`, `vitest.config.ts` e scripts em `package.json`**
  - Em `tsconfig.json`: incluir `"shared"` em `"include": ["src", "shared"]` e mapear `"@shared/*": ["shared/*"]` em `paths` (espelhando alias `@shared` em `vite.config.ts`).
  - Em `tsconfig.api.json`: estender `tsconfig.json` com `"include": ["api", "shared"]`, `"types": ["node"]`, `"strict": true`.
  - Em `vitest.config.ts`: `environment: 'node'`, `include: ['shared/**/*.test.ts', 'api/**/*.test.ts', 'src/**/*.test.ts']`.
  - Em `package.json`: adicionar scripts `"test": "vitest run"`, `"test:watch": "vitest"`, `"typecheck": "tsc --noEmit && tsc -p tsconfig.api.json --noEmit"`, `"build": "npm run typecheck && vite build"`.

- [ ] **Step 4: Validar que Vitest e `tsc` executam**
  Run: `npx vitest run --passWithNoTests`
  Expected: comando sai com código `0`.

- [ ] **Step 5: Micro-commit**
  ```powershell
  git add package.json package-lock.json tsconfig.json tsconfig.api.json vitest.config.ts vite.config.ts
  git commit -m "chore(tooling): add three, vitest and strict typecheck for api and shared"
  ```

---

### Task 2: Contratos de Domínio, Segurança e Parser de Ações do Dobby (`shared/`)

**Files:**
- Create: `shared/types.ts`
- Create: `shared/security.ts`
- Create: `shared/dobbyActions.ts`
- Test: `shared/__tests__/security.test.ts`
- Test: `shared/__tests__/dobbyActions.test.ts`

**Interfaces:**
- Produces em `shared/types.ts`:
  - `export type Locale = 'pt' | 'en';`
  - `export type LocalizedString = Record<Locale, string>;`
  - `export type ProjectId = 'talos' | 'drakon' | 'ai-ecosystem' | 'jasper' | 'panoptes';`
  - `export type SectionId = 'hero' | 'sobre' | 'timeline' | 'skills' | 'laboratorio' | 'contato';`
  - `export type ContactSubject = 'talos' | 'opportunity' | 'drakon' | 'project' | 'other';`
  - `export type ContactSource = 'form' | 'dobby_chat';`
  - `export interface LeadDraft { name: string; email: string; subject: ContactSubject; message: string; }`
  - `export type DobbyAction = { type: 'open_project'; projectId: ProjectId } | { type: 'scroll'; sectionId: Exclude<SectionId, 'hero'> } | { type: 'lead_draft'; draft: LeadDraft };`
  - `export interface ApiRequest { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown; socket?: { remoteAddress?: string }; on?: (event: string, listener: (...args: any[]) => void) => void; destroy?: () => void; }`
  - `export interface ApiResponse { statusCode: number; headersSent?: boolean; setHeader: (name: string, value: string) => void; write: (chunk: string) => void; end: (chunk?: string) => void; flushHeaders?: () => void; }`
- Produces em `shared/security.ts`:
  - `sanitizeSafeUrl(raw: string): string | null`
  - `isAllowedOrigin(origin: string | undefined, vercelUrl?: string): boolean`
  - `applyCorsHeaders(req: ApiRequest, res: ApiResponse, methods: string, vercelUrl?: string): void`
  - `escapeHtml(str: string): string`
  - `validateContactPayload(body: unknown): { ok: true; data: { name: string; email: string; subject: ContactSubject; message: string; source: ContactSource }; honeypotTriggered: boolean } | { ok: false; error: string }`
- Produces em `shared/dobbyActions.ts`:
  - `parseDobbyMessage(raw: string, validProjectIds?: readonly ProjectId[]): { visibleText: string; actions: DobbyAction[] }`

- [ ] **Step 1: Escrever os testes falhando em `shared/__tests__/security.test.ts` e `shared/__tests__/dobbyActions.test.ts`**
  - Em `security.test.ts`:
    - `sanitizeSafeUrl` aceita `https://fernandocalisto.com.br`, `http://localhost:3000`, `mailto:fernandocalisto.dev@gmail.com` e retorna `null` para `javascript:alert(1)`, `data:text/html,...`, `vbscript:foo`, string vazia.
    - `isAllowedOrigin` aceita `https://fernandocalisto.com.br`, `https://www.fernandocalisto.com.br`, `http://localhost:3000`, `https://preview-123.vercel.app` (quando `vercelUrl = 'preview-123.vercel.app'`), e rejeita `https://evil.com`.
    - `validateContactPayload` detecta `website: 'http://spam.bot'` como `honeypotTriggered: true`; rejeita e-mail inválido e campos > limite (`name > 120`, `email > 160`, `message > 4000`); escapa `<script>` via `escapeHtml`.
  - Em `dobbyActions.test.ts`:
    - Extrai `[[ACTION:open_project:panoptes]]` e `[[ACTION:scroll:contato]]` removendo do `visibleText`.
    - Rejeita `[[ACTION:open_project:__proto__]]` e `[[ACTION:scroll:hero]]` (não retornados em `actions`).
    - Extrai `[[ACTION:lead_draft:{"name":"Ana","email":"ana@corp.com","subject":"talos","message":"Quero automatizar ERP"}]]` validado; descarta `lead_draft` com e-mail inválido ou JSON quebrado.
    - Oculta tags parciais durante streaming (`"Veja o projeto [[ACT"` → `visibleText: "Veja o projeto"`, `actions: []`; `"Veja [[ACTION:open_project:tal"` → `visibleText: "Veja"`).

- [ ] **Step 2: Rodar os testes e confirmar falha**
  Run: `npx vitest run shared/__tests__/security.test.ts shared/__tests__/dobbyActions.test.ts`
  Expected: FAIL (`Cannot find module '../security'` / `'../dobbyActions'`).

- [ ] **Step 3: Implementar `shared/types.ts`, `shared/security.ts` e `shared/dobbyActions.ts`**
  - `sanitizeSafeUrl`: usar `new URL(trimmed)` e permitir apenas `protocol === 'https:' || protocol === 'http:' || protocol === 'mailto:'`.
  - `parseDobbyMessage`: primeiro extrair blocos fechados `\[\[ACTION:([a-z_]+):([\s\S]*?)\]\]` validando cada tipo, depois remover qualquer sufixo parcial `\[\[(?:A(?:C(?:T(?:I(?:O(?:N(?::[\s\S]*)?)?)?)?)?)?)?$` ao final da string para streaming limpo.

- [ ] **Step 4: Rodar os testes e confirmar aprovação**
  Run: `npx vitest run shared/__tests__/security.test.ts shared/__tests__/dobbyActions.test.ts`
  Expected: PASS (todos os cenários verdes).

- [ ] **Step 5: Micro-commit**
  ```powershell
  git add shared/types.ts shared/security.ts shared/dobbyActions.ts shared/__tests__/security.test.ts shared/__tests__/dobbyActions.test.ts
  git commit -m "feat(shared): add domain types, security guards and streaming action parser"
  ```

---

### Task 3: Fonte Única de Verdade (`shared/portfolioData.ts`) & Gerador de Prompt (`shared/buildDobbyPrompt.ts`)

**Files:**
- Create: `shared/portfolioData.ts`
- Create: `shared/buildDobbyPrompt.ts`
- Modify: `src/types/index.ts`, `src/types/chat.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/timeline.ts`
- Test: `shared/__tests__/buildDobbyPrompt.test.ts`

**Interfaces:**
- Produces em `shared/portfolioData.ts`:
  - `export const PROFILE: ProfileData` (sem telefone/WhatsApp; e-mail, GitHub, LinkedIn oficial)
  - `export const PROJECTS: readonly ProjectSpec[]` (5 projetos: `talos`, `drakon`, `ai-ecosystem`, `jasper`, `panoptes`, cada um com `title`, `shortName`, `subtitle`, `role`, `tag`, `summary`, `challenge`, `architecture`, `metrics` em `LocalizedString` / `LocalizedString[]`, além de `accentColor`, `badgeTextColor` AA-compliant, `logo: '/assets/<id>-logo.webp'`, `skillIds`, `orbit: { ringIndex: 0 | 1 | 2; radius: number; speed: number; initialAngle: number; size: number }`, `diagram: ProjectDiagramSpec`)
  - `export const SKILLS: readonly SkillSpec[]` (14 skills incluindo `opencv`, `fastapi`, `git-ci`, `vscode-api`, cada uma com `projectIds: ProjectId[]` em vez de rótulo `"Intermediário"`)
  - `export const TIMELINE: readonly TimelineSpec[]` (5 marcos `2022`–`2026` em `pt` e `en`)
  - `export const PROJECT_IDS: readonly ProjectId[]`
- Produces em `shared/buildDobbyPrompt.ts`:
  - `export function buildDobbyPrompt(locale: Locale): string`

- [ ] **Step 1: Escrever teste falhando em `shared/__tests__/buildDobbyPrompt.test.ts`**
  - Assert: `buildDobbyPrompt('pt')` e `buildDobbyPrompt('en')` incluem todos os 5 projetos (`TALOS`, `DRAKON`, `JasperReports`, `PANOPTES`), o e-mail `fernandocalisto.dev@gmail.com`, instruções das diretivas `[[ACTION:open_project:...]]`, `[[ACTION:scroll:...]]`, `[[ACTION:lead_draft:...]]`, e **não** contêm `991554376` nem `whatsapp` (case-insensitive).
  - Assert: `buildDobbyPrompt('en')` instrui Dobby explicitamente a responder em inglês.
  - Assert: todas as `SKILLS` têm pelo menos 1 `projectId` válido em `PROJECT_IDS` e nenhuma usa logo `.jpg`/`.png` (todas `.webp`).

- [ ] **Step 2: Rodar teste para confirmar falha**
  Run: `npx vitest run shared/__tests__/buildDobbyPrompt.test.ts`
  Expected: FAIL (`Cannot find module '../buildDobbyPrompt'`).

- [ ] **Step 3: Implementar `shared/portfolioData.ts`, `shared/buildDobbyPrompt.ts` e adaptadores retrocompatíveis em `src/data/*` + `src/types/*`**
  - Em `shared/portfolioData.ts`: definir `badgeTextColor` acessível (`#F4A261` para TALOS, `#F87171` para DRAKON, `#38B2AC` para AI Ecosystem, `#60A5FA` para JasperReports, `#E5B85B` para PANOPTES) e os nós/arestas de `diagram` para cada projeto (usados na Task 7).
  - Em `src/data/{projects,skills,timeline}.ts`: exportar adaptadores derivados de `shared/portfolioData.ts` (mantendo o build verde até a Wave 1 atualizar os componentes).

- [ ] **Step 4: Rodar testes**
  Run: `npx vitest run`
  Expected: PASS em todas as suítes `shared/__tests__/*`.

- [ ] **Step 5: Micro-commit**
  ```powershell
  git add shared/portfolioData.ts shared/buildDobbyPrompt.ts shared/__tests__/buildDobbyPrompt.test.ts src/types/index.ts src/types/chat.ts src/data/projects.ts src/data/skills.ts src/data/timeline.ts
  git commit -m "feat(shared): unify bilingual portfolio data and dynamic Dobby prompt"
  ```

---

### Task 4: Otimização de Assets WebP, Design Tokens, Fontes e `LocaleContext`

**Files:**
- Create: `public/assets/{talos-logo,drakon-logo,ai-logo,jasper-logo,panoptes-logo,profile}.webp`
- Delete (após conversão): `public/assets/{talos-logo.jpg,drakon-logo.png,ai-logo.png,jasper-logo.jpg,panoptes-logo.jpg,profile.jpg}`
- Modify: `tailwind.config.js`, `src/index.css`, `index.html` (somente Google Fonts + body base class)
- Create: `src/i18n/translations.ts`
- Create: `src/context/LocaleContext.tsx`

**Interfaces:**
- Produces em `src/context/LocaleContext.tsx`:
  - `export const LocaleProvider: React.FC<{ children: React.ReactNode }>`
  - `export function useLocale(): { locale: Locale; setLocale: (next: Locale) => void; toggleLocale: () => void; t: TranslationDictionary }`

- [ ] **Step 1: Converter os 5 logos para `256×256 .webp` e `profile.jpg` para `512×512 .webp` usando Pillow**
  Run:
  ```powershell
  python -c "from PIL import Image, ImageOps; import os; files=[('talos-logo.jpg',256),('drakon-logo.png',256),('ai-logo.png',256),('jasper-logo.jpg',256),('panoptes-logo.jpg',256),('profile.jpg',512)]; [ImageOps.fit(Image.open(f'public/assets/{f}').convert('RGBA' if f.endswith('.png') else 'RGB'),(s,s),Image.Resampling.LANCZOS).save(f'public/assets/{os.path.splitext(f)[0]}.webp','WEBP',quality=85,method=6) for f,s in files]"
  ```
  - Verificar tamanhos com `Get-ChildItem public/assets/*.webp | Select Name, Length`: soma dos 5 logos deve ficar **< 150 KB**.
  - Remover os 6 arquivos originais `.jpg`/`.png` pesados de `public/assets/` (mantendo `public/preview.png` intacto!).

- [ ] **Step 2: Micro-commit da otimização de assets**
  ```powershell
  git add public/assets/
  git commit -m "perf(assets): convert logos and profile portrait to optimized webp"
  ```

- [ ] **Step 3: Atualizar `tailwind.config.js`, `src/index.css` e fontes em `index.html`**
  - Em `index.html`: carregar `Fraunces` (opsz,wght@9..144,500..800), `DM Sans` (400;500;600;700) e `JetBrains Mono` (400;500;600;700).
  - Em `tailwind.config.js`: registrar paleta evoluída (`obsidian`, `surface`, `card`, `cardHover`, `hairline`, `ivory`, `muted`, `teal`, `tealHover`, `tealLight`, `gold`, `copper`, `crimson` — preservando aliases antigos como `dark`/`border`/`amber` apontando para os novos tokens até os workers atualizarem tudo), `fontFamily: { display: ['Fraunces', 'Georgia', 'serif'], sans: ['"DM Sans"', 'sans-serif'], mono: ['"JetBrains Mono"', 'monospace'] }` e keyframes reais `fadeIn`, `slideUp`, `chatEnter`, `orbitPulse`.
  - Em `src/index.css`: fundo `#0B0F13`, overlay sutil de *film grain*, scrollbar fina `.chat-scrollbar` e `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 4: Criar `src/i18n/translations.ts` e `src/context/LocaleContext.tsx`**
  - Cobrir todas as chaves de UI em `pt` e `en`: `nav`, `hero`, `about`, `timeline`, `skills`, `projects`, `modal`, `contact`, `chat`, `footer`, `toast`.
  - `LocaleProvider` lê/persiste `localStorage.getItem('fc_portfolio_locale')` com fallback `'pt'` e atualiza `document.documentElement.lang` (`pt-BR` ou `en`).

- [ ] **Step 5: Validar `npm run typecheck` e `npm run test`**
  Run: `npm run typecheck; if ($?) { npm run test }`
  Expected: zero erros de TypeScript e todos os testes passando.

- [ ] **Step 6: Micro-commit do Design System + i18n**
  ```powershell
  git add tailwind.config.js src/index.css index.html src/i18n/translations.ts src/context/LocaleContext.tsx
  git commit -m "feat(design-system): add editorial palette, typography, keyframes and PT/EN i18n"
  ```

---

## WAVE 1 — 4 Frentes Paralelas no Swarm (Branches & Workspaces Compartilhados)

> **Pré-requisito:** Wave 0 concluída em `feat/portfolio-v2-foundation`. O coordenador spawna os 4 workers em paralelo via `swarm(action: "add", workspace: "share", ...)`, cada um criando sua branch a partir de `feat/portfolio-v2-foundation`.

---

### Frente A (`feat/hero-saturn-3d` · Worker `saturn-3d`)

#### Task 5: Hero Artístico Full-Bleed & Sistema Saturno 3D Interativo

**Files:**
- Create: `src/components/three/SaturnFallbackSvg.tsx`
- Create: `src/components/three/SaturnPortfolioScene.tsx`
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `PROJECTS` (`shared/portfolioData.ts`), `ProjectId` (`shared/types.ts`), `useLocale()` (`src/context/LocaleContext.tsx`).
- Produces em `src/components/sections/Hero.tsx`:
  - `export interface HeroProps { onSelectProject: (projectId: ProjectId) => void; }`
  - `export const Hero: React.FC<HeroProps>`

- [ ] **Step 1: Criar branch `feat/hero-saturn-3d` a partir de `feat/portfolio-v2-foundation`**
  Run: `git checkout -b feat/hero-saturn-3d`

- [ ] **Step 2: Implementar `src/components/three/SaturnFallbackSvg.tsx`**
  - Ilustração vetorial orbital elegante (planeta central com gradiente bronze/teal, elipses inclinadas de anéis, 5 botões acessíveis posicionados ao longo das órbitas chamando `onSelectProject(project.id)`). Usado quando `prefers-reduced-motion: reduce` ou WebGL falhar.

- [ ] **Step 3: Micro-commit do fallback SVG**
  ```powershell
  git add src/components/three/SaturnFallbackSvg.tsx
  git commit -m "feat(hero): add accessible orbital SVG fallback for Saturn 3D scene"
  ```

- [ ] **Step 4: Implementar `src/components/three/SaturnPortfolioScene.tsx`**
  - Cena `three` pura (sem R3F):
    - Planeta central com `ShaderMaterial` GLSL customizado (obsidiana `#0B0F13` + Fresnel bronze/ouro `#C59538`/`#D4722C` + filamento interno `#2DD4BF`).
    - Disco de anéis inclinado (`~24°`): `THREE.Points` (2.200 partículas desktop / 1.000 mobile) distribuídas em anéis concêntricos com variação de brilho ouro/bronze + 3 trilhas orbitais finas (`THREE.LineLoop` / `THREE.TorusGeometry`).
    - 5 satélites 3D (`THREE.Mesh` + halo `Sprite`/`MeshBasicMaterial`) orbitando segundo `project.orbit`, sincronizando marcadores HTML clicáveis via `vector.project(camera)` (escala/opacidade/z-index conforme profundidade `z`).
    - Hover/foco em um satélite desacelera a velocidade orbital para `0.15x` e exibe micro-preview (nome + papel localizado).
    - Desktop: lerp suave de inclinação seguindo ponteiro; Mobile (`width < 640`): câmera afastada para enquadrar Saturno inteiro na metade superior, arraste horizontal rotacionando com `touch-action: pan-y`.
    - Guardrails: `IntersectionObserver` + `visibilitychange` pausando `requestAnimationFrame`; `dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)`; dispose completo de geometrias/materiais/renderer no unmount; fallback para `<SaturnFallbackSvg />` se `WebGLRenderer` lançar erro.

- [ ] **Step 5: Micro-commit da cena WebGL**
  ```powershell
  git add src/components/three/SaturnPortfolioScene.tsx
  git commit -m "feat(hero): build interactive Three.js Saturn scene with orbiting project nodes"
  ```

- [ ] **Step 6: Redesenhar `src/components/sections/Hero.tsx`**
  - Full-bleed `min-h-[100svh]` sem caixas de terminal ou métricas genéricas.
  - `const SaturnPortfolioScene = React.lazy(() => import('../three/SaturnPortfolioScene'))` dentro de `<Suspense fallback={<SaturnFallbackSvg ... />}>`, detectando `prefers-reduced-motion`.
  - Tipografia monumental `Fraunces` (`clamp(2.6rem, 7.5vw, 6.2rem)`), subtítulo conciso localizado, 2 ações limpas (`#laboratorio` e `#contato`) e indicador sutil de scroll.

- [ ] **Step 7: Validar build e chunking assíncrono do `three`**
  Run: `npm run typecheck; if ($?) { npx vite build }`
  Expected: build verde com `SaturnPortfolioScene` / `three` em chunk separado do `index-*.js`.

- [ ] **Step 8: Micro-commit do Hero**
  ```powershell
  git add src/components/sections/Hero.tsx
  git commit -m "feat(hero): redesign full-bleed editorial Hero with lazy Saturn 3D"
  ```

---

### Frente B (`feat/sections-diagrams` · Worker `sections-ui`)

#### Task 6: Navbar com ScrollSpy + Bilíngue, Footer, Sobre (Sem Telefone), Trajetória & Skills Cruzadas

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/sections/About.tsx`
- Modify: `src/components/sections/Timeline.tsx`
- Modify: `src/components/sections/Skills.tsx`

**Interfaces:**
- Produces:
  - `Navbar: React.FC<{ activeSection: SectionId }>`
  - `Skills: React.FC<{ selectedSkillId: string | null; onSelectSkill: (skillId: string | null) => void }>`

- [ ] **Step 1: Criar branch `feat/sections-diagrams` a partir de `feat/portfolio-v2-foundation`**
  Run: `git checkout -b feat/sections-diagrams`

- [ ] **Step 2: Atualizar `Navbar.tsx` e `Footer.tsx`**
  - `Navbar`: barra de progresso de leitura (`1.5px`) no topo, destaque real de `activeSection`, toggle `PT | EN` usando `useLocale()`, menu mobile com `animate-fadeIn`, fechamento via `Escape` e clique fora.
  - `Footer`: textos localizados via `useLocale()` e estética editorial limpa com `brand-hairline`.

- [ ] **Step 3: Micro-commit de Navbar e Footer**
  ```powershell
  git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
  git commit -m "feat(layout): add reading progress, ScrollSpy highlight and PT/EN toggle"
  ```

- [ ] **Step 4: Refatorar `About.tsx` e `Timeline.tsx`**
  - `About.tsx`: layout editorial assimétrico, imagem `/assets/profile.webp` com `width={224} height={224}`, textos via `useLocale()`, **remoção total do link `tel:+5518991554376`** (apenas E-mail, GitHub, LinkedIn).
  - `Timeline.tsx`: consome `TIMELINE` de `shared/portfolioData.ts`, texto da descrição em `font-sans` (`DM Sans`), suporte a teclas `ArrowLeft` / `ArrowRight` no container com `tabIndex={0}`.

- [ ] **Step 5: Micro-commit de About e Timeline**
  ```powershell
  git add src/components/sections/About.tsx src/components/sections/Timeline.tsx
  git commit -m "feat(sections): refine editorial About without phone and accessible Timeline"
  ```

- [ ] **Step 6: Refatorar `Skills.tsx` com evidência prática e filtro cruzado**
  - Consome `SKILLS` e `PROJECTS` de `shared/portfolioData.ts`.
  - Substitui `"Intermediário"` por contagem/nomes dos projetos reais onde a skill é usada (ex.: `"TALOS · DRAKON"`).
  - Clicar em uma skill chama `onSelectSkill(skill.id)` (ou limpa se já ativa) e oferece navegação suave até `#laboratorio`.

- [ ] **Step 7: Micro-commit de Skills**
  ```powershell
  git add src/components/sections/Skills.tsx
  git commit -m "feat(skills): show real project evidence and interactive project cross-filter"
  ```

---

#### Task 7: Diagramas Arquiteturais SVG, Projetos, `ProjectModal` Acessível, Contato Contextual & Toast

**Files:**
- Create: `src/components/ui/ProjectArchitectureDiagram.tsx`
- Modify: `src/components/sections/Projects.tsx`
- Modify: `src/components/ui/ProjectModal.tsx`
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/components/ui/Toast.tsx`

**Interfaces:**
- Produces:
  - `ProjectArchitectureDiagram: React.FC<{ project: ProjectSpec; locale: Locale }>`
  - `Projects: React.FC<{ onSelectProject: (project: ProjectSpec) => void; selectedSkillId: string | null; onClearSkillFilter: () => void; highlightedProjectId: ProjectId | null }>`
  - `ProjectModal: React.FC<{ project: ProjectSpec | null; onClose: () => void; onAskDobby: (project: ProjectSpec) => void; onDiscussProject: (project: ProjectSpec) => void; isEscapeSuppressed?: boolean }>`
  - `Contact: React.FC<{ prefill: { subject: ContactSubject; projectTitle?: string; nonce: number } | null; onSuccess: (message: string) => void; onError: (message: string) => void }>`

- [ ] **Step 1: Implementar `src/components/ui/ProjectArchitectureDiagram.tsx`**
  - Renderiza o grafo de `project.diagram` (`nodes` + `edges`) em SVG responsivo com setas direcionais, cores da paleta e estado `activeNodeId`: ao passar o mouse ou focar/clicar em qualquer nó (acessível via teclado), exibe a explicação técnica detalhada do estágio em `PT` ou `EN`.

- [ ] **Step 2: Micro-commit dos diagramas SVG**
  ```powershell
  git add src/components/ui/ProjectArchitectureDiagram.tsx
  git commit -m "feat(projects): add interactive SVG architecture diagrams for all 5 cases"
  ```

- [ ] **Step 3: Atualizar `Projects.tsx` e `ProjectModal.tsx`**
  - `Projects.tsx`: consome `PROJECTS`, usa logos `.webp` (`width={56} height={56}`), usa `badgeTextColor` AA-compliant, suporta filtro por categoria + filtro cruzado por `selectedSkillId` (com banner de limpeza), e destaca visualmente `highlightedProjectId` (quando vindo do Saturno 3D).
  - `ProjectModal.tsx`: embute `<ProjectArchitectureDiagram />`, implementa **focus trap** (`Tab` / `Shift+Tab` dentro do modal) + restauração de foco no fechamento, respeita `isEscapeSuppressed` (para não fechar quando o chat estiver acima), adiciona botão **"Perguntar ao Dobby"** (`onAskDobby`) e conecta **"Conversar sobre este projeto"** a `onDiscussProject`.

- [ ] **Step 4: Micro-commit de Projects e ProjectModal**
  ```powershell
  git add src/components/sections/Projects.tsx src/components/ui/ProjectModal.tsx
  git commit -m "feat(projects): add WCAG badges, skill cross-filter, focus trap and Dobby CTA"
  ```

- [ ] **Step 5: Refatorar `Contact.tsx` e reposicionar `Toast.tsx`**
  - `Contact.tsx`:
    - Botão **"Copiar e-mail"** com `navigator.clipboard.writeText(PROFILE.email)` + callback `onSuccess`.
    - Seletor `<select>` de `subject` (`ContactSubject`), pré-preenchido via `useEffect` quando `prefill` muda (incluindo rascunho de mensagem mencionando `prefill.projectTitle`).
    - Campo honeypot oculto (`name="website"`, `aria-hidden="true"`, `tabIndex={-1}`, `autoComplete="off"`, posicionado fora da tela com `sr-only`).
    - Envia `{ name, email, subject, message, source: 'form', website }` para `POST /api/contact`.
    - Mensagens de erro nunca mencionam WhatsApp (sugerem `fernandocalisto.dev@gmail.com`).
  - `Toast.tsx`: mover de `bottom-6 right-6 z-50` para `top-20 right-6 z-[100000]` usando `animate-slideUp` real.

- [ ] **Step 6: Validar `npm run typecheck`**
  Run: `npm run typecheck`
  Expected: zero erros nos componentes da Frente B (ignorar apenas eventual ajuste de props em `App.tsx`, que será feito na Wave 2 — manter defaults opcionais nas props novas se necessário para `typecheck` passar limpo na própria branch!).

- [ ] **Step 7: Micro-commit de Contact e Toast**
  ```powershell
  git add src/components/sections/Contact.tsx src/components/ui/Toast.tsx
  git commit -m "feat(contact): add subject selector, project prefill, copy email, honeypot and Toast position fix"
  ```

---

### Frente C (`feat/dobby-agent-ui` · Worker `dobby-ui`)

#### Task 8: Dobby Agente Ativo, Correções de Bugs do Chat & Testes de Histórico

**Files:**
- Modify: `src/hooks/useChat.ts`
- Modify: `src/components/chat/ChatMessageContent.tsx`
- Modify: `src/components/chat/ChatMessageItem.tsx`
- Modify: `src/components/chat/ChatQuickChips.tsx`
- Modify: `src/components/chat/ChatWidget.tsx`
- Test: `src/hooks/__tests__/useChatHistory.test.ts`

**Interfaces:**
- Consumes: `parseDobbyMessage` (`shared/dobbyActions.ts`), `sanitizeSafeUrl` (`shared/security.ts`), `PROJECTS` (`shared/portfolioData.ts`), `useLocale()` (`src/context/LocaleContext.tsx`).
- Produces:
  - `export function buildHistoryPayload(messages: ChatMessage[]): ChatHistoryItem[]` (função pura exportada de `src/hooks/useChat.ts` para teste unitário)
  - `ChatWidget: React.FC<{ isOpen?: boolean; onOpenChange?: (open: boolean) => void; pendingPrompt?: { text: string; nonce: number } | null; onExecuteAction?: (action: DobbyAction) => void; onNotify?: (message: string, type: 'success' | 'error') => void }>`

- [ ] **Step 1: Criar branch `feat/dobby-agent-ui` a partir de `feat/portfolio-v2-foundation`**
  Run: `git checkout -b feat/dobby-agent-ui`

- [ ] **Step 2: Escrever teste falhando em `src/hooks/__tests__/useChatHistory.test.ts`**
  - Assert: `buildHistoryPayload` exclui tanto `id: 'welcome-msg'` quanto `id: 'welcome-1700000000000'` (pós-`clearChat`), exclui mensagens com `error: true` e conteúdo vazio, limita aos últimos 8 itens e preserva texto limpo.

- [ ] **Step 3: Rodar teste para confirmar falha**
  Run: `npx vitest run src/hooks/__tests__/useChatHistory.test.ts`
  Expected: FAIL (`buildHistoryPayload` não exportada).

- [ ] **Step 4: Atualizar `src/hooks/useChat.ts`**
  - Exportar `buildHistoryPayload` corrigindo o filtro para `!m.id.startsWith('welcome-')`.
  - Aceitar `locale: Locale` em `useChat(locale)`: envia `{ message, history, locale }` para `POST /api/chat` e gera mensagem de boas-vindas localizada (`PT`/`EN`).
  - Expor `retryLastMessage()` que reenvia a última mensagem do usuário caso a última resposta do modelo tenha `error: true`.
  - Manter `useChat()` funcionando com default `locale = 'pt'` para não quebrar `App.tsx` antes da Wave 2.

- [ ] **Step 5: Rodar teste e confirmar aprovação**
  Run: `npx vitest run src/hooks/__tests__/useChatHistory.test.ts`
  Expected: PASS.

- [ ] **Step 6: Micro-commit do `useChat`**
  ```powershell
  git add src/hooks/useChat.ts src/hooks/__tests__/useChatHistory.test.ts
  git commit -m "fix(chat): exclude all welcome-* messages after reset, add locale and retry"
  ```

- [ ] **Step 7: Atualizar `ChatMessageContent.tsx`, `ChatMessageItem.tsx`, `ChatQuickChips.tsx` e `ChatWidget.tsx`**
  - `ChatMessageContent.tsx`: passar todo link `[label](url)` por `sanitizeSafeUrl(url)` — se retornar `null`, renderizar apenas texto plano `label` (zero `href` inseguro).
  - `ChatMessageItem.tsx`:
    - Processar `message.content` via `parseDobbyMessage(message.content)` exibindo `visibleText` no `ChatMessageContent`.
    - Renderizar botões de ação para `open_project` (*"Abrir estudo de caso: <Nome>"*) e `scroll` (*"Ir para <Seção>"*) chamando `onExecuteAction(action)`.
    - Renderizar **Card de Confirmação de Lead** para `lead_draft` exibindo Nome, E-mail, Assunto e Mensagem + botão **"Confirmar e enviar ao Fernando"** que chama `POST /api/contact` com `source: 'dobby_chat'` (estados: `idle | sending | sent | error`).
    - Adicionar botão de **copiar resposta** e, quando `message.error`, botão **"Tentar novamente"**.
  - `ChatQuickChips.tsx`: consumir prompts localizados em `PT` e `EN`.
  - `ChatWidget.tsx`:
    - Corrigir o bug dos chips: estado `manualShowChips` independente, exibindo chips quando `(messages.length <= 2 && !chipsDismissed) || manualShowChips`.
    - Substituir `<input>` por `<textarea>` auto-expansível (`Enter` envia, `Shift+Enter` quebra linha) + contador discreto quando `inputValue.length >= 400`.
    - Suportar controle externo opcional (`isOpen`, `onOpenChange`, `pendingPrompt` disparando `sendMessage` automaticamente quando `nonce` mudar) e usar animação real `animate-chatEnter` + `.chat-scrollbar`.

- [ ] **Step 8: Rodar testes e `typecheck`**
  Run: `npm run test; if ($?) { npm run typecheck }`
  Expected: PASS.

- [ ] **Step 9: Micro-commit da UI do Dobby Agente**
  ```powershell
  git add src/components/chat/ChatMessageContent.tsx src/components/chat/ChatMessageItem.tsx src/components/chat/ChatQuickChips.tsx src/components/chat/ChatWidget.tsx
  git commit -m "feat(chat): add Dobby action cards, lead confirmation, XSS guard, textarea and chips fix"
  ```

---

### Frente D (`feat/api-security-seo` · Worker `backend-seo`)

#### Task 9: SEO Técnico Completo, Headers de Segurança (`vercel.json`) e `README.md`

**Files:**
- Modify: `index.html`
- Modify: `vercel.json`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `README.md`

- [ ] **Step 1: Criar branch `feat/api-security-seo` a partir de `feat/portfolio-v2-foundation`**
  Run: `git checkout -b feat/api-security-seo`

- [ ] **Step 2: Atualizar `index.html` com SEO técnico e JSON-LD**
  - Alterar `og:image` e `twitter:image` para `https://fernandocalisto.com.br/preview.png`.
  - Adicionar `<link rel="canonical" href="https://fernandocalisto.com.br/" />`.
  - Inserir `<script type="application/ld+json">` com `@graph` contendo `Person` (`Fernando Henrique Braga Calisto`, `jobTitle`, `url`, `email`, `sameAs: [GitHub, LinkedIn]`, sem telefone) e `WebSite`.

- [ ] **Step 3: Criar `public/robots.txt`, `public/sitemap.xml` e atualizar `vercel.json` + `README.md`**
  - `public/robots.txt`: `User-agent: *`, `Allow: /`, `Sitemap: https://fernandocalisto.com.br/sitemap.xml`.
  - `public/sitemap.xml`: URL principal `https://fernandocalisto.com.br/`.
  - `vercel.json`: adicionar bloco de headers para `/(.*)` com `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` (mantendo `Cache-Control` de `/assets/(.*)`, rewrites e `functions`).
  - `README.md`: corrigir link do LinkedIn para `https://www.linkedin.com/in/fernando-henrique-braga-calisto-34a703350/` e atualizar a descrição das funcionalidades (Saturno 3D, PT/EN, Dobby agente, diagramas SVG).

- [ ] **Step 4: Micro-commit de SEO & Headers**
  ```powershell
  git add index.html vercel.json public/robots.txt public/sitemap.xml README.md
  git commit -m "feat(seo): add absolute OG image, JSON-LD, sitemap, robots and security headers"
  ```

---

#### Task 10: Hardening de `/api/chat.ts` e `/api/contact.ts` com Testes Vitest

**Files:**
- Modify: `api/chat.ts`
- Modify: `api/contact.ts`
- Test: `api/__tests__/handlers.test.ts`

**Interfaces:**
- Consumes: `buildDobbyPrompt` (`shared/buildDobbyPrompt.ts`), `applyCorsHeaders`, `escapeHtml`, `validateContactPayload` (`shared/security.ts`), `ApiRequest`, `ApiResponse` (`shared/types.ts`).

- [ ] **Step 1: Escrever testes falhando em `api/__tests__/handlers.test.ts`**
  - `/api/contact`:
    - Rejeita `GET` com `405`.
    - Aplica CORS apenas para origens permitidas (`https://fernandocalisto.com.br` sim, `https://evil.com` sem header `Access-Control-Allow-Origin`).
    - Honeypot `website: 'https://spam.ru'` retorna `200 { success: true }` e **não** invoca `fetch` do Telegram (`expect(fetchMock).not.toHaveBeenCalled()`).
    - Payload válido com `subject: 'talos'`, `source: 'dobby_chat'` e `<script>alert(1)</script>` no `name` chama Telegram com HTML escapado e badge de origem `Lead Qualificado via Dobby`, sem mencionar WhatsApp em erros `500`.
  - `/api/chat`:
    - Rejeita `GET` com `405` e mensagem vazia com `400`.
    - Usa `locale: 'en'` para gerar system prompt em inglês na chamada ao OpenRouter.
    - Quando o 1º modelo falha (`503`), faz fallback automático para o próximo modelo até obter stream válido.
    - Quando o upstream responde HTTP `200` com `data: [DONE]` e zero conteúdo de texto, emite evento SSE `{ error: ... }` em vez de encerrar silenciosamente vazio.

- [ ] **Step 2: Rodar testes para confirmar falha**
  Run: `npx vitest run api/__tests__/handlers.test.ts`
  Expected: FAIL (comportamento antigo usa `CORS *`, sem honeypot, sem `locale`, sem tratamento de stream vazio).

- [ ] **Step 3: Refatorar `api/contact.ts` e `api/chat.ts`**
  - `api/contact.ts`: tipar `(req: ApiRequest, res: ApiResponse)`, usar `applyCorsHeaders`, `validateContactPayload`, `escapeHtml`, honeypot silencioso, `AbortController` de `8000 ms` no `fetch` ao Telegram, formatar `subject` e `source` na mensagem HTML, remover menção a WhatsApp do fallback de erro.
  - `api/chat.ts`: tipar `(req: ApiRequest, res: ApiResponse)`, usar `applyCorsHeaders`, `buildDobbyPrompt(locale)`, orçamento global `TOTAL_BUDGET_MS = 24_000`, `PER_MODEL_TIMEOUT_MS = 7_000` (calculado como `Math.min(7000, remainingBudget)`), incluir `'openrouter/free'` como último item de `DEFAULT_MODELS`, rastrear `emittedChars > 0` durante leitura do stream e emitir evento `{ error }` amigável caso termine com `0` caracteres.

- [ ] **Step 4: Rodar testes e `typecheck` (incluindo `tsconfig.api.json`)**
  Run: `npm run test; if ($?) { npm run typecheck }`
  Expected: PASS em todos os testes de `api/` e `shared/`, zero erros de TypeScript.

- [ ] **Step 5: Micro-commit das APIs**
  ```powershell
  git add api/chat.ts api/contact.ts api/__tests__/handlers.test.ts
  git commit -m "feat(api): harden chat timeout budget, empty stream handling, CORS, honeypot and strict types"
  ```

---

## WAVE 2 — Integração das Branches, Wiring Final & Verificação (`feat/portfolio-v2`)

### Task 11: Merge das 4 Frentes, Wiring em `App.tsx`/`main.tsx` e QA Final

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Criar branch integradora `feat/portfolio-v2` a partir de `feat/portfolio-v2-foundation` e fazer merge das 4 branches da Wave 1**
  Run:
  ```powershell
  git checkout -b feat/portfolio-v2 feat/portfolio-v2-foundation
  git merge --no-ff feat/api-security-seo -m "merge: integrate api hardening, security and SEO"
  git merge --no-ff feat/dobby-agent-ui -m "merge: integrate Dobby agent UI and chat fixes"
  git merge --no-ff feat/sections-diagrams -m "merge: integrate editorial sections, SVG diagrams and contextual contact"
  git merge --no-ff feat/hero-saturn-3d -m "merge: integrate interactive Saturn 3D Hero"
  ```
  Expected: merges limpos sem conflitos.

- [ ] **Step 2: Conectar toda a orquestração em `src/main.tsx` e `src/App.tsx`**
  - Em `src/main.tsx`: envolver `<App />` com `<LocaleProvider>`.
  - Em `src/App.tsx`:
    - **ScrollSpy** via `IntersectionObserver` atualizando `activeSection` passado para `<Navbar activeSection={activeSection} />`.
    - **Deep-linking `?projeto=<id>`**: ler `URLSearchParams` na montagem (ignorando IDs inválidos), abrir modal + rolar até `#laboratorio`, e sincronizar `?projeto=` via `window.history.replaceState` ao abrir/fechar.
    - **Saturno 3D → Projetos**: `handleSelectProjectById(id)` rola suavemente para `#laboratorio`, define `highlightedProjectId` (por 2.5s) e abre o `ProjectModal`.
    - **Skills → Projetos**: estado `selectedSkillId` conectando `<Skills>` e `<Projects>`.
    - **Modal → Dobby & Contato**: `handleAskDobby(project)` fecha o modal, abre o chat e passa `pendingPrompt` localizado; `handleDiscussProject(project)` fecha o modal, define `contactPrefill` (`subject: 'project'`, `projectTitle`) e rola até `#contato`.
    - **Dobby → Página**: `handleDobbyAction(action)` executa `open_project` (abre modal + fecha chat no mobile) e `scroll` (rola suave para `#<sectionId>` + fecha chat no mobile).
    - **Hierarquia `Escape`**: passar `isEscapeSuppressed={isChatOpen}` ao `ProjectModal`.
    - **Toast seguro**: usar `toastTimerRef = useRef<number | null>(null)` limpando timeout anterior antes de agendar `4500 ms` + cleanup no unmount.

- [ ] **Step 3: Micro-commit do Wiring**
  ```powershell
  git add src/main.tsx src/App.tsx
  git commit -m "feat(app): wire LocaleProvider, Saturn navigation, deep-links, Dobby actions and Toast timer fix"
  ```

- [ ] **Step 4: Verificação completa (Testes + Typecheck + Build + Inspeção de Bundle)**
  Run: `npm run test; if ($?) { npm run build }`
  Expected:
  - Todos os testes Vitest passando (`shared/__tests__/*`, `src/hooks/__tests__/*`, `api/__tests__/*`).
  - `tsc --noEmit` e `tsc -p tsconfig.api.json --noEmit` com zero erros.
  - `vite build` concluído com chunk separado para `SaturnPortfolioScene` / `three`.
  - Confirmar ausência total de telefone/WhatsApp no projeto: `Get-ChildItem -Recurse src,shared,api,index.html -File | Where-Object { $_.FullName -notmatch '__tests__' } | Select-String -Pattern "991554376|whatsapp"` retorna vazio.

- [ ] **Step 5: Verificação Visual & Funcional no Navegador (Desktop + Mobile)**
  - Subir `npm run dev` e inspecionar visualmente via browser subagent em viewport Desktop (`1440×900`) e Mobile (`390×844`):
    - Hero Saturno 3D renderizando sem erros no console, satélites clicáveis rolando e abrindo o modal.
    - Toggle `PT | EN` traduzindo toda a página e o Dobby.
    - Diagramas SVG nos 5 modais de projeto + botão *"Perguntar ao Dobby"* + botão *"Conversar sobre este projeto"*.
    - Formulário de contato com pré-preenchimento, cópia de e-mail e Toast visível no topo sem sobrepor o botão do Dobby.
    - Botão *"Sugestões"* do chat funcionando após enviar mensagens e `Escape` respeitando prioridade de camadas.
