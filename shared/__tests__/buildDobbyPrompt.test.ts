import { describe, expect, it } from 'vitest';
import { buildDobbyPrompt } from '../buildDobbyPrompt';
import { PROFILE, PROJECTS, PROJECT_IDS, SKILLS } from '../portfolioData';

describe('shared portfolioData & buildDobbyPrompt', () => {
  it('generates PT and EN prompts containing all 5 projects, official email and action directives', () => {
    for (const locale of ['pt', 'en'] as const) {
      const prompt = buildDobbyPrompt(locale);
      expect(prompt).toContain('TALOS');
      expect(prompt).toContain('DRAKON');
      expect(prompt).toContain('JasperReports');
      expect(prompt).toContain('PANOPTES');
      expect(prompt).toContain('fernandocalisto.dev@gmail.com');
      expect(prompt).toContain('[[ACTION:open_project:');
      expect(prompt).toContain('[[ACTION:scroll:');
      expect(prompt).toContain('[[ACTION:lead_draft:');
      expect(prompt.toLowerCase()).not.toContain('whatsapp');
      expect(prompt).not.toContain('991554376');
    }
  });

  it('instructs Dobby to respond in English when locale is en', () => {
    const enPrompt = buildDobbyPrompt('en');
    expect(enPrompt.toLowerCase()).toContain('english');
  });

  it('enforces WebP assets, valid project references on all skills, and no phone in profile', () => {
    expect(PROFILE.portrait.endsWith('.webp')).toBe(true);
    expect(JSON.stringify(PROFILE).toLowerCase()).not.toContain('whatsapp');
    expect(JSON.stringify(PROFILE)).not.toContain('991554376');

    expect(PROJECTS).toHaveLength(5);
    for (const project of PROJECTS) {
      expect(project.logo.endsWith('.webp')).toBe(true);
      expect(project.diagram.nodes.length).toBeGreaterThanOrEqual(4);
      expect(project.diagram.edges.length).toBeGreaterThanOrEqual(3);
    }

    expect(SKILLS.length).toBeGreaterThanOrEqual(14);
    for (const skill of SKILLS) {
      expect(skill.projectIds.length).toBeGreaterThan(0);
      for (const pid of skill.projectIds) {
        expect(PROJECT_IDS).toContain(pid);
      }
    }
  });
});
