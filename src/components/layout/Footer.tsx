import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export const Footer: React.FC = () => {
  const { t } = useLocale();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-brand-hairline bg-brand-obsidian py-10 text-xs text-brand-muted">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 text-center md:text-left font-sans">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-brand-gold flex-shrink-0"
          />
          <span>{t.footer.rights}</span>
        </div>

        <div className="text-brand-muted flex flex-wrap items-center justify-center gap-1.5 font-sans">
          <span>{t.footer.builtWith}</span>
          <span className="font-mono text-brand-ivory font-medium">
            React + TypeScript
          </span>
          <span>{t.footer.mindset}</span>
          <span className="font-mono text-brand-tealLight font-medium">
            AI-First
          </span>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-ivory hover:border-brand-gold/60 transition-colors px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-hairline font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
          aria-label={t.footer.backToTopAria}
        >
          <span>{t.footer.backToTop}</span>
          <ArrowUp className="w-3.5 h-3.5 text-brand-gold" />
        </button>
      </div>
    </footer>
  );
};
