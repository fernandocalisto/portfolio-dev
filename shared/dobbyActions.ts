import { EMAIL_REGEX } from './security';
import type {
  ContactSubject,
  DobbyAction,
  LeadDraft,
  ProjectId,
  ScrollableSectionId,
} from './types';

const DEFAULT_PROJECT_IDS: readonly ProjectId[] = [
  'talos',
  'drakon',
  'ai-ecosystem',
  'jasper',
  'panoptes',
];

const SCROLLABLE_SECTIONS: readonly ScrollableSectionId[] = [
  'sobre',
  'timeline',
  'skills',
  'laboratorio',
  'contato',
];

const ALLOWED_SUBJECTS: readonly ContactSubject[] = [
  'talos',
  'opportunity',
  'drakon',
  'project',
  'other',
];

const COMPLETE_ACTION_RE = /\[\[ACTION:([a-z_]+):([\s\S]*?)\]\]/g;
const PARTIAL_TRAILING_ACTION_RE = /\[\[(?:A(?:C(?:T(?:I(?:O(?:N(?::[\s\S]*)?)?)?)?)?)?)?$/;

function parseLeadDraft(rawJson: string): LeadDraft | null {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') return null;

    const record = parsed as Record<string, unknown>;
    const name = typeof record.name === 'string' ? record.name.trim() : '';
    const email = typeof record.email === 'string' ? record.email.trim() : '';
    const message = typeof record.message === 'string' ? record.message.trim() : '';
    const rawSubject = typeof record.subject === 'string' ? record.subject.trim() : 'other';

    if (!name || name.length > 120) return null;
    if (!email || email.length > 160 || !EMAIL_REGEX.test(email)) return null;
    if (!message || message.length > 4000) return null;

    const subject: ContactSubject = ALLOWED_SUBJECTS.includes(rawSubject as ContactSubject)
      ? (rawSubject as ContactSubject)
      : 'other';

    return { name, email, subject, message };
  } catch {
    return null;
  }
}

export interface ParsedDobbyMessage {
  visibleText: string;
  actions: DobbyAction[];
}

export function parseDobbyMessage(
  raw: string,
  validProjectIds: readonly ProjectId[] = DEFAULT_PROJECT_IDS
): ParsedDobbyMessage {
  if (!raw || typeof raw !== 'string') {
    return { visibleText: '', actions: [] };
  }

  const actions: DobbyAction[] = [];
  const seenKeys = new Set<string>();

  const withoutComplete = raw.replace(COMPLETE_ACTION_RE, (_full, kind: string, payload: string) => {
    const trimmedPayload = payload.trim();

    if (kind === 'open_project') {
      if (validProjectIds.includes(trimmedPayload as ProjectId)) {
        const key = `open_project:${trimmedPayload}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          actions.push({ type: 'open_project', projectId: trimmedPayload as ProjectId });
        }
      }
      return '';
    }

    if (kind === 'scroll') {
      if (SCROLLABLE_SECTIONS.includes(trimmedPayload as ScrollableSectionId)) {
        const key = `scroll:${trimmedPayload}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          actions.push({ type: 'scroll', sectionId: trimmedPayload as ScrollableSectionId });
        }
      }
      return '';
    }

    if (kind === 'lead_draft') {
      const draft = parseLeadDraft(trimmedPayload);
      if (draft) {
        const key = `lead_draft:${draft.email}:${draft.subject}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          actions.push({ type: 'lead_draft', draft });
        }
      }
      return '';
    }

    return '';
  });

  const visibleText = withoutComplete
    .replace(PARTIAL_TRAILING_ACTION_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { visibleText, actions };
}
