import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { timelineData } from '../../data/timeline';

export const Timeline: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(timelineData.length - 1); // Start at current year (2026)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < timelineData.length - 1 ? prev + 1 : prev));
  };

  const activeItem = timelineData[currentIndex];
  const progressPercent = (currentIndex / (timelineData.length - 1)) * 100;

  return (
    <section id="timeline" className="py-20 border-t border-brand-borderMuted/40 bg-brand-darkElevated/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Indicator */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-brand-gold font-mono text-sm font-bold uppercase tracking-wider">
            <span className="text-lg text-brand-amber">▣</span>
            <h2>MINHA TRAJETÓRIA</h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">2022 — PRESENTE</span>
        </div>

        {/* Timeline Interactive Year Selector */}
        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="h-1 w-full bg-brand-border rounded-full relative overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-brand-teal via-brand-gold to-brand-amber transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Year Buttons */}
          <div className="flex justify-between items-center relative">
            {timelineData.map((item, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={item.year}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex flex-col items-center group focus:outline-none transition-all duration-300 ${
                    isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ir para o ano ${item.year}`}
                >
                  <span
                    className={`font-mono text-xs sm:text-sm font-bold mb-2 transition-colors ${
                      isActive ? 'text-brand-gold' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.year}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-brand-gold border-brand-gold shadow-[0_0_12px_rgba(197,149,56,0.6)]'
                        : 'bg-brand-dark border-brand-border group-hover:border-brand-gold/60'
                    }`}
                  >
                    {isActive && <div className="w-1.5 h-1.5 bg-brand-dark rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Card Display (Dark Glassmorphism — Harmonized with dark theme) */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-brand-card/90 border border-brand-border rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Background Accent Glow */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none opacity-50" />

            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-brand-amber/15 border border-brand-amber/40 text-brand-amber font-mono text-xs font-bold uppercase tracking-wider">
                  {activeItem.tag}
                </span>
                {activeItem.period && (
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    • {activeItem.period}
                  </span>
                )}
              </div>

              {/* Big Year Watermark */}
              <span className="font-mono text-4xl sm:text-5xl font-extrabold text-slate-700/50 select-none">
                {activeItem.year}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">
              {activeItem.title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-mono">
              {activeItem.desc}
            </p>

            {activeItem.highlight && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-dark border-l-2 border-brand-gold border-y border-r border-brand-border text-xs font-mono text-brand-gold">
                <span>Foco: {activeItem.highlight}</span>
              </div>
            )}

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-brand-borderMuted/30">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark border border-brand-border text-xs font-mono text-slate-300 hover:text-brand-gold hover:border-brand-gold/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Ano anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                {currentIndex + 1} de {timelineData.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentIndex === timelineData.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark border border-brand-border text-xs font-mono text-slate-300 hover:text-brand-gold hover:border-brand-gold/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Próximo ano"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
