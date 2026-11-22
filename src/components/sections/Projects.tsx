import React, { useMemo, useState } from 'react';
import { Layers, ArrowUpRight, Filter, X } from 'lucide-react';
import { PROJECTS, SKILLS } from '../../../shared/portfolioData';
import type {
  Locale,
  ProjectCategory,
  ProjectId,
  ProjectSpec,
} from '../../../shared/types';
import type { ProjectItem } from '../../types';
import { useLocale } from '../../context/LocaleContext';

export interface ProjectsProps {
  onSelectProject?: (project: ProjectItem) => void;
  onSelectProjectId?: (projectId: ProjectId) => void;
  selectedSkillId?: string | null;
  onClearSkillFilter?: () => void;
  highlightedProjectId?: ProjectId | null;
}

type CategoryFilter = 'all' | ProjectCategory;

const CATEGORY_IDS: readonly CategoryFilter[] = [
  'all',
  'startup',
  'enterprise',
  'ai',
  'devtool',
];

function toLegacyProjectItem(project: ProjectSpec, locale: Locale): ProjectItem {
  return {
    id: project.id,
    title: project.title[locale],
    subtitle: project.subtitle[locale],
    role: project.role[locale],
    category: project.category,
    tag: project.tag[locale],
    tagColor: project.badgeTextColor,
    accentColor: project.accentColor,
    logo: project.logo,
    summary: project.summary[locale],
    challenge: project.challenge[locale],
    architecture: project.architecture.map((entry) => entry[locale]),
    techStack: [...project.techStack],
    metrics: project.metrics.map((entry) => entry[locale]),
    featured: project.featured,
    link: project.link,
  };
}

