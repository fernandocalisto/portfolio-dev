import { PROFILE } from '../shared/portfolioData.js';
import { applyCorsHeaders, escapeHtml, validateContactPayload } from '../shared/security.js';
import type { ApiRequest, ApiResponse, ContactSource, ContactSubject } from '../shared/types.js';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 10_000;
const TELEGRAM_TIMEOUT_MS = 8_000;

const SUBJECT_LABELS: Record<ContactSubject, string> = {
  talos: 'Projeto B2B / TALOS',
  opportunity: 'Vaga / Recrutamento',
  drakon: 'Parceria DRAKON Code',
  project: 'Sobre um Projeto',
  other: 'Outro',
};

const SOURCE_BADGES: Record<ContactSource, string> = {
  form: 'Formulário do Site',
  dobby_chat: 'Lead Qualificado via Dobby 🤖',
};

// In-memory rate limiting (max 5 requests per hour per IP)
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = ipRateLimitMap.get(ip);

  if (!current || now > current.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

function getClientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const headerValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return headerValue?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
}

function sendJson(res: ApiResponse, statusCode: number, payload: Record<string, unknown>): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function parseRequestBody(req: ApiRequest): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') {
      return req.body;
    }
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body) as unknown;
      } catch {
        return {};
      }
    }
  }

  if (typeof req.on !== 'function') {
    return {};
  }

  return new Promise<unknown>((resolve, reject) => {
    let raw = '';
    req.on?.('data', (chunk: unknown) => {
      raw += String(chunk);
      if (raw.length > MAX_BODY_BYTES) {
        req.destroy?.();
        reject(new Error('Payload too large'));
      }
    });
    req.on?.('end', () => {
      try {
        resolve(raw ? (JSON.parse(raw) as unknown) : {});
      } catch {
        resolve({});
      }
    });
    req.on?.('error', (err: unknown) => {
      reject(err instanceof Error ? err : new Error(String(err)));
    });
  });
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  applyCorsHeaders(req, res, 'POST, OPTIONS', process.env.VERCEL_URL);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    sendJson(res, 429, {
      error: 'Muitas tentativas. Por favor, aguarde uma hora antes de enviar outra mensagem.',
    });
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const validation = validateContactPayload(body);

    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    // Silent honeypot success: bots receive 200 without triggering Telegram
    if (validation.honeypotTriggered) {
      sendJson(res, 200, { success: true });
      return;
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!telegramToken || !telegramChatId) {
      sendJson(res, 500, {
        error: `Contato temporariamente indisponível. Envie diretamente para ${PROFILE.email}.`,
      });
      return;
    }

    const { name, email, subject, message, source } = validation.data;
    const sourceBadge = SOURCE_BADGES[source];
    const subjectLabel = SUBJECT_LABELS[subject];

    const text = [
      '<b>🚀 Novo Contato pelo Portfólio</b>',
      `<b>Origem:</b> ${escapeHtml(sourceBadge)}`,
      `<b>Assunto:</b> ${escapeHtml(subjectLabel)}`,
      '',
      `<b>Nome:</b> ${escapeHtml(name)}`,
      `<b>E-mail:</b> ${escapeHtml(email)}`,
      '',
      '<b>Mensagem:</b>',
      escapeHtml(message),
    ].join('\n');

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: 'HTML',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData: unknown = await response.json().catch(() => ({}));
        console.error('[API /api/contact Telegram error]:', response.status, errorData);
        throw new Error('Falha na comunicação com a Telegram API');
      }
    } finally {
      clearTimeout(timeoutId);
    }

    sendJson(res, 200, { success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[API /api/contact error]:', errMsg);

    sendJson(res, 500, {
      error: `Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde ou escreva diretamente para ${PROFILE.email}.`,
    });
  }
}
