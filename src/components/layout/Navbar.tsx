import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import type { ScrollableSectionId, SectionId } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';

export interface NavbarProps {
  activeSection?: SectionId;
}

const NAV_SECTION_IDS: readonly ScrollableSectionId[] = [
  'sobre',
  'timeline',
  'skills',
  'laboratorio',
  'contato',
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection = 'hero' }) => {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 20);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
      } else {
        const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(pct);
      }
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (headerRef.current && target && !headerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-obsidian/92 backdrop-blur-md border-b border-brand-hairline py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
          : 'bg-brand-obsidian/45 backdrop-blur-sm border-b border-brand-hairline/50 py-4'
      }`}
    >
      {/* 1.5px Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-transparent overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-tealLight via-brand-gold to-brand-copper transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 text-brand-ivory hover:text-brand-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded"
          aria-label={t.nav.brandAria}
        >
          <span className="w-2 h-2 rounded-full bg-brand-gold group-hover:bg-brand-tealLight transition-colors" />
          <span className="font-display font-semibold text-lg sm:text-xl tracking-tight">
            Fernando Calisto
          </span>
        </a>

        {/* Desktop Navigation with ScrollSpy */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-sans"
        >
          {NAV_SECTION_IDS.map((sectionId) => {
            const isActive = activeSection === sectionId;
            return (
              <a
                key={sectionId}
                href={`#${sectionId}`}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-1.5 transition-colors duration-200 focus:outline-none focus-visible:text-brand-ivory ${
                  isActive
                    ? 'text-brand-ivory font-medium'
                    : 'text-brand-muted hover:text-brand-ivory'
                }`}
              >
                {t.nav.links[sectionId]}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-gold opacity-100 scale-x-100'
                      : 'bg-brand-gold/60 opacity-0 scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Controls: Locale Switcher, CTA & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {/* PT | EN Toggle */}
          <div
            role="group"
            aria-label={t.nav.languageToggleAria}
            className="inline-flex items-center rounded-lg bg-brand-surface border border-brand-hairline p-0.5 font-mono text-[11px]"
          >
            <button
              type="button"
              onClick={() => setLocale('pt')}
              aria-pressed={locale === 'pt'}
              className={`px-2 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                locale === 'pt'
                  ? 'bg-brand-card text-brand-ivory font-semibold border border-brand-hairline/80'
                  : 'text-brand-muted hover:text-brand-ivory border border-transparent'
              }`}
            >
              PT
            </button>
            <span aria-hidden="true" className="text-brand-hairline px-0.5 select-none">
              |
            </span>
            <button
              type="button"
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
              className={`px-2 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                locale === 'en'
                  ? 'bg-brand-card text-brand-ivory font-semibold border border-brand-hairline/80'
                  : 'text-brand-muted hover:text-brand-ivory border border-transparent'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="#contato"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-sans font-medium text-brand-ivory bg-brand-surface hover:bg-brand-copper border border-brand-hairline hover:border-brand-copper rounded-lg transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
          >
            <span>{t.nav.cta}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-gold group-hover:text-brand-ivory group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg bg-brand-surface border border-brand-hairline text-brand-muted hover:text-brand-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
            aria-label={t.nav.menuToggleAria}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-brand-copper" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-brand-surface/98 backdrop-blur-xl border-b border-brand-hairline px-6 py-5 animate-fadeIn"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_SECTION_IDS.map((sectionId) => {
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={sectionId}
                  href={`#${sectionId}`}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`py-3 px-2 border-b border-brand-hairline/60 flex items-center justify-between text-sm font-sans transition-colors ${
                    isActive
                      ? 'text-brand-ivory font-medium'
                      : 'text-brand-muted hover:text-brand-ivory'
                  }`}
                >
                  <span>{t.nav.links[sectionId]}</span>
                  <span
                    aria-hidden="true"
                    className={`font-mono text-xs ${
                      isActive ? 'text-brand-gold' : 'text-brand-tealLight'
                    }`}
                  >
                    →
                  </span>
                </a>
              );
            })}
            <a
              href="#contato"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full text-center py-3 text-sm font-sans font-medium bg-brand-copper hover:bg-brand-copper/90 text-brand-ivory rounded-lg transition-colors"
            >
              {t.nav.cta}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
