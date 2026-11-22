import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TIMELINE } from '../../../shared/portfolioData';
import { useLocale } from '../../context/LocaleContext';

export const Timeline: React.FC = () => {
  const { locale, t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < TIMELINE.length - 1 ? prev + 1 : prev));
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    } else if (event.key === 'Home') {
      event.preventDefault();
      setCurrentIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setCurrentIndex(TIMELINE.length - 1);
    }
  };

  const activeItem = TIMELINE[currentIndex];
  const progressPercent =
    TIMELINE.length > 1 ? (currentIndex / (TIMELINE.length - 1)) * 100 : 100;

  return (
    <section
      id="timeline"
      className="py-24 border-t border-brand-hairline bg-brand-surface/75 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span aria-hidden="true" className="w-6 h-px bg-brand-gold" />
              <span className="font-mono text-xs text-brand-gold tracking-wide">
                02 / {t.timeline.rangeLabel}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-ivory tracking-tight">
              {t.timeline.sectionTitle}
            </h2>
          </div>

          <span className="font-mono text-xs text-brand-muted">
            {t.timeline.keyboardHint}
          </span>
        </div>

        {/* Keyboard-Navigable Timeline Container */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label={t.timeline.sectionTitle}
          className="outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 rounded-2xl p-1 -m-1"
        >
          {/* Year Progress Rail */}
          <div className="relative mb-12">
            <div className="h-[2px] w-full bg-brand-hairline rounded-full relative overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-brand-tealLight via-brand-gold to-brand-copper transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center relative">
              {TIMELINE.map((item, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={t.timeline.goToYearAria(item.year)}
                    className={`flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded-lg px-2 py-1 transition-all duration-300 ${
                      isActive ? 'scale-105' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs sm:text-sm font-semibold mb-2.5 transition-colors ${
                        isActive
                          ? 'text-brand-gold'
                          : 'text-brand-muted group-hover:text-brand-ivory'
                      }`}
                    >
                      {item.year}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        isActive
                          ? 'bg-brand-gold border-brand-gold shadow-glow-gold'
                          : 'bg-brand-obsidian border-brand-hairline group-hover:border-brand-gold/70'
                      }`}
                    >
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-brand-obsidian rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Card */}
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-brand-card border border-brand-hairline rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300">
              <div
                aria-hidden="true"
                className="absolute -top-20 -right-20 w-56 h-56 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"
              />

              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-brand-surface border border-brand-hairline text-brand-tealLight font-mono text-xs font-medium">
                    {activeItem.tag[locale]}
                  </span>
                  <span className="font-mono text-xs text-brand-muted">
                    {activeItem.period[locale]}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="font-mono text-3xl sm:text-5xl font-bold text-brand-hairline/90 select-none leading-none"
                >
                  {activeItem.year}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-[26px] font-semibold text-brand-ivory mb-4 leading-snug">
                {activeItem.title[locale]}
              </h3>

              {/* Editorial Prose strictly in DM Sans (font-sans) */}
              <p className="font-sans text-brand-ivory/85 text-base leading-relaxed mb-6">
                {activeItem.desc[locale]}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-hairline border-l-2 border-l-brand-gold text-xs font-mono text-brand-gold">
                <span>
                  {t.timeline.focusPrefix}: {activeItem.highlight[locale]}
                </span>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-7 mt-7 border-t border-brand-hairline">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-hairline text-xs font-sans font-medium text-brand-ivory hover:border-brand-gold/60 hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                  aria-label={t.timeline.prevAria}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.timeline.prev}</span>
                </button>

                <span className="font-mono text-xs text-brand-muted">
                  {t.timeline.stepOf(currentIndex + 1, TIMELINE.length)}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === TIMELINE.length - 1}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-hairline text-xs font-sans font-medium text-brand-ivory hover:border-brand-gold/60 hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                  aria-label={t.timeline.nextAria}
                >
                  <span className="hidden sm:inline">{t.timeline.next}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
