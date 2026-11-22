import React, { useMemo, useState } from 'react';
import {
  Cpu,
  Layers,
  Server,
  Code2,
  Database,
  Terminal,
  Bot,
  Box,
  Palette,
  Network,
  Eye,
  Zap,
  GitBranch,
  Puzzle,
  ArrowDownRight,
  X,
} from 'lucide-react';
import { PROJECTS, SKILLS } from '../../../shared/portfolioData';
import type { ProjectId, SkillCategory } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';

export interface SkillsProps {
  selectedSkillId?: string | null;
  onSelectSkill?: (skillId: string | null) => void;
}

type CategoryFilter = 'all' | SkillCategory;

const CATEGORY_IDS: readonly CategoryFilter[] = [
  'all',
  'backend',
  'frontend',
  'ai',
  'database',
];

const EN_SKILL_NAME_MAP: Record<string, string> = {
  'ai-automation': 'AI & Automation (n8n, LLMs)',
  opencv: 'OpenCV & Computer Vision',
  'rest-apis': 'REST & Microservices Architecture',
};

function renderSkillIcon(iconName: string): React.ReactNode {
  const iconClass = 'w-6 h-6';
  switch (iconName) {
    case 'Cpu':
      return <Cpu className={iconClass} />;
    case 'Layers':
      return <Layers className={iconClass} />;
    case 'Server':
      return <Server className={iconClass} />;
    case 'Code2':
      return <Code2 className={iconClass} />;
    case 'Database':
      return <Database className={iconClass} />;
    case 'Terminal':
      return <Terminal className={iconClass} />;
    case 'Bot':
      return <Bot className={iconClass} />;
    case 'Eye':
      return <Eye className={iconClass} />;
    case 'Zap':
      return <Zap className={iconClass} />;
    case 'Box':
      return <Box className={iconClass} />;
    case 'Palette':
      return <Palette className={iconClass} />;
    case 'Network':
      return <Network className={iconClass} />;
    case 'GitBranch':
      return <GitBranch className={iconClass} />;
    case 'Puzzle':
      return <Puzzle className={iconClass} />;
    default:
      return <Cpu className={iconClass} />;
  }
}

export const Skills: React.FC<SkillsProps> = ({
  selectedSkillId = null,
  onSelectSkill,
}) => {
  const { locale, t } = useLocale();
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const projectNameMap = useMemo(() => {
    const map = new Map<ProjectId, string>();
    for (const project of PROJECTS) {
      map.set(project.id, project.shortName);
    }
    return map;
  }, []);

  const filteredSkills = useMemo(
    () =>
      filter === 'all'
        ? SKILLS
        : SKILLS.filter((skill) => skill.category === filter),
    [filter]
  );

  const selectedSkill = useMemo(
    () => SKILLS.find((s) => s.id === selectedSkillId) ?? null,
    [selectedSkillId]
  );

  const handleSkillClick = (skillId: string) => {
    const isDeselecting = selectedSkillId === skillId;
    const nextSkillId = isDeselecting ? null : skillId;
    onSelectSkill?.(nextSkillId);

    if (nextSkillId) {
      const target = document.getElementById('laboratorio');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="skills"
      className="py-24 bg-brand-obsidian border-t border-brand-hairline relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span aria-hidden="true" className="w-6 h-px bg-brand-gold" />
              <span className="font-mono text-xs text-brand-gold tracking-wide">
                03 / {t.skills.categories.all}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-ivory tracking-tight">
              {t.skills.sectionTitle}
            </h2>
            <p className="font-sans text-sm sm:text-base text-brand-muted mt-2 max-w-2xl">
              {t.skills.subtitle}
            </p>
          </div>

          {selectedSkill && (
            <div className="inline-flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-lg bg-brand-card border border-brand-gold/50 text-xs font-sans text-brand-ivory">
              <span className="text-brand-gold font-medium">
                {t.skills.activeFilterLabel}:
              </span>
              <span className="font-mono text-brand-ivory">
                {selectedSkill.name}
              </span>
              <button
                type="button"
                onClick={() => onSelectSkill?.(null)}
                className="ml-1 p-0.5 rounded text-brand-muted hover:text-brand-ivory transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                aria-label={t.skills.clearSelection}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label={t.skills.sectionTitle}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORY_IDS.map((catId) => {
            const isActive = filter === catId;
            return (
              <button
                key={catId}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(catId)}
                className={`px-4 py-2 rounded-lg font-sans text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                  isActive
                    ? 'bg-brand-teal text-brand-ivory font-medium border border-brand-tealLight/50'
                    : 'bg-brand-surface text-brand-muted border border-brand-hairline hover:text-brand-ivory hover:border-brand-muted/50'
                }`}
              >
                {t.skills.categories[catId]}
              </button>
            );
          })}
        </div>

        {/* Skills Evidence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkillId === skill.id;
            const projectNames = skill.projectIds
              .map((pid) => projectNameMap.get(pid))
              .filter((name): name is string => Boolean(name));

            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleSkillClick(skill.id)}
                aria-pressed={isSelected}
                className={`text-left rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                  isSelected
                    ? 'bg-brand-cardHover border-brand-gold shadow-glow-gold -translate-y-0.5'
                    : 'bg-brand-card border-brand-hairline hover:bg-brand-cardHover hover:border-brand-tealLight/60 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div
                    className="w-10 h-10 rounded-lg bg-brand-surface border border-brand-hairline flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{ color: skill.color }}
                  >
                    {renderSkillIcon(skill.icon)}
                  </div>

                  <ArrowDownRight
                    aria-hidden="true"
                    className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                      isSelected
                        ? 'text-brand-gold translate-x-0.5 translate-y-0.5'
                        : 'text-brand-muted/60 group-hover:text-brand-tealLight group-hover:translate-x-0.5 group-hover:translate-y-0.5'
                    }`}
                  />
                </div>

                <div className="w-full">
                  <span className="font-mono text-[11px] text-brand-muted block mb-1">
                    {skill.categoryLabel[locale]}
                  </span>
                  <h3 className="font-display text-base font-semibold text-brand-ivory leading-snug">
                    {locale === 'en' && EN_SKILL_NAME_MAP[skill.id]
                      ? EN_SKILL_NAME_MAP[skill.id]
                      : skill.name}
                  </h3>
                </div>

                {/* Real Project Evidence Footer */}
                <div className="w-full pt-3 border-t border-brand-hairline/80 space-y-1">
                  <span className="font-mono text-[11px] text-brand-tealLight block">
                    {t.skills.usedInCount(skill.projectIds.length)}
                  </span>
                  <p className="font-mono text-[11px] text-brand-muted truncate">
                    {projectNames.join(' · ')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
