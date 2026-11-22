export type Locale = 'pt' | 'en';

export type LocalizedString = Record<Locale, string>;

export type ProjectId = 'talos' | 'drakon' | 'ai-ecosystem' | 'jasper' | 'panoptes';

export type ProjectCategory = 'startup' | 'enterprise' | 'ai' | 'devtool';

export type SkillCategory = 'backend' | 'frontend' | 'ai' | 'database';

export type SectionId = 'hero' | 'sobre' | 'timeline' | 'skills' | 'laboratorio' | 'contato';

export type ScrollableSectionId = Exclude<SectionId, 'hero'>;

export type ContactSubject = 'talos' | 'opportunity' | 'drakon' | 'project' | 'other';

export type ContactSource = 'form' | 'dobby_chat';

export interface LeadDraft {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
}

export type DobbyAction =
  | { type: 'open_project'; projectId: ProjectId }
  | { type: 'scroll'; sectionId: ScrollableSectionId }
  | { type: 'lead_draft'; draft: LeadDraft };

export interface DiagramNodeSpec {
  id: string;
  label: LocalizedString;
  sublabel?: LocalizedString;
  detail: LocalizedString;
  x: number;
  y: number;
  accent?: 'teal' | 'gold' | 'copper' | 'crimson' | 'blue';
}

export interface DiagramEdgeSpec {
  from: string;
  to: string;
  label?: LocalizedString;
}

export interface ProjectDiagramSpec {
  viewBoxWidth: number;
  viewBoxHeight: number;
  nodes: readonly DiagramNodeSpec[];
  edges: readonly DiagramEdgeSpec[];
}

export interface ProjectOrbitConfig {
  ringIndex: 0 | 1 | 2;
  radius: number;
  speed: number;
  initialAngle: number;
  size: number;
}

export interface ResolvedOrbitProject {
  project: ProjectSpec;
  orbit: ProjectOrbitConfig;
}

export interface ProjectSpec {
  id: ProjectId;
  shortName: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  role: LocalizedString;
  category: ProjectCategory;
  tag: LocalizedString;
  accentColor: string;
  badgeTextColor: string;
  logo: string;
  summary: LocalizedString;
  challenge: LocalizedString;
  architecture: readonly LocalizedString[];
  techStack: readonly string[];
  skillIds: readonly string[];
  metrics: readonly LocalizedString[];
  featured: boolean;
  /** Controls whether this project orbits Saturn in the 3D Hero (up to MAX_ORBIT_PROJECTS). */
  showInOrbit: boolean;
  link?: string;
  /** Optional manual overrides; rings and angles are balanced automatically when omitted. */
  orbit?: Partial<ProjectOrbitConfig>;
  diagram: ProjectDiagramSpec;
}

export interface SkillSpec {
  id: string;
  name: string;
  category: SkillCategory;
  categoryLabel: LocalizedString;
  icon: string;
  color: string;
  projectIds: readonly ProjectId[];
  featured?: boolean;
}

export interface TimelineSpec {
  year: string;
  period: LocalizedString;
  title: LocalizedString;
  tag: LocalizedString;
  desc: LocalizedString;
  highlight: LocalizedString;
}

export interface ProfileData {
  fullName: string;
  shortName: string;
  role: LocalizedString;
  education: LocalizedString;
  location: LocalizedString;
  availability: LocalizedString;
  email: string;
  github: string;
  linkedin: string;
  siteUrl: string;
  portrait: string;
}

export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  destroy?: () => void;
}

export interface ApiResponse {
  statusCode: number;
  headersSent?: boolean;
  setHeader: (name: string, value: string) => void;
  write: (chunk: string) => void;
  end: (chunk?: string) => void;
  flushHeaders?: () => void;
}
