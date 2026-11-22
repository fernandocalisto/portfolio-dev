import { SKILLS } from '../../shared/portfolioData';
import type { SkillItem } from '../types';

export { SKILLS } from '../../shared/portfolioData';

export const skillsData: SkillItem[] = SKILLS.map((s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  categoryLabel: s.categoryLabel.pt,
  level: `${s.projectIds.length} ${s.projectIds.length === 1 ? 'projeto' : 'projetos'}`,
  icon: s.icon,
  color: s.color,
  featured: s.featured,
}));
