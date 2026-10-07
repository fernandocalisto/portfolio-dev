import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-brand-borderMuted/40 bg-[#0c1014] py-10 text-xs font-mono text-slate-500">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded bg-brand-teal block"></span>
          <span>© 2026 Fernando Henrique Braga Calisto. Todos os direitos reservados.</span>
        </div>

        <div className="text-slate-400 flex items-center gap-2">
          <span>Construído com</span>
          <span className="text-brand-gold font-semibold">React + TypeScript</span>
          <span>&amp; mentalidade</span>
          <span className="text-brand-amber font-semibold">AI-First</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-gold transition-colors p-2 rounded hover:bg-brand-card border border-brand-border/40"
          aria-label="Voltar ao topo da página"
        >
          <span>Topo</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