export const Projects: React.FC<ProjectsProps> = ({
  onSelectProject,
  onSelectProjectId,
  selectedSkillId = null,
  onClearSkillFilter,
  highlightedProjectId = null,
}) => {
  const { locale, t } = useLocale();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const selectedSkill = useMemo(
    () =>
      selectedSkillId
        ? SKILLS.find((skill) => skill.id === selectedSkillId) ?? null
        : null,
    [selectedSkillId]
  );

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesCategory =
        categoryFilter === 'all' || project.category === categoryFilter;
      const matchesSkill =
        !selectedSkillId || project.skillIds.includes(selectedSkillId);
      return matchesCategory && matchesSkill;
    });
  }, [categoryFilter, selectedSkillId]);

  const handleOpenProject = (project: ProjectSpec) => {
    onSelectProjectId?.(project.id);
    if (onSelectProject) {
      onSelectProject(toLegacyProjectItem(project, locale));
    }
  };

  return (
    <section
      id="laboratorio"
      className="py-24 border-t border-brand-hairline bg-brand-surface/75 relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="w-6 h-px bg-brand-gold" />
            <span className="font-mono text-xs text-brand-gold tracking-wide">
              04 / {t.projects.categories.all}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-ivory tracking-tight">
            {t.projects.sectionTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-brand-muted mt-2 max-w-2xl">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div
          role="tablist"
          aria-label={t.projects.sectionTitle}
          className="flex flex-wrap gap-2 mb-6"
        >
          {CATEGORY_IDS.map((catId) => {
            const isActive = categoryFilter === catId;
            return (
              <button
                key={catId}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategoryFilter(catId)}
                className={`px-4 py-2 rounded-lg font-sans text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                  isActive
                    ? 'bg-brand-copper text-brand-ivory font-medium border border-brand-copper'
                    : 'bg-brand-card text-brand-muted border border-brand-hairline hover:text-brand-ivory hover:border-brand-muted/50'
                }`}
              >
                {t.projects.categories[catId]}
              </button>
            );
          })}
        </div>

        {/* Active Skill Cross-Filter Banner */}
        {selectedSkill && (
          <div
            role="status"
            className="mb-8 px-4 py-3 rounded-xl bg-brand-card border border-brand-gold/45 flex flex-wrap items-center justify-between gap-3 animate-fadeIn"
          >
            <div className="flex items-center gap-2.5 text-sm font-sans text-brand-ivory">
              <Filter className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>{t.projects.filteringBySkill(selectedSkill.name)}</span>
            </div>
            <button
              type="button"
              onClick={() => onClearSkillFilter?.()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-hairline hover:border-brand-gold/60 text-xs font-sans font-medium text-brand-ivory transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
            >
              <X className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t.projects.clearSkillFilter}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl bg-brand-card border border-brand-hairline p-10 text-center space-y-4">
            <p className="font-sans text-sm sm:text-base text-brand-muted">
              {t.projects.emptyFilter}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categoryFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className="px-4 py-2 rounded-lg bg-brand-surface border border-brand-hairline hover:border-brand-gold/60 text-xs font-sans font-medium text-brand-ivory transition-colors"
                >
                  {t.projects.categories.all}
                </button>
              )}
              {selectedSkill && (
                <button
                  type="button"
                  onClick={() => onClearSkillFilter?.()}
                  className="px-4 py-2 rounded-lg bg-brand-copper text-xs font-sans font-medium text-brand-ivory hover:bg-brand-copper/90 transition-colors"
                >
                  {t.projects.clearSkillFilter}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Projects Editorial Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const isHighlighted = highlightedProjectId === project.id;
              return (
                <article
                  key={project.id}
                  id={`project-card-${project.id}`}
                  data-highlighted={isHighlighted ? 'true' : undefined}
                  className={`bg-brand-card rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden group shadow-[0_14px_36px_rgba(0,0,0,0.32)] hover:-translate-y-1 ${
                    isHighlighted
                      ? 'border-brand-gold ring-2 ring-brand-gold/70 shadow-glow-gold'
                      : 'border-brand-hairline hover:border-brand-gold/55'
                  }`}
                >
                  {/* Card Header Banner */}
                  <div
                    className="relative border-b border-brand-hairline p-5 flex flex-col justify-between gap-5"
                    style={{
                      background: `linear-gradient(145deg, #12181F 0%, ${project.accentColor}22 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-mono rounded-md font-medium"
                        style={{
                          backgroundColor: '#12181F',
                          color: project.badgeTextColor,
                          border: `1px solid ${project.badgeTextColor}55`,
                        }}
                      >
                        {project.tag[locale]}
                      </span>
                      <span className="text-[11px] font-mono text-brand-muted truncate">
                        {project.shortName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-brand-hairline bg-brand-obsidian p-1 flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={project.logo}
                          alt={project.title[locale]}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-xs text-brand-muted truncate">
                          {project.role[locale]}
                        </p>
                        <h3 className="font-display text-lg font-semibold text-brand-ivory group-hover:text-brand-gold transition-colors leading-snug line-clamp-2">
                          {project.title[locale]}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-2.5">
                      <p className="font-sans text-xs font-medium text-brand-tealLight">
                        {project.subtitle[locale]}
                      </p>
                      <p className="font-sans text-brand-ivory/85 text-sm leading-relaxed line-clamp-4">
                        {project.summary[locale]}
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-obsidian text-brand-muted border border-brand-hairline"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Card Actions */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenProject(project)}
                          className="py-2.5 px-3 rounded-lg bg-brand-surface hover:bg-brand-cardHover text-brand-ivory font-sans text-xs font-medium border border-brand-hairline hover:border-brand-gold/70 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                        >
                          <Layers className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{t.projects.architectureCta}</span>
                        </button>

                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-lg bg-brand-copper hover:bg-brand-copper/90 text-brand-ivory font-sans text-xs font-medium transition-colors text-center flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                          >
                            <span>{t.projects.visitCta}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <a
                            href="#contato"
                            className="py-2.5 px-3 rounded-lg bg-brand-copper hover:bg-brand-copper/90 text-brand-ivory font-sans text-xs font-medium transition-colors text-center flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                          >
                            <span>{t.projects.contactCta}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
