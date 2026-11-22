import { TIMELINE } from '../../shared/portfolioData';
import type { TimelineItem } from '../types';

export { TIMELINE } from '../../shared/portfolioData';

export const timelineData: TimelineItem[] = TIMELINE.map((t) => ({
  year: t.year,
  period: t.period.pt,
  title: t.title.pt,
  tag: t.tag.pt,
  desc: t.desc.pt,
  highlight: t.highlight.pt,
}));
