// OpenRouter API para chat (substitui Gemini direto)
import { CHAT_SYSTEM_INSTRUCTION } from '../src/data/chatContext';

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
  if (current.count >= maxRequests) return false;
  current.count += 1;
  return true;
}

async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: any) => { raw += chunk; if (raw.length > 30000) { req.destroy(); reject(new Error('Payload too large')); } });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

const DEFAULT_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemini-2.0-flash-001:free',
  'qwen/qwen-2.5-7b-instruct:free',
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'Method Not Allowed' })); return; }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    res.statusCode = 429; res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Limite temporario de mensagens atingido. Aguarde um minuto.' })); return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    res.statusCode = 500; res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY nao configurada no servidor.' })); return;
  }

  try {
    const body = await parseRequestBody(req);
    const { message, history } = body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.statusCode = 400; res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Mensagem vazia ou invalida.' })); return;
    }
    const trimmedMessage = message.trim().slice(0, 1000);

    const messages: { role: string; content: string }[] = [
      { role: 'system', content: CHAT_SYSTEM_INSTRUCTION },
    ];

    if (Array.isArray(history)) {
      const rawTurns = history.filter((item: any) =>
        (item.role === 'user' || item.role === 'assistant' || item.role === 'model') && item.content?.trim()
      ).slice(-8);
      let expectedRole = 'user';
      for (const turn of rawTurns) {
        const role = turn.role === 'model' ? 'assistant' : turn.role;
        if (role === expectedRole) {
          messages.push({ role, content: String(turn.content).trim().slice(0, 1500) });
          expectedRole = expectedRole === 'user' ? 'assistant' : 'user';
        }
      }
    }
    messages.push({ role: 'user', content: trimmedMessage });

    const customModel = process.env.OPENROUTER_MODEL?.trim();
    const candidateModels = customModel ? [customModel, ...DEFAULT_MODELS.filter(m => m !== customModel)] : DEFAULT_MODELS;

    let openRouterResponse: Response | null = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey, 'HTTP-Referer': process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000', 'X-Title': 'Portfolio Fernando Calisto' },
          body: JSON.stringify({ model, messages, stream: true, temperature: 0.7, max_tokens: 1200 }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (openRouterResponse.ok) break;
        const errText = await openRouterResponse.text().catch(() => '');
        console.warn('[OpenRouter ' + model + ' falhou]:', errText.slice(0, 200));
        openRouterResponse = null;
      } catch (err: any) { lastError = err; console.warn('[OpenRouter ' + model + ' erro]:', err?.message || err); }
    }

    if (!openRouterResponse) throw lastError || new Error('Nenhum modelo disponivel.');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    const reader = openRouterResponse.body?.getReader();
    if (!reader) throw new Error('Falha ao ler resposta do OpenRouter.');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const jsonStr = t.replace(/^data:\s*/, '');
        if (!jsonStr || jsonStr === '[DONE]') { res.write('data: ' + JSON.stringify({ done: true }) + '\n\n'); res.end(); return; }
        try {
          const data = JSON.parse(jsonStr);
          const content = data.choices?.[0]?.delta?.content;
          if (content) res.write('data: ' + JSON.stringify({ text: content }) + '\n\n');
          if (data.choices?.[0]?.finish_reason === 'stop') { res.write('data: ' + JSON.stringify({ done: true }) + '\n\n'); res.end(); return; }
        } catch {}
      }
    }
    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n');
    res.end();
  } catch (err: any) {
    console.error('[API /api/chat error]:', err?.message || err);
    let msg = 'Ocorreu uma oscilacao na comunicacao com a IA. Tente novamente.';
    if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) msg = 'Chave da API do OpenRouter invalida.';
    else if (err?.status === 429 || err?.message?.includes('429')) msg = 'Muitas perguntas! Aguarde alguns segundos.';
    else if (err?.name === 'AbortError') msg = 'Modelo demorando muito. Tente novamente.';
    if (!res.headersSent) { res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: msg })); }
    else { res.write('data: ' + JSON.stringify({ error: msg }) + '\n\n'); res.end(); }
  }
}
