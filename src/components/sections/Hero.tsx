import React, { useState } from 'react';
import { ArrowRight, Terminal, Cpu, Database, Server, Bot, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeNode, setActiveNode] = useState<'backend' | 'ai' | 'frontend' | 'db'>('ai');

  const nodeDetails = {
    backend: {
      title: 'Java Spring Boot Core',
      desc: 'Microsserviços robustos, Clean Architecture, controle transacional e alta concorrência.',
      latency: 'OTIMIZADA',
      status: 'OPERACIONAL',
      tag: 'SPRING 3.x'
    },
    ai: {
      title: 'Integração de IA & Automação',
      desc: 'Desenvolvimento de fluxos no n8n e scripts Python para processos de negócio e dados.',
      latency: 'ASSÍNCRONA',
      status: 'MONITORADO',
      tag: 'LLM & n8n'
    },
    frontend: {
      title: 'Interface React & TypeScript',
      desc: 'Design systems escaláveis, tipagem rigorosa e alta responsividade com React.',
      latency: 'FLUIDA',
      status: 'REATIVO',
      tag: 'VITE + TS'
    },
    db: {
      title: 'Persistência & Dados (PostgreSQL)',
      desc: 'Modelagem relacional otimizada, índices eficientes e integridade referencial.',
      latency: 'SEGURA',
      status: 'CONECTADO',
      tag: 'POSTGRESQL'
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 md:py-24 overflow-hidden bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Bio & Pitch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-brand-teal/15 border border-brand-teal/40 text-brand-gold font-mono text-xs tracking-wider uppercase shadow-sm">
            <span className="w-2 h-2 rounded-lg bg-brand-amber animate-pulse"></span>
            Desenvolvedor Full-Stack e Arquiteto de Software
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-display">
            Fernando Henrique <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-gold to-brand-amber">
              Braga Calisto
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Arquiteto de software com foco em engenharia sólida e performance.
            Fundador da startup <strong className="text-white font-semibold">TALOS</strong> e CEO da{' '}
            <strong className="text-white font-semibold">DRAKON Code</strong>, focado na criação de soluções escaláveis,
            automação corporativa e interfaces reativas.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#laboratorio"
              className="px-7 py-3.5 rounded-lg bg-brand-teal text-white hover:bg-brand-tealHover font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md inline-flex items-center gap-2 border border-brand-teal group"
            >
              <span>Ver Projetos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contato"
              className="px-6 py-3.5 rounded-lg bg-brand-card/80 border border-brand-border hover:border-brand-amber text-slate-200 hover:text-brand-amber font-mono text-sm tracking-wider uppercase transition-colors inline-flex items-center gap-2"
            >
              Entrar em Contato
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-brand-borderMuted/40 max-w-lg">
            <div>
              <span className="block text-2xl font-extrabold text-white font-mono">Full-Stack</span>
              <span className="text-xs text-slate-400 font-mono">Engenharia de Software</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-brand-gold font-mono">CEO</span>
              <span className="text-xs text-slate-400 font-mono">DRAKON Code</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-brand-amber font-mono">Founder</span>
              <span className="text-xs text-slate-400 font-mono">Startup TALOS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Living Architecture */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-brand-card/95 to-brand-darkElevated/95 border border-brand-border shadow-2xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-lg bg-brand-crimson inline-block"></span>
                <span className="w-3 h-3 rounded-lg bg-brand-gold inline-block"></span>
                <span className="w-3 h-3 rounded-lg bg-brand-teal inline-block"></span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-brand-gold" />
                <span>architecture.overview</span>
              </div>
              <span className="text-brand-gold text-xs font-mono font-bold">V 1.0</span>
            </div>

            {/* Architecture Node Switcher */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setActiveNode('ai')}
                className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                  activeNode === 'ai'
                    ? 'bg-brand-amber/15 border-brand-amber text-white shadow-md'
                    : 'bg-brand-dark border-brand-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-brand-amber" />
                  <span className="text-xs font-bold">1. AI Pipelines</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">LLMs &amp; n8n</span>
              </button>

              <button
                onClick={() => setActiveNode('backend')}
                className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                  activeNode === 'backend'
                    ? 'bg-brand-teal/20 border-brand-teal text-white shadow-md'
                    : 'bg-brand-dark border-brand-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-brand-teal" />
                  <span className="text-xs font-bold">2. Spring Boot</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">Clean Arch</span>
              </button>

              <button
                onClick={() => setActiveNode('frontend')}
                className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                  activeNode === 'frontend'
                    ? 'bg-brand-gold/15 border-brand-gold text-white shadow-md'
                    : 'bg-brand-dark border-brand-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Server className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold">3. React / TS</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">UI Reativa</span>
              </button>

              <button
                onClick={() => setActiveNode('db')}
                className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                  activeNode === 'db'
                    ? 'bg-slate-700/30 border-slate-400 text-white'
                    : 'bg-brand-dark border-brand-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold">4. PostgreSQL</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">Dados Confiáveis</span>
              </button>
            </div>

            {/* Selected Node Telemetry Box */}
            <div className="bg-brand-dark p-4 rounded-xl border border-brand-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
                  {nodeDetails[activeNode].title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-card text-brand-gold border border-brand-gold/30">
                  {nodeDetails[activeNode].tag}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {nodeDetails[activeNode].desc}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border/40 font-mono text-[11px]">
                <div className="text-slate-400">
                  Latência: <span className="text-brand-gold font-bold">{nodeDetails[activeNode].latency}</span>
                </div>
                <div className="text-right text-slate-400">
                  Estado: <span className="text-emerald-400 font-bold">{nodeDetails[activeNode].status}</span>
                </div>
              </div>
            </div>

            {/* Bottom Terminal Status Bar */}
            <div className="mt-4 pt-3 border-t border-brand-border text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                Arquitetura Documentada
              </span>
              <span className="text-brand-gold font-bold">TALOS &amp; DRAKON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
