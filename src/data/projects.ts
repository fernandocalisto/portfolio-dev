import { PROJECTS } from '../../shared/portfolioData';
import type { ProjectItem } from '../types';

export { PROJECTS, PROJECT_IDS, getProjectById } from '../../shared/portfolioData';

export const projectsData: ProjectItem[] = PROJECTS.map((p) => ({
  id: p.id,
  title: p.title.pt,
  subtitle: p.subtitle.pt,
  role: p.role.pt,
  category: p.category,
  tag: p.tag.pt,
  tagColor: p.badgeTextColor,
  accentColor: p.accentColor,
  logo: p.logo,
  summary: p.summary.pt,
  challenge: p.challenge.pt,
  architecture: p.architecture.map((a) => a.pt),
  techStack: [...p.techStack],
  metrics: p.metrics.map((m) => m.pt),
  featured: p.featured,
  link: p.link,
}));
