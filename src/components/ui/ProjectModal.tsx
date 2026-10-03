import React, { useEffect } from 'react';
import { X, CheckCircle, Layers, Cpu, ArrowRight } from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-brand-darkElevated border border-brand-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Project Banner */}
        <div
          className="relative p-6 sm:p-8 border-b border-brand-borderMuted/40"
          style={{
            background: `radial-gradient(circle at 10% 10%, ${project.accentColor}25 0%, transparent 60%), #14181e`
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-brand-card/80 border border-brand-border text-slate-400 hover:text-white hover:bg-brand-card transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-14 h-14 rounded-xl overflow-hidden border border-brand-border flex items-center justify-center bg-brand-card p-1 shadow-lg"
            >
              <img
                src={project.logo}
                alt={project.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <span
                className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold tracking-wider uppercase mb-1"
                style={{
                  backgroundColor: `${project.tagColor}20`,
                  color: project.tagColor,
                  border: `1px solid ${project.tagColor}40`
                }}
              >
                {project.tag}
              </span>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white font-sans">
                {project.title}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            {project.role} • {project.subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Challenge & Overview */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-gold mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-amber" />
              O Desafio de Engenharia
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed bg-brand-card/60 p-4 rounded-xl border border-brand-border/60">
              {project.challenge}
            </p>
          </div>

          {/* Architecture Highlights */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-gold mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-teal" />
              Decisões de Arquitetura &amp; Solução
            </h3>
            <ul className="space-y-2.5">
              {project.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              Stack Tecnológica Aplicada
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-brand-card text-slate-200 border border-brand-border text-xs font-mono font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics & Impact */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-gold mb-2">
              Impacto &amp; Métricas Alcançadas
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-brand-dark border border-brand-border/40 text-xs sm:text-sm text-slate-300 font-mono flex items-center gap-2"
                >
                  <span className="text-brand-amber font-bold">►</span>
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Inside Modal */}
          <div className="pt-4 border-t border-brand-borderMuted/40 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 text-xs font-mono tracking-wider transition-colors"
            >
              Fechar
            </button>
            <a
              href="#contato"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-brand-amber hover:bg-brand-crimson text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-md"
            >
              <span>Conversar Sobre Este Projeto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
