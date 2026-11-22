import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Compass } from 'lucide-react';
import type { ProjectId } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';
import { SaturnFallbackSvg } from '../three/SaturnFallbackSvg';

const SaturnPortfolioScene = React.lazy(() => import('../three/SaturnPortfolioScene'));

export interface HeroProps {
  onSelectProject?: (projectId: ProjectId) => void;
}

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const Hero: React.FC<HeroProps> = ({ onSelectProject }) => {
  const { t } = useLocale();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(getInitialReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSelectProject = useCallback(
    (projectId: ProjectId) => {
      if (onSelectProject) {
        onSelectProject(projectId);
        return;
      }
      const labSection = document.getElementById('laboratorio');
      if (labSection) {
        labSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    },
    [onSelectProject, prefersReducedMotion]
  );

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-brand-obsidian flex flex-col justify-between"
    >
      {/* Full-bleed Saturn 3D Canvas (lazy-loaded) or Accessible SVG Fallback */}
      <div className="absolute inset-0 z-10">
        {prefersReducedMotion ? (
          <SaturnFallbackSvg onSelectProject={handleSelectProject} />
        ) : (
          <Suspense fallback={<SaturnFallbackSvg onSelectProject={handleSelectProject} />}>
            <SaturnPortfolioScene onSelectProject={handleSelectProject} />
          </Suspense>
        )}
      </div>

      {/* Subtle architectural vignette scrims for typography contrast (never blocks canvas clicks) */}
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            'linear-gradient(90deg, rgba(11, 15, 19, 0.88) 0%, rgba(11, 15, 19, 0.54) 36%, rgba(11, 15, 19, 0.06) 64%, rgba(11, 15, 19, 0.16) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] sm:h-[52%] lg:h-[28%] z-[15]"
        style={{
          background:
            'linear-gradient(0deg, rgba(11, 15, 19, 0.95) 0%, rgba(11, 15, 19, 0.72) 52%, rgba(11, 15, 19, 0) 100%)',
        }}
      />

      {/* Editorial Foreground Layer */}
      <div className="relative z-20 pointer-events-none flex-1 flex flex-col justify-end lg:justify-center max-w-7xl w-full mx-auto px-6 sm:px-10 pt-[46svh] sm:pt-32 lg:pt-24 pb-10 sm:pb-14">
        <div className="max-w-2xl space-y-6 sm:space-y-7 animate-slideUp">
          {/* Subtle Availability Indicator + Atelier Eyebrow */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-2.5 text-brand-ivory/90 font-sans">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-orbitPulse absolute inline-flex h-full w-full rounded-full bg-brand-tealLight opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-tealLight" />
              </span>
              {t.hero.availability}
            </span>
            <span aria-hidden="true" className="hidden sm:inline-block h-3.5 w-px bg-brand-hairline" />
            <span className="hidden sm:inline-block font-mono text-[11px] tracking-[0.14em] uppercase text-brand-gold/90">
              {t.hero.eyebrow}
            </span>
          </div>

          {/* Monumental Fraunces Display Headline */}
          <h1
            className="font-display font-semibold tracking-[-0.025em] leading-[1.02] text-brand-ivory"
            style={{ fontSize: 'clamp(2.6rem, 7.5vw, 6.2rem)' }}
          >
            <span className="block">{t.hero.headlineFirst}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-ivory via-brand-gold to-brand-copper">
              {t.hero.headlineSecond}
            </span>
          </h1>

          {/* Concise Localized Tagline */}
          <p className="font-sans text-base sm:text-lg md:text-[1.15rem] text-brand-muted leading-relaxed max-w-xl">
            {t.hero.tagline}
          </p>

          {/* Two Clean Editorial CTAs */}
          <div className="pt-1 flex flex-wrap items-center gap-3.5 sm:gap-4 pointer-events-auto">
            <a
              href="#laboratorio"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-copper hover:bg-brand-gold text-brand-obsidian font-sans font-semibold text-sm sm:text-[15px] px-6 sm:px-7 py-3.5 transition-all duration-300 shadow-glow-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-brand-surface/70 backdrop-blur-md border border-brand-hairline hover:border-brand-gold/70 text-brand-ivory hover:text-brand-gold font-sans font-medium text-sm sm:text-[15px] px-6 sm:px-7 py-3.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
            >
              <span>{t.hero.secondaryCta}</span>
            </a>
          </div>

          {/* Subtle Orbital Interaction Hint */}
          <p className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-brand-muted/90 pt-1">
            <Compass className="w-3.5 h-3.5 text-brand-gold shrink-0" aria-hidden="true" />
            <span>{t.hero.orbitHint}</span>
          </p>
        </div>
      </div>

      {/* Minimal Bottom Scroll Cue */}
      <div className="relative z-20 pointer-events-none w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8 flex items-center justify-between border-t border-brand-hairline/40 pt-4">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-brand-muted/75">
          01 / SATURN SYSTEM
        </span>
        <a
          href="#sobre"
          className="pointer-events-auto group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-brand-muted hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
        >
          <span>{t.hero.scrollLabel}</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
