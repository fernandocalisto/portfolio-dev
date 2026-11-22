import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import chatHandler, { DEFAULT_MODELS } from '../chat';
import contactHandler from '../contact';
import { buildDobbyPrompt } from '../../shared/buildDobbyPrompt';
import type { ApiRequest, ApiResponse } from '../../shared/types';

let ipCounter = 1;

function createMockReq(overrides: Partial<ApiRequest> = {}): ApiRequest {
  const ip = `10.0.0.${ipCounter++}`;
  return {
    method: 'POST',
    headers: {
      'x-forwarded-for': ip,
      ...(overrides.headers ?? {}),
    },
    body: overrides.body,
    socket: { remoteAddress: ip },
    ...overrides,
  };
}

interface MockResponseHandle {
  res: ApiResponse;
  headers: Record<string, string>;
  chunks: string[];
  getBody: () => string;
  getJson: () => Record<string, unknown>;
}

function createMockRes(): MockResponseHandle {
  const headers: Record<string, string> = {};
  const chunks: string[] = [];

  const res: ApiResponse = {
    statusCode: 200,
    headersSent: false,
    setHeader(name: string, value: string) {
      headers[name] = value;
    },
    flushHeaders() {
      res.headersSent = true;
    },
    write(chunk: string) {
      res.headersSent = true;
      chunks.push(chunk);
    },
    end(chunk?: string) {
      res.headersSent = true;
      if (chunk) {
        chunks.push(chunk);
      }
    },
  };

  return {
    res,
    headers,
    chunks,
    getBody: () => chunks.join(''),
    getJson: () => JSON.parse(chunks.join('')) as Record<string, unknown>,
  };
}

function createSseStream(events: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(event));
      }
      controller.close();
    },
  });
}

describe('/api/contact handler', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-telegram-token';
    process.env.TELEGRAM_CHAT_ID = '123456789';
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects GET requests with 405 Method Not Allowed', async () => {
    const req = createMockReq({ method: 'GET' });
    const mock = createMockRes();

    await contactHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(405);
    expect(mock.getJson()).toEqual({ error: 'Method Not Allowed' });
  });

  it('applies CORS allowlist (allows production domain and omits unknown origins)', async () => {
    const allowedReq = createMockReq({
      method: 'OPTIONS',
      headers: { origin: 'https://fernandocalisto.com.br' },
    });
    const allowedRes = createMockRes();
    await contactHandler(allowedReq, allowedRes.res);

    expect(allowedRes.res.statusCode).toBe(204);
    expect(allowedRes.headers['Access-Control-Allow-Origin']).toBe('https://fernandocalisto.com.br');
    expect(allowedRes.headers['Vary']).toBe('Origin');

    const blockedReq = createMockReq({
      method: 'OPTIONS',
      headers: { origin: 'https://evil.com' },
    });
    const blockedRes = createMockRes();
    await contactHandler(blockedReq, blockedRes.res);

    expect(blockedRes.res.statusCode).toBe(204);
    expect(blockedRes.headers['Access-Control-Allow-Origin']).toBeUndefined();
    expect(blockedRes.headers['Vary']).toBe('Origin');
  });

  it('returns 200 { success: true } silently without calling Telegram when honeypot website is filled', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const req = createMockReq({
      body: {
        name: 'Spam Bot',
        email: 'bot@spam.ru',
        subject: 'other',
        message: 'Buy links now',
        website: 'https://spam.ru',
      },
    });
    const mock = createMockRes();

    await contactHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(200);
    expect(mock.getJson()).toEqual({ success: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('escapes HTML in name/message and includes subject and Dobby source label in Telegram payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const req = createMockReq({
      headers: { origin: 'https://fernandocalisto.com.br' },
      body: {
        name: '<script>alert(1)</script> Ana',
        email: 'ana@empresa.com',
        subject: 'talos',
        source: 'dobby_chat',
        message: 'Queremos <b>automatizar</b> processos & integrações.',
        website: '',
      },
    });
    const mock = createMockRes();

    await contactHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(200);
    expect(mock.getJson()).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('https://api.telegram.org/bottest-telegram-token/sendMessage');
    expect(init.signal).toBeInstanceOf(AbortSignal);

    const sentPayload = JSON.parse(String(init.body)) as {
      chat_id: string;
      text: string;
      parse_mode: string;
    };
    expect(sentPayload.chat_id).toBe('123456789');
    expect(sentPayload.parse_mode).toBe('HTML');
    expect(sentPayload.text).toContain('&lt;script&gt;alert(1)&lt;/script&gt; Ana');
    expect(sentPayload.text).not.toContain('<script>');
    expect(sentPayload.text).toContain('Lead Qualificado via Dobby');
    expect(sentPayload.text).toContain('TALOS');
    expect(sentPayload.text).toContain('&lt;b&gt;automatizar&lt;/b&gt;');
  });

  it('returns 500 error referencing email and containing NO mention of WhatsApp when Telegram fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, description: 'Bad Gateway' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const req = createMockReq({
      body: {
        name: 'Carlos',
        email: 'carlos@corp.com',
        subject: 'opportunity',
        message: 'Temos uma vaga remota.',
      },
    });
    const mock = createMockRes();

    await contactHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(500);
    const json = mock.getJson();
    expect(typeof json.error).toBe('string');
    const errorMessage = String(json.error);
    expect(errorMessage.toLowerCase()).not.toContain('whatsapp');
    expect(errorMessage).toContain('fernandocalisto.dev@gmail.com');
  });
});

