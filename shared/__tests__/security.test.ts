import { describe, expect, it } from 'vitest';
import {
  applyCorsHeaders,
  escapeHtml,
  isAllowedOrigin,
  sanitizeSafeUrl,
  validateContactPayload,
} from '../security';
import type { ApiRequest, ApiResponse } from '../types';

describe('sanitizeSafeUrl', () => {
  it('accepts https, http and mailto URLs', () => {
    expect(sanitizeSafeUrl('https://fernandocalisto.com.br/projects')).toBe(
      'https://fernandocalisto.com.br/projects'
    );
    expect(sanitizeSafeUrl('http://localhost:3000')).toBe('http://localhost:3000');
    expect(sanitizeSafeUrl('mailto:fernandocalisto.dev@gmail.com')).toBe(
      'mailto:fernandocalisto.dev@gmail.com'
    );
  });

  it('rejects unsafe protocols and malformed URLs', () => {
    expect(sanitizeSafeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeSafeUrl('JAVASCRIPT:alert(1)')).toBeNull();
    expect(sanitizeSafeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(sanitizeSafeUrl('vbscript:msgbox(1)')).toBeNull();
    expect(sanitizeSafeUrl('')).toBeNull();
    expect(sanitizeSafeUrl('not a url')).toBeNull();
  });
});

describe('isAllowedOrigin & applyCorsHeaders', () => {
  it('allows production domain, www, localhost and active vercel preview URL', () => {
    expect(isAllowedOrigin('https://fernandocalisto.com.br')).toBe(true);
    expect(isAllowedOrigin('https://www.fernandocalisto.com.br')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://127.0.0.1:5173')).toBe(true);
    expect(isAllowedOrigin('https://preview-123.vercel.app', 'preview-123.vercel.app')).toBe(true);
  });

  it('rejects unknown third-party origins', () => {
    expect(isAllowedOrigin('https://evil.com')).toBe(false);
    expect(isAllowedOrigin('https://fernandocalisto.com.br.evil.com')).toBe(false);
    expect(isAllowedOrigin(undefined)).toBe(false);
  });

  it('sets Access-Control-Allow-Origin only for allowed origins and sets Vary: Origin', () => {
    const createRes = () => {
      const headers: Record<string, string> = {};
      const res: ApiResponse = {
        statusCode: 200,
        setHeader: (k, v) => {
          headers[k] = v;
        },
        write: () => {},
        end: () => {},
      };
      return { res, headers };
    };

    const allowedReq: ApiRequest = { headers: { origin: 'https://fernandocalisto.com.br' } };
    const allowed = createRes();
    applyCorsHeaders(allowedReq, allowed.res, 'POST, OPTIONS');
    expect(allowed.headers['Access-Control-Allow-Origin']).toBe('https://fernandocalisto.com.br');
    expect(allowed.headers['Vary']).toBe('Origin');

    const blockedReq: ApiRequest = { headers: { origin: 'https://evil.com' } };
    const blocked = createRes();
    applyCorsHeaders(blockedReq, blocked.res, 'POST, OPTIONS');
    expect(blocked.headers['Access-Control-Allow-Origin']).toBeUndefined();
    expect(blocked.headers['Vary']).toBe('Origin');
  });
});

describe('escapeHtml & validateContactPayload', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;'
    );
  });

  it('detects honeypot submissions cleanly', () => {
    const res = validateContactPayload({
      name: 'Bot',
      email: 'bot@spam.ru',
      message: 'Buy crypto',
      website: 'http://spam.bot',
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.honeypotTriggered).toBe(true);
    }
  });

  it('validates normal contact payloads and normalizes subject/source', () => {
    const res = validateContactPayload({
      name: '  Maria Silva  ',
      email: 'maria@empresa.com',
      subject: 'talos',
      message: 'Precisamos automatizar nosso ERP.',
      source: 'dobby_chat',
      website: '',
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.honeypotTriggered).toBe(false);
      expect(res.data).toEqual({
        name: 'Maria Silva',
        email: 'maria@empresa.com',
        subject: 'talos',
        message: 'Precisamos automatizar nosso ERP.',
        source: 'dobby_chat',
      });
    }
  });

  it('rejects invalid email and oversized fields', () => {
    expect(
      validateContactPayload({ name: 'A', email: 'invalid-email', message: 'oi' }).ok
    ).toBe(false);
    expect(
      validateContactPayload({
        name: 'A'.repeat(121),
        email: 'a@b.com',
        message: 'oi',
      }).ok
    ).toBe(false);
    expect(
      validateContactPayload({
        name: 'A',
        email: 'a@b.com',
        message: 'x'.repeat(4001),
      }).ok
    ).toBe(false);
  });
});
