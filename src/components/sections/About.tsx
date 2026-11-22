import React from 'react';
import { Mail, Github, Linkedin, Trophy, Building2, Rocket, MapPin } from 'lucide-react';
import { PROFILE } from '../../../shared/portfolioData';
import { useLocale } from '../../context/LocaleContext';

export const About: React.FC = () => {
  const { locale, t } = useLocale();

  return (
    <section
      id="sobre"
      className="py-24 border-t border-brand-hairline bg-brand-obsidian relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="w-6 h-px bg-brand-gold" />
            <span className="font-mono text-xs text-brand-gold tracking-wide">
              01 / {t.about.sectionTitle}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-ivory tracking-tight max-w-2xl">
            {t.about.heading}
          </h2>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Portrait & Identity Column */}
          <aside className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-brand-hairline via-brand-gold/40 to-brand-teal/50 mb-6 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
              <div className="w-56 h-56 rounded-[14px] overflow-hidden bg-brand-surface border border-brand-hairline">
                <img
                  src={PROFILE.portrait}
                  alt={PROFILE.fullName}
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <h3 className="font-display text-xl font-semibold text-brand-ivory">
              {PROFILE.fullName}
            </h3>
            <p className="font-sans text-sm text-brand-tealLight font-medium mt-1.5">
              {PROFILE.role[locale]}
            </p>
            <p className="font-sans text-xs text-brand-muted mt-2 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
              <span>{PROFILE.location[locale]}</span>
            </p>

            {/* Official Channels Only: Email, GitHub, LinkedIn */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={`mailto:${PROFILE.email}`}
                aria-label={t.about.emailAria}
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-hairline hover:border-brand-copper hover:text-brand-ivory text-brand-muted flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.about.githubAria}
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-hairline hover:border-brand-tealLight hover:text-brand-ivory text-brand-muted flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.about.linkedinAria}
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-hairline hover:border-brand-tealLight hover:text-brand-ivory text-brand-muted flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </aside>

          {/* Editorial Bio & 3 Pillars Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-brand-surface/80 border border-brand-hairline rounded-2xl p-6 sm:p-8 space-y-4 font-sans text-brand-ivory/90 text-base leading-relaxed">
              <p>{t.about.bioParagraph1}</p>
              <p>
                {t.about.bioParagraph2Prefix}
                <strong className="text-brand-ivory font-semibold">TALOS</strong>
                {t.about.bioParagraph2Middle}
                <strong className="text-brand-ivory font-semibold">DRAKON Code</strong>
                {t.about.bioParagraph2Suffix}
              </p>
              <p className="text-brand-muted text-[15px] leading-relaxed">
                {t.about.bioParagraph3}
              </p>
            </div>

            {/* 3 Refined Editorial Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-brand-card border border-brand-hairline hover:border-brand-copper/60 rounded-xl p-5 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-brand-copper/15 border border-brand-copper/30 text-brand-copper flex items-center justify-center mb-3.5">
                  <Rocket className="w-4 h-4" />
                </div>
                <h4 className="font-display text-base font-semibold text-brand-ivory">
                  TALOS
                </h4>
                <p className="font-sans text-xs text-brand-muted mt-1 leading-relaxed">
                  {t.about.pillarTalosRole}
                </p>
              </div>

              <div className="bg-brand-card border border-brand-hairline hover:border-brand-crimson/60 rounded-xl p-5 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-brand-crimson/15 border border-brand-crimson/30 text-[#F87171] flex items-center justify-center mb-3.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-display text-base font-semibold text-brand-ivory">
                  DRAKON Code
                </h4>
                <p className="font-sans text-xs text-brand-muted mt-1 leading-relaxed">
                  {t.about.pillarDrakonRole}
                </p>
              </div>

              <div className="bg-brand-card border border-brand-hairline hover:border-brand-gold/60 rounded-xl p-5 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-brand-gold/15 border border-brand-gold/30 text-brand-gold flex items-center justify-center mb-3.5">
                  <Trophy className="w-4 h-4" />
                </div>
                <h4 className="font-display text-base font-semibold text-brand-ivory">
                  {t.about.pillarPerfTitle}
                </h4>
                <p className="font-sans text-xs text-brand-muted mt-1 leading-relaxed">
                  {t.about.pillarPerfSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
