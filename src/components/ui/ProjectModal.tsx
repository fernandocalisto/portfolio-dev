import React, { useEffect, useMemo, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Layers,
  Cpu,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { getProjectById } from '../../../shared/portfolioData';
import type { ProjectId, ProjectSpec } from '../../../shared/types';
import type { ProjectItem } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import { ProjectArchitectureDiagram } from './ProjectArchitectureDiagram';

export interface ProjectModalProps {
  project?: ProjectSpec | ProjectItem | null;
  projectId?: ProjectId | null;
  onClose: () => void;
  onAskDobby?: (project: ProjectSpec) => void;
  onDiscussProject?: (project: ProjectSpec) => void;
  isEscapeSuppressed?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isProjectSpec(
  candidate: ProjectSpec | ProjectItem
): candidate is ProjectSpec {
  return typeof candidate.title === 'object' && candidate.title !== null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project = null,
  projectId = null,
  onClose,
  onAskDobby,
  onDiscussProject,
  isEscapeSuppressed = false,
}) => {
  const { locale, t } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const resolvedProject = useMemo<ProjectSpec | null>(() => {
    if (projectId) {
      return getProjectById(projectId) ?? null;
    }
    if (!project) return null;
    const canonical = getProjectById(project.id);
    if (canonical) return canonical;
    return isProjectSpec(project) ? project : null;
  }, [project, projectId]);

  const isOpen = resolvedProject !== null;

  // Body scroll lock + focus initialization & restoration on open/close
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = previousOverflow;
      const toRestore = previousFocusRef.current;
      if (toRestore && toRestore.isConnected) {
        toRestore.focus();
      }
      previousFocusRef.current = null;
    };
  }, [isOpen]);

  // Coordinated Escape handling + real Tab/Shift+Tab focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isEscapeSuppressed) {
          event.preventDefault();
          onClose();
        }
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusableNodes = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement | SVGElement>(
            FOCUSABLE_SELECTOR
          )
        ).filter(
          (el) =>
            !el.hasAttribute('disabled') &&
            el.getAttribute('aria-hidden') !== 'true' &&
            el.getClientRects().length > 0
        );

        if (focusableNodes.length === 0) {
          event.preventDefault();
          return;
        }

        const firstEl = focusableNodes[0];
        const lastEl = focusableNodes[focusableNodes.length - 1];
        const activeEl = document.activeElement;

        if (event.shiftKey) {
          if (!activeEl || activeEl === firstEl || !dialogRef.current.contains(activeEl)) {
            event.preventDefault();
            lastEl.focus();
          }
        } else {
          if (!activeEl || activeEl === lastEl || !dialogRef.current.contains(activeEl)) {
            event.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isEscapeSuppressed, onClose]);

  if (!resolvedProject) return null;

  const handleDiscussClick = () => {
    if (onDiscussProject) {
      onDiscussProject(resolvedProject);
      return;
    }
    onClose();
    const contactEl = document.getElementById('contato');
    contactEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-3xl bg-brand-surface border border-brand-hairline rounded-2xl shadow-[0_28px_80px_rgba(0,0,0,0.65)] max-h-[90vh] overflow-y-auto chat-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="relative p-6 sm:p-8 border-b border-brand-hairline"
          style={{
            background: `radial-gradient(circle at 12% 10%, ${resolvedProject.accentColor}26 0%, transparent 62%), #12181F`,
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-brand-card border border-brand-hairline text-brand-muted hover:text-brand-ivory hover:border-brand-gold/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
            aria-label={t.modal.closeAria}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-12">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-brand-hairline flex items-center justify-center bg-brand-obsidian p-1 shadow-lg flex-shrink-0">
              <img
                src={resolvedProject.logo}
                alt={resolvedProject.title[locale]}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="min-w-0">
              <span
                className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium mb-2"
                style={{
                  backgroundColor: '#12181F',
                  color: resolvedProject.badgeTextColor,
                  border: `1px solid ${resolvedProject.badgeTextColor}55`,
                }}
              >
                {resolvedProject.tag[locale]}
              </span>
              <h2
                id="project-modal-title"
                className="font-display text-xl sm:text-2xl font-semibold text-brand-ivory leading-snug"
              >
                {resolvedProject.title[locale]}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-brand-muted mt-1.5">
                {resolvedProject.role[locale]} · {resolvedProject.subtitle[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-7">
          {/* Interactive SVG Architecture Diagram */}
          <ProjectArchitectureDiagram project={resolvedProject} locale={locale} />

          {/* Engineering Challenge */}
          <div>
            <h3 className="font-display text-base font-semibold text-brand-ivory mb-2.5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-copper" />
              <span>{t.modal.challengeTitle}</span>
            </h3>
            <p className="font-sans text-brand-ivory/85 text-sm leading-relaxed bg-brand-card/75 p-4 rounded-xl border border-brand-hairline">
              {resolvedProject.challenge[locale]}
            </p>
          </div>

          {/* Architectural Decisions */}
          <div>
            <h3 className="font-display text-base font-semibold text-brand-ivory mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-tealLight" />
              <span>{t.modal.architectureTitle}</span>
            </h3>
            <ul className="space-y-2.5">
              {resolvedProject.architecture.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 font-sans text-brand-ivory/85 text-sm leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-tealLight mt-0.5 flex-shrink-0" />
                  <span>{item[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="font-mono text-xs font-medium text-brand-muted mb-2.5">
              {t.modal.stackTitle}
            </h3>
            <div className="flex flex-wrap gap-2">
              {resolvedProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-brand-card text-brand-ivory border border-brand-hairline text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Impact & Metrics */}
          <div>
            <h3 className="font-display text-base font-semibold text-brand-ivory mb-2.5">
              {t.modal.metricsTitle}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {resolvedProject.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-brand-obsidian border border-brand-hairline text-xs sm:text-sm text-brand-ivory/90 font-sans flex items-start gap-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-brand-gold font-bold mt-0.5"
                  >
                    →
                  </span>
                  <span>{metric[locale]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-brand-hairline flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-hairline text-brand-muted hover:text-brand-ivory text-xs sm:text-sm font-sans font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
            >
              {t.modal.close}
            </button>

            <div className="flex flex-wrap items-center justify-end gap-2.5">
              {onAskDobby && (
                <button
                  type="button"
                  onClick={() => onAskDobby(resolvedProject)}
                  className="px-4 py-2.5 rounded-lg bg-brand-teal hover:bg-brand-tealHover border border-brand-tealLight/40 text-brand-ivory text-xs sm:text-sm font-sans font-medium transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{t.modal.askDobby}</span>
                </button>
              )}

              {resolvedProject.link && (
                <a
                  href={resolvedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-gold/45 hover:border-brand-gold text-brand-gold text-xs sm:text-sm font-sans font-medium transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                >
                  <span>{t.modal.visitProject}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={handleDiscussClick}
                className="px-5 py-2.5 rounded-lg bg-brand-copper hover:bg-brand-copper/90 text-brand-ivory text-xs sm:text-sm font-sans font-medium transition-colors inline-flex items-center gap-2 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
              >
                <span>{t.modal.discussProject}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
