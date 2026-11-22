import { buildDobbyPrompt } from '../shared/buildDobbyPrompt';
import { applyCorsHeaders } from '../shared/security';
import type { ApiRequest, ApiResponse, Locale } from '../shared/types';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 25;
const MAX_BODY_BYTES = 30_000;
const TOTAL_BUDGET_MS = 24_000;
const PER_MODEL_TIMEOUT_MS = 7_000;
const MIN_REMAINING_BUDGET_MS = 500;

export const DEFAULT_MODELS: readonly string[] = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'poolside/laguna-s-2.1:free',
  'nvidia/nemotron-3.5-lightning:free',
  'google/gemma-4-31b-it:free',
  'qwen/qwen3.8-27b:free',
  'openrouter/free',
];

interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RawHistoryTurn {
  role?: unknown;
  content?: unknown;
}

interface OpenRouterStreamChunk {
  choices?: Array<{
    delta?: {
      content?: unknown;
    };
    finish_reason?: unknown;
  }>;
}

// In-memory rate limiting (max 25 requests per minute per IP)
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

function normalizeHistory(history: unknown): ChatCompletionMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  const validTurns = history
    .filter((item): item is RawHistoryTurn => Boolean(item && typeof item === 'object'))
    .filter((item) => {
      const validRole =
        item.role === 'user' || item.role === 'assistant' || item.role === 'model';
      return validRole && typeof item.content === 'string' && item.content.trim().length > 0;
    })
    .slice(-8);

  const normalized: ChatCompletionMessage[] = [];
  let expectedRole: 'user' | 'assistant' = 'user';

  for (const turn of validTurns) {
    const role: 'user' | 'assistant' = turn.role === 'model' ? 'assistant' : (turn.role as 'user' | 'assistant');
    if (role === expectedRole && typeof turn.content === 'string') {
      normalized.push({
        role,
        content: turn.content.trim().slice(0, 1500),
      });
      expectedRole = expectedRole === 'user' ? 'assistant' : 'user';
    }
  }

  return normalized;
}

function resolveLocale(rawLocale: unknown): Locale {
  return rawLocale === 'en' ? 'en' : 'pt';
}

function getFriendlyError(err: unknown, locale: Locale): string {
  const errMessage = err instanceof Error ? err.message : String(err);
  const errName = err instanceof Error ? err.name : '';

  if (errMessage.includes('401') || errMessage.includes('Unauthorized')) {
    return locale === 'en'
      ? 'Invalid OpenRouter API key.'
      : 'Chave da API do OpenRouter inválida.';
  }

  if (errMessage.includes('429')) {
    return locale === 'en'
      ? 'Too many questions! Please wait a few seconds and try again.'
      : 'Muitas perguntas! Aguarde alguns segundos e tente novamente.';
  }

  if (errName === 'AbortError') {
    return locale === 'en'
      ? 'The AI model took too long to respond. Please try again.'
      : 'O modelo demorou muito para responder. Tente novamente.';
  }

  return locale === 'en'
    ? 'A temporary AI communication issue occurred. Please try again.'
    : 'Ocorreu uma oscilação na comunicação com a IA. Tente novamente.';
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
      error: 'Limite temporário de mensagens atingido. Aguarde um minuto.',
    });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    sendJson(res, 500, { error: 'OPENROUTER_API_KEY não configurada no servidor.' });
    return;
  }

  let locale: Locale = 'pt';

  try {
    const body = await parseRequestBody(req);
    const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    locale = resolveLocale(record.locale);

    const rawMessage = record.message;
    if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
      sendJson(res, 400, {
        error: locale === 'en' ? 'Empty or invalid message.' : 'Mensagem vazia ou inválida.',
      });
      return;
    }

    const trimmedMessage = rawMessage.trim().slice(0, 1000);
    const messages: ChatCompletionMessage[] = [
      { role: 'system', content: buildDobbyPrompt(locale) },
      ...normalizeHistory(record.history),
      { role: 'user', content: trimmedMessage },
    ];

    const customModel = process.env.OPENROUTER_MODEL?.trim();
    const candidateModels: readonly string[] = customModel
      ? [customModel, ...DEFAULT_MODELS.filter((m) => m !== customModel)]
      : DEFAULT_MODELS;

    const budgetStartedAt = Date.now();
    let openRouterResponse: Response | null = null;
    let lastError: unknown = null;

    for (const model of candidateModels) {
      const elapsed = Date.now() - budgetStartedAt;
      const remainingBudget = TOTAL_BUDGET_MS - elapsed;
      if (remainingBudget < MIN_REMAINING_BUDGET_MS) {
        break;
      }

      const attemptTimeoutMs = Math.min(PER_MODEL_TIMEOUT_MS, remainingBudget);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), attemptTimeoutMs);

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : 'https://fernandocalisto.com.br',
            'X-Title': 'Portfolio Fernando Calisto',
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 1200,
          }),
          signal: controller.signal,
        });

        if (response.ok) {
          openRouterResponse = response;
          break;
        }

        const errText = await response.text().catch(() => '');
        console.warn(`[OpenRouter ${model} failed (${response.status})]:`, errText.slice(0, 200));
      } catch (err: unknown) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[OpenRouter ${model} error]:`, errMsg);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (!openRouterResponse) {
      throw lastError instanceof Error ? lastError : new Error('Nenhum modelo disponível.');
    }

    const reader = openRouterResponse.body?.getReader();
    if (!reader) {
      throw new Error('Falha ao ler resposta do OpenRouter.');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const emptyStreamMessage =
      locale === 'en'
        ? 'Dobby received an empty response from the AI model. Please try again.'
        : 'Dobby recebeu uma resposta vazia do modelo de IA. Tente novamente.';

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let emittedChars = 0;

    const finishStream = (): void => {
      if (emittedChars > 0) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify({ error: emptyStreamMessage })}\n\n`);
      }
      res.end();
    };

    const processLine = (line: string): boolean => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) {
        return false;
      }

      const jsonStr = trimmed.replace(/^data:\s*/, '');
      if (!jsonStr || jsonStr === '[DONE]') {
        finishStream();
        return true;
      }

      try {
        const data = JSON.parse(jsonStr) as OpenRouterStreamChunk;
        const content = data.choices?.[0]?.delta?.content;
        if (typeof content === 'string' && content.length > 0) {
          emittedChars += content.length;
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
        }
        if (data.choices?.[0]?.finish_reason === 'stop') {
          finishStream();
          return true;
        }
      } catch {
        // Ignore malformed SSE comment or partial JSON frames
      }

      return false;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (processLine(line)) {
          return;
        }
      }
    }

    if (buffer.trim()) {
      if (processLine(buffer)) {
        return;
      }
    }

    finishStream();
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[API /api/chat error]:', errMsg);

    const friendlyMsg = getFriendlyError(err, locale);
    if (!res.headersSent) {
      sendJson(res, 500, { error: friendlyMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: friendlyMsg })}\n\n`);
      res.end();
    }
  }
}
