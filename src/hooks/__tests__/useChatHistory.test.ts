import { describe, expect, it } from 'vitest';
import type { ChatMessage } from '../../types/chat';
import { buildHistoryPayload } from '../useChat';

function makeMessage(overrides: Partial<ChatMessage> & Pick<ChatMessage, 'id' | 'role' | 'content'>): ChatMessage {
  return {
    timestamp: 1_700_000_000_000,
    ...overrides,
  };
}

describe('buildHistoryPayload', () => {
  it('excludes initial welcome-msg and post-clearChat welcome-* messages', () => {
    const messages: ChatMessage[] = [
      makeMessage({ id: 'welcome-msg', role: 'model', content: 'Olá inicial' }),
      makeMessage({ id: 'welcome-1700000000000', role: 'model', content: 'Olá pós-reset' }),
      makeMessage({ id: 'user-1', role: 'user', content: 'Me conte sobre a TALOS' }),
      makeMessage({ id: 'model-1', role: 'model', content: 'A TALOS automatiza operações B2B.' }),
    ];

    expect(buildHistoryPayload(messages)).toEqual([
      { role: 'user', content: 'Me conte sobre a TALOS' },
      { role: 'model', content: 'A TALOS automatiza operações B2B.' },
    ]);
  });

  it('excludes messages with error=true and messages with empty or whitespace-only content', () => {
    const messages: ChatMessage[] = [
      makeMessage({ id: 'welcome-1700000000001', role: 'model', content: 'Bem-vindo' }),
      makeMessage({ id: 'user-1', role: 'user', content: '   ' }),
      makeMessage({ id: 'model-1', role: 'model', content: '' }),
      makeMessage({ id: 'user-2', role: 'user', content: '  Como funciona o PANOPTES?  ' }),
      makeMessage({ id: 'model-2', role: 'model', content: '⚠️ Timeout', error: true }),
      makeMessage({ id: 'model-3', role: 'model', content: 'Usa funil de 3 estágios em CPU.' }),
    ];

    expect(buildHistoryPayload(messages)).toEqual([
      { role: 'user', content: 'Como funciona o PANOPTES?' },
      { role: 'model', content: 'Usa funil de 3 estágios em CPU.' },
    ]);
  });

  it('caps history payload to the last 8 valid entries', () => {
    const messages: ChatMessage[] = [
      makeMessage({ id: 'welcome-1700000000099', role: 'model', content: 'Welcome' }),
    ];

    for (let i = 1; i <= 12; i += 1) {
      messages.push(
        makeMessage({
          id: `msg-${i}`,
          role: i % 2 === 1 ? 'user' : 'model',
          content: `Mensagem ${i}`,
        })
      );
    }

    const result = buildHistoryPayload(messages);
    expect(result).toHaveLength(8);
    expect(result[0]).toEqual({ role: 'user', content: 'Mensagem 5' });
    expect(result[7]).toEqual({ role: 'model', content: 'Mensagem 12' });
  });
});