describe('/api/chat handler', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
    delete process.env.OPENROUTER_MODEL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects GET requests with 405 Method Not Allowed', async () => {
    const req = createMockReq({ method: 'GET' });
    const mock = createMockRes();

    await chatHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(405);
    expect(mock.getJson()).toEqual({ error: 'Method Not Allowed' });
  });

  it('rejects empty messages with 400 Bad Request', async () => {
    const req = createMockReq({
      body: { message: '   ', history: [], locale: 'pt' },
    });
    const mock = createMockRes();

    await chatHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(400);
    expect(mock.getJson()).toHaveProperty('error');
  });

  it('uses English system prompt from buildDobbyPrompt("en") when locale is "en"', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        createSseStream([
          'data: {"choices":[{"delta":{"content":"Hello from Dobby!"}}]}\n\n',
          'data: [DONE]\n\n',
        ]),
        {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const req = createMockReq({
      headers: { origin: 'https://fernandocalisto.com.br' },
      body: {
        message: 'Tell me about PANOPTES',
        history: [],
        locale: 'en',
      },
    });
    const mock = createMockRes();

    await chatHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(200);
    expect(mock.headers['Access-Control-Allow-Origin']).toBe('https://fernandocalisto.com.br');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const requestPayload = JSON.parse(String(init.body)) as {
      model: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(requestPayload.messages[0]).toEqual({
      role: 'system',
      content: buildDobbyPrompt('en'),
    });
    expect(mock.getBody()).toContain('Hello from Dobby!');
    expect(mock.getBody()).toContain('"done":true');
  });

  it('falls back from a failing 1st model (503) to the working 2nd model', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('Service Unavailable', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        })
      )
      .mockResolvedValueOnce(
        new Response(
          createSseStream([
            'data: {"choices":[{"delta":{"content":"Resposta via fallback"}}]}\n\n',
            'data: [DONE]\n\n',
          ]),
          {
            status: 200,
            headers: { 'Content-Type': 'text/event-stream' },
          }
        )
      );
    vi.stubGlobal('fetch', fetchMock);

    const req = createMockReq({
      body: {
        message: 'Explique a arquitetura do TALOS',
        history: [],
        locale: 'pt',
      },
    });
    const mock = createMockRes();

    await chatHandler(req, mock.res);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const firstBody = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body)) as {
      model: string;
    };
    const secondBody = JSON.parse(String((fetchMock.mock.calls[1] as [string, RequestInit])[1].body)) as {
      model: string;
    };
    expect(firstBody.model).not.toBe(secondBody.model);
    expect(mock.res.statusCode).toBe(200);
    expect(mock.getBody()).toContain('Resposta via fallback');
    expect(mock.getBody()).toContain('"done":true');
  });

  it('emits an SSE { error } event when an HTTP 200 stream ends with [DONE] and zero content', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(createSseStream(['data: [DONE]\n\n']), {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const req = createMockReq({
      body: {
        message: 'Oi Dobby',
        history: [],
        locale: 'pt',
      },
    });
    const mock = createMockRes();

    await chatHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(200);
    const body = mock.getBody();
    expect(body).toContain('"error":');
    expect(body).not.toContain('"done":true');
  });

  it('includes openrouter/free as the final fallback model and omits CORS header for unknown origins', async () => {
    expect(DEFAULT_MODELS[DEFAULT_MODELS.length - 1]).toBe('openrouter/free');

    const req = createMockReq({
      method: 'OPTIONS',
      headers: { origin: 'https://evil.com' },
    });
    const mock = createMockRes();

    await chatHandler(req, mock.res);

    expect(mock.res.statusCode).toBe(204);
    expect(mock.headers['Access-Control-Allow-Origin']).toBeUndefined();
    expect(mock.headers['Vary']).toBe('Origin');
  });
});
