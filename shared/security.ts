import type { ApiRequest, ApiResponse, ContactSource, ContactSubject } from './types.js';

const ALLOWED_SUBJECTS: readonly ContactSubject[] = [
  'talos',
  'opportunity',
  'drakon',
  'project',
  'other',
];

const ALLOWED_SOURCES: readonly ContactSource[] = ['form', 'dobby_chat'];

const STATIC_ALLOWED_ORIGINS = new Set<string>([
  'https://fernandocalisto.com.br',
  'https://www.fernandocalisto.com.br',
]);

const LOCALHOST_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/i;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeSafeUrl(raw: string): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === 'https:' ||
      parsed.protocol === 'http:' ||
      parsed.protocol === 'mailto:'
    ) {
      return trimmed;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(origin: string | undefined, vercelUrl?: string): boolean {
  if (!origin || typeof origin !== 'string') return false;
  const normalized = origin.trim();
  if (!normalized) return false;

  if (STATIC_ALLOWED_ORIGINS.has(normalized)) {
    return true;
  }

  if (LOCALHOST_ORIGIN_RE.test(normalized)) {
    return true;
  }

  if (vercelUrl && vercelUrl.trim()) {
    const cleanVercelHost = vercelUrl.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    if (normalized === `https://${cleanVercelHost}`) {
      return true;
    }
  }

  return false;
}

export function applyCorsHeaders(
  req: ApiRequest,
  res: ApiResponse,
  methods: string,
  vercelUrl?: string
): void {
  const originHeader = req.headers.origin;
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;

  res.setHeader('Vary', 'Origin');
  if (isAllowedOrigin(origin, vercelUrl)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface ValidatedContactData {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  source: ContactSource;
}

export type ContactValidationResult =
  | { ok: true; data: ValidatedContactData; honeypotTriggered: boolean }
  | { ok: false; error: string };

export function validateContactPayload(body: unknown): ContactValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Payload inválido.' };
  }

  const record = body as Record<string, unknown>;
  const website = typeof record.website === 'string' ? record.website.trim() : '';

  if (website.length > 0) {
    return {
      ok: true,
      honeypotTriggered: true,
      data: {
        name: '',
        email: '',
        subject: 'other',
        message: '',
        source: 'form',
      },
    };
  }

  const { name, email, message, subject, source } = record;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return {
      ok: false,
      error: 'Por favor, preencha todos os campos do formulário.',
    };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (trimmedName.length > 120 || trimmedEmail.length > 160 || trimmedMessage.length > 4000) {
    return {
      ok: false,
      error:
        'Um ou mais campos excederam o tamanho máximo permitido (Nome: 120, E-mail: 160, Mensagem: 4000 caracteres).',
    };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      ok: false,
      error: 'Por favor, informe um endereço de e-mail válido.',
    };
  }

  const normalizedSubject: ContactSubject =
    typeof subject === 'string' && ALLOWED_SUBJECTS.includes(subject as ContactSubject)
      ? (subject as ContactSubject)
      : 'other';

  const normalizedSource: ContactSource =
    typeof source === 'string' && ALLOWED_SOURCES.includes(source as ContactSource)
      ? (source as ContactSource)
      : 'form';

  return {
    ok: true,
    honeypotTriggered: false,
    data: {
      name: trimmedName,
      email: trimmedEmail,
      subject: normalizedSubject,
      message: trimmedMessage,
      source: normalizedSource,
    },
  };
}
