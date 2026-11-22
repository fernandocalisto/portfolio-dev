import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Timeline } from './components/sections/Timeline';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Contact, type ContactPrefill } from './components/sections/Contact';
import { ProjectModal } from './components/ui/ProjectModal';
import { Toast, type ToastProps } from './components/ui/Toast';
import { ChatWidget } from './components/chat/ChatWidget';
import { useLocale } from './context/LocaleContext';
import { PROJECT_IDS } from '../shared/portfolioData';
import type { DobbyAction, ProjectId, ProjectSpec, SectionId } from '../shared/types';

const OBSERVED_SECTIONS: readonly SectionId[] = [
  'hero',
  'sobre',
  'timeline',
  'skills',
  'laboratorio',
  'contato',
];

function isProjectId(value: string | null): value is ProjectId {
  return value !== null && (PROJECT_IDS as readonly string[]).includes(value);
}

function syncProjectQueryParam(projectId: ProjectId | null): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (projectId) {
      url.searchParams.set('projeto', projectId);
    } else {
      url.searchParams.delete('projeto');
    }
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // Ignore history restrictions in sandboxed environments
  }
}

export const App: React.FC = () => {
  const { locale, t } = useLocale();

  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | null>(null);
  const [highlightedProjectId, setHighlightedProjectId] = useState<ProjectId | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [contactPrefill, setContactPrefill] = useState<ContactPrefill | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; nonce: number } | null>(null);

  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4500);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (highlightTimerRef.current !== null) window.clearTimeout(highlightTimerRef.current);
    };
  }, []);

  // ScrollSpy via IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const elements = OBSERVED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId: SectionId | null = null;
        let bestRatio = 0;
        for (const id of OBSERVED_SECTIONS) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        }
        if (bestId) {
          setActiveSection(bestId);
        }
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const highlightProjectTemporarily = useCallback((projectId: ProjectId) => {
    if (highlightTimerRef.current !== null) {
      window.clearTimeout(highlightTimerRef.current);
    }
    setHighlightedProjectId(projectId);
    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedProjectId(null);
      highlightTimerRef.current = null;
    }, 2600);
  }, []);

  const openProjectModal = useCallback((projectId: ProjectId) => {
    setSelectedProjectId(projectId);
    syncProjectQueryParam(projectId);
  }, []);

  const closeProjectModal = useCallback(() => {
    setSelectedProjectId(null);
    syncProjectQueryParam(null);
  }, []);

  // Read ?projeto=<id> deep-link on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get('projeto');
    if (isProjectId(paramId)) {
      setSelectedProjectId(paramId);
      highlightProjectTemporarily(paramId);
      const labEl = document.getElementById('laboratorio');
      if (labEl) {
        labEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [highlightProjectTemporarily]);

  // Clicking a project satellite in the Saturn 3D Hero
  const handleSelectProjectFromHero = useCallback(
    (projectId: ProjectId) => {
      const labEl = document.getElementById('laboratorio');
      if (labEl) {
        labEl.scrollIntoView({ behavior: 'smooth' });
      }
      highlightProjectTemporarily(projectId);
      openProjectModal(projectId);
    },
    [highlightProjectTemporarily, openProjectModal]
  );

  // Modal -> Ask Dobby contextual prompt
  const handleAskDobby = useCallback(
    (project: ProjectSpec) => {
      closeProjectModal();
      setIsChatOpen(true);
      setPendingPrompt({
        text: t.chat.askProjectPrompt(project.title[locale]),
        nonce: Date.now(),
      });
    },
    [closeProjectModal, locale, t]
  );

  // Modal -> Prefill Contact section
  const handleDiscussProject = useCallback(
    (project: ProjectSpec) => {
      closeProjectModal();
      setContactPrefill({
        subject: 'project',
        projectTitle: project.title[locale],
        nonce: Date.now(),
      });
      const contactEl = document.getElementById('contato');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [closeProjectModal, locale]
  );

  // Dobby Agent UI actions
  const handleDobbyAction = useCallback(
    (action: DobbyAction) => {
      const isCompactViewport = typeof window !== 'undefined' && window.innerWidth < 768;

      if (action.type === 'open_project') {
        if (isCompactViewport) setIsChatOpen(false);
        const labEl = document.getElementById('laboratorio');
        if (labEl) labEl.scrollIntoView({ behavior: 'smooth' });
        highlightProjectTemporarily(action.projectId);
        openProjectModal(action.projectId);
        return;
      }

      if (action.type === 'scroll') {
        if (isCompactViewport) setIsChatOpen(false);
        const target = document.getElementById(action.sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [highlightProjectTemporarily, openProjectModal]
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-brand-obsidian text-brand-ivory font-sans selection:bg-brand-teal selection:text-white">
      {/* Subtle Studio Film-Grain Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-film-grain opacity-70"
      />

      {/* Sticky Header with Reading Progress, ScrollSpy & PT/EN Toggle */}
      <Navbar activeSection={activeSection} />

      {/* Main Editorial Flow */}
      <main className="relative z-[2] flex-grow">
        <Hero onSelectProject={handleSelectProjectFromHero} />
        <About />
        <Timeline />
        <Skills
          selectedSkillId={selectedSkillId}
          onSelectSkill={(id) => setSelectedSkillId(id)}
        />
        <Projects
          onSelectProjectId={openProjectModal}
          selectedSkillId={selectedSkillId}
          onClearSkillFilter={() => setSelectedSkillId(null)}
          highlightedProjectId={highlightedProjectId}
        />
        <Contact
          prefill={contactPrefill}
          onSuccess={(msg) => showToast(msg, 'success')}
          onError={(msg) => showToast(msg, 'error')}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Architecture Case Study Modal with SVG Diagrams & Focus Trap */}
      <ProjectModal
        projectId={selectedProjectId}
        onClose={closeProjectModal}
        onAskDobby={handleAskDobby}
        onDiscussProject={handleDiscussProject}
        isEscapeSuppressed={isChatOpen}
      />

      {/* Interactive Toast Notification (Top-Right, never collides with Dobby FAB) */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}

      {/* Floating Active AI Agent (Dobby) */}
      <ChatWidget
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        pendingPrompt={pendingPrompt}
        onExecuteAction={handleDobbyAction}
        onNotify={showToast}
      />
    </div>
  );
};

export default App;
