import { describe, expect, it } from 'vitest';
import { parseDobbyMessage } from '../dobbyActions';

describe('parseDobbyMessage', () => {
  it('extracts open_project and scroll actions and strips tags from visible text', () => {
    const raw =
      'Dobby recomenda explorar o projeto PANOPTES!\n[[ACTION:open_project:panoptes]]\n[[ACTION:scroll:contato]]';
    const parsed = parseDobbyMessage(raw);
    expect(parsed.visibleText).toBe('Dobby recomenda explorar o projeto PANOPTES!');
    expect(parsed.actions).toEqual([
      { type: 'open_project', projectId: 'panoptes' },
      { type: 'scroll', sectionId: 'contato' },
    ]);
  });

  it('discards invalid project IDs and disallowed section IDs safely', () => {
    const raw =
      'Teste\n[[ACTION:open_project:__proto__]]\n[[ACTION:open_project:inexistente]]\n[[ACTION:scroll:hero]]';
    const parsed = parseDobbyMessage(raw);
    expect(parsed.visibleText).toBe('Teste');
    expect(parsed.actions).toEqual([]);
  });

  it('extracts valid lead_draft JSON and rejects malformed or invalid-email drafts', () => {
    const validRaw =
      'Dobby preparou seu contato!\n[[ACTION:lead_draft:{"name":"Ana","email":"ana@corp.com","subject":"talos","message":"Quero automatizar ERP"}]]';
    const valid = parseDobbyMessage(validRaw);
    expect(valid.visibleText).toBe('Dobby preparou seu contato!');
    expect(valid.actions).toEqual([
      {
        type: 'lead_draft',
        draft: {
          name: 'Ana',
          email: 'ana@corp.com',
          subject: 'talos',
          message: 'Quero automatizar ERP',
        },
      },
    ]);

    const badEmailRaw =
      'Oi [[ACTION:lead_draft:{"name":"Ana","email":"bad-email","subject":"talos","message":"Oi"}]]';
    expect(parseDobbyMessage(badEmailRaw).actions).toEqual([]);

    const brokenJsonRaw = 'Oi [[ACTION:lead_draft:{not-json]]';
    expect(parseDobbyMessage(brokenJsonRaw).actions).toEqual([]);
  });

  it('hides partial streaming action tags so raw markers never flicker in UI', () => {
    expect(parseDobbyMessage('Veja o projeto [[ACT')).toEqual({
      visibleText: 'Veja o projeto',
      actions: [],
    });
    expect(parseDobbyMessage('Veja [[ACTION:open_project:tal')).toEqual({
      visibleText: 'Veja',
      actions: [],
    });
    expect(parseDobbyMessage('Veja [[ACTION:lead_draft:{"name":"Ana"')).toEqual({
      visibleText: 'Veja',
      actions: [],
    });
  });
});
