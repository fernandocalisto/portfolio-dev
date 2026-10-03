import { GoogleGenAI } from '@google/genai';
import { CHAT_SYSTEM_INSTRUCTION } from '../src/data/chatContext';

interface ChatPart {
  text: string;
}

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: ChatPart[];
}

// In-memory rate limiting (max 25 requests per minute per IP)
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 25;

  const current = ipRateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
      // Protect against large payloads (> 30KB)
      if (raw.length > 30000) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Resilient list of models to try in order
const DEFAULT_CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Rate limiting by client IP
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Limite temporário de mensagens atingido. Por favor, aguarde um minuto para continuar.',
      })
    );
    return;
  }

  // API Key validation
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error:
          'GEMINI_API_KEY não configurada no servidor. Defina a variável de ambiente para habilitar o assistente.',
      })
    );
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const { message, history } = body;

    // Payload validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Mensagem vazia ou inválida.' }));
      return;
    }

    const trimmedMessage = message.trim().slice(0, 1000);

    // Extract raw valid history items
    const rawTurns: { role: 'user' | 'model'; text: string }[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (
          (item.role === 'user' || item.role === 'model') &&
          Array.isArray(item.parts) &&
          item.parts[0]?.text
        ) {
          const text = String(item.parts[0].text).trim().slice(0, 1500);
          if (text) {
            rawTurns.push({ role: item.role, text });
          }
        }
      }
    }

    // Sanitize multi-turn dialogue to strictly satisfy Gemini requirements:
    // 1. Must begin with a 'user' turn (strip any leading 'model' messages).
    // 2. Must strictly alternate: user -> model -> user -> model.
    const sanitizedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    let expectedRole: 'user' | 'model' = 'user';

    for (const turn of rawTurns) {
      if (turn.role === expectedRole) {
        sanitizedContents.push({ role: turn.role, parts: [{ text: turn.text }] });
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    // If the last sanitized turn was 'user', remove it so we don't have two consecutive user turns
    if (
      sanitizedContents.length > 0 &&
      sanitizedContents[sanitizedContents.length - 1].role === 'user'
    ) {
      sanitizedContents.pop();
    }

    // Append the current user prompt
    sanitizedContents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }],
    });

    // Initialize Google Gen AI client
    const ai = new GoogleGenAI({ apiKey });

    // Establish models to attempt with automatic fallback
    const customModel = process.env.GEMINI_MODEL?.trim();
    const candidateModels = customModel
      ? [customModel, ...DEFAULT_CANDIDATE_MODELS.filter((m) => m !== customModel)]
      : DEFAULT_CANDIDATE_MODELS;

    let responseStream: any = null;
    let successfulModel = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        responseStream = await ai.models.generateContentStream({
          model,
          contents: sanitizedContents,
          config: {
            systemInstruction: CHAT_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        });
        successfulModel = model;
        break; // Stream successfully initialized
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini model ${model} failed, attempting fallback]:`, err?.message || err);
        // Continue to next candidate model
      }
    }

    if (!responseStream) {
      throw lastError || new Error('Nenhum modelo disponível no momento.');
    }

    // Start Server-Sent Events (SSE) stream
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Signal stream completion
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error('[API /api/chat error]:', err?.message || err);

    let errorMessage =
      'Ocorreu uma oscilação na comunicação com a inteligência artificial. Por favor, tente novamente.';

    if (
      err?.message?.includes('API_KEY_INVALID') ||
      err?.message?.includes('API key not valid')
    ) {
      errorMessage =
        'A chave da API do Gemini informada é inválida. Verifique o valor em .env.local.';
    } else if (
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('quota') ||
      err?.message?.includes('RESOURCE_EXHAUSTED')
    ) {
      errorMessage =
        'Dobby recebeu muitas perguntas em pouco tempo! Aguarde alguns segundos para continuar.';
    }

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: errorMessage }));
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
}
