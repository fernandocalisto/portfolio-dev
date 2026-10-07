import React, { useState } from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types';

interface ProjectsProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<'all' | 'startup' | 'enterprise' | 'ai'>('all');

  const categories = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'startup', label: 'Startup & B2B' },
    { id: 'enterprise', label: 'Empresa Júnior' },
    { id: 'ai', label: 'IA & Automação' },
  ];

  const filteredProjects = filter === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === filter);

  return (
    <section id="laboratorio" className="py-20 border-t border-brand-borderMuted/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-brand-gold font-mono text-sm font-bold uppercase tracking-wider">
            <span className="text-lg text-brand-amber">▣</span>
            <h2>LABORATÓRIO &amp; PROJETOS</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">CASES DE ENGENHARIA, LIDERANÇA &amp; IA</span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                filter === cat.id
                  ? 'bg-brand-amber text-white font-bold border border-brand-amber shadow-md'
                  : 'bg-brand-card text-slate-400 border border-brand-border hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-brand-card rounded-2xl border border-brand-border hover:border-brand-gold/60 transition-all duration-300 flex flex-col overflow-hidden group shadow-xl hover:-translate-y-1"
            >
              {/* Card Banner Preview */}
              <div
                className="min-h-[14rem] relative border-b border-brand-border p-5 flex flex-col justify-between"
                style={{
                  background: `linear-gradient(135deg, #12161a 0%, ${project.accentColor}25 100%)`
                }}
              >
                <div className="flex flex-col gap-1.5 z-10">
                  <span
                    className="self-start px-2.5 py-0.5 text-[10px] font-mono rounded-lg font-semibold"
                    style={{
                      backgroundColor: `${project.tagColor}20`,
                      color: project.tagColor,
                      border: `1px solid ${project.tagColor}50`
                    }}
                  >
                    {project.tag}
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">{project.role}</span>
                </div>

                {/* Logo & Project Title */}
                <div className="text-center py-2 z-10 flex flex-col items-center justify-center">
                  <div
                    className="relative flex items-center justify-center w-14 h-14 rounded-xl overflow-hidden border border-brand-border bg-brand-dark shadow-md group-hover:scale-105 transition-transform duration-300 mb-2 p-1"
                  >
                    <img
                      src={project.logo}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-white tracking-wider group-hover:text-brand-gold transition-colors">
                    {project.title.split('—')[0].trim()}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 leading-snug">
                    {project.subtitle}
                  </p>
                </div>

                
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-gold transition-colors font-display">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-4">
                    {project.summary}
                  </p>
                </div>

                <div>
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-dark text-slate-300 border border-brand-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions: Case Study Modal & Contact */}
                  <div className="grid grid-cols-2 gap-2">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-lg bg-brand-dark hover:bg-brand-darkElevated text-brand-gold font-mono text-xs font-bold tracking-wider uppercase border border-brand-gold/40 hover:border-brand-gold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Saiba Mais</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => onSelectProject(project)}
                        className="py-2.5 px-3 rounded-lg bg-brand-dark hover:bg-brand-darkElevated text-brand-gold font-mono text-xs font-bold tracking-wider uppercase border border-brand-gold/40 hover:border-brand-gold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Arquitetura</span>
                      </button>
                    )}
                    <a
                      href="#contato"
                      className="py-2.5 px-3 rounded-lg bg-brand-amber hover:bg-brand-crimson text-white font-mono text-xs font-bold tracking-wider uppercase transition-colors text-center flex items-center justify-center gap-1 shadow-md"
                    >
                      <span>Contato</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
