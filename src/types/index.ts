export type {
  ContactSource,
  ContactSubject,
  DiagramEdgeSpec,
  DiagramNodeSpec,
  DobbyAction,
  LeadDraft,
  Locale,
  LocalizedString,
  ProfileData,
  ProjectCategory,
  ProjectDiagramSpec,
  ProjectId,
  ProjectOrbitConfig,
  ProjectSpec,
  ScrollableSectionId,
  SectionId,
  SkillCategory,
  SkillSpec,
  TimelineSpec,
} from '../../shared/types';

export interface TimelineItem {
  year: string;
  title: string;
  period?: string;
  tag: string;
  desc: string;
  highlight?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'backend' | 'frontend' | 'ai' | 'database';
  categoryLabel: string;
  level: string;
  icon: string;
  color: string;
  featured?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  category: 'startup' | 'enterprise' | 'ai' | 'devtool';
  tag: string;
  tagColor: string;
  accentColor: string;
  logo: string;
  summary: string;
  challenge: string;
  architecture: string[];
  techStack: string[];
  metrics: string[];
  featured?: boolean;
  link?: string;
}
