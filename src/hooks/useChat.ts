import { useState, useEffect, useRef, useCallback } from 'react';
import type { Locale } from '../../shared/types';
import { TRANSLATIONS } from '../i18n/translations';
import type { ChatHistoryItem, ChatMessage } from '../types/chat';

const STORAGE_KEY = 'fc_portfolio_chat_history_v2';
const MAX_HISTORY_ITEMS = 8;

const ERROR_COPY: Record<
  Locale,
  {
    communication: string;
    readerInit: string;
    emptyResponse: string;
    unexpected: string;
  }
> = {
  pt: {
    communication: 'Não foi possível se comunicar com o assistente.',
    readerInit: 'Falha ao inicializar o leitor de resposta.',
    emptyResponse: 'Dobby não recebeu uma resposta do servidor. Tente novamente.',
    unexpected: 'Ocorreu um erro inesperado ao conectar ao assistente Dobby.',
  },
  en: {
    communication: 'Could not reach the assistant right now.',
    readerInit: 'Failed to initialize response stream reader.',
    emptyResponse: 'Dobby did not receive a response from the server. Please try again.',
    unexpected: 'An unexpected error occurred while connecting to Dobby.',
  },
};

function createWelcomeMessage(locale: Locale, id = 'welcome-msg'): ChatMessage {
  return {
    id,
    role: 'model',
    content: TRANSLATIONS[locale].chat.welcomeMessage,
    timestamp: Date.now(),
  };
}

export function buildHistoryPayload(messages: ChatMessage[]): ChatHistoryItem[] {
  return messages
    .filter((m) => !m.id.startsWith('welcome-') && !m.error && m.content.trim() !== '')
    .slice(-MAX_HISTORY_ITEMS)
    .map((m) => ({
      role: m.role,
      content: m.content.trim(),
    }));
}

export function useChat(locale: Locale = 'pt') {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback on storage read error
    }
    return [createWelcomeMessage(locale)];
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const isGeneratingRef = useRef<boolean>(isGenerating);

  messagesRef.current = messages;
  isGeneratingRef.current = isGenerating;

  // Keep initial welcome banner synchronized if locale is toggled before any user message
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id.startsWith('welcome-')) {
        const localizedWelcome = TRANSLATIONS[locale].chat.welcomeMessage;
        if (prev[0].content !== localizedWelcome) {
          return [{ ...prev[0], content: localizedWelcome }];
        }
      }
      return prev;
    });
  }, [locale]);

  // Sync messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage write error
    }
  }, [messages]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isGeneratingRef.current = false;
    setIsGenerating(false);
    setError(null);
    const nextMessages = [createWelcomeMessage(locale, `welcome-${Date.now()}`)];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, [locale]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isGeneratingRef.current = false;
    setIsGenerating(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  }, []);

  const dispatchMessage = useCallback(
    async (text: string, baseMessages: ChatMessage[]) => {
      const copy = ERROR_COPY[locale];
      setError(null);

      const now = Date.now();
      const userMessageId = `user-${now}`;
      const modelMessageId = `model-${now}`;

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: text,
        timestamp: now,
      };

      const initialModelMessage: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        content: '',
        timestamp: now,
        isStreaming: true,
      };

      const historyPayload = buildHistoryPayload(baseMessages);
      const nextMessages = [...baseMessages, userMessage, initialModelMessage];
      messagesRef.current = nextMessages;
      setMessages(nextMessages);

      isGeneratingRef.current = true;
      setIsGenerating(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            history: historyPayload,
            locale,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errText = copy.communication;
          try {
            const errData = (await response.json()) as { error?: string };
            if (errData?.error) errText = errData.error;
          } catch {
            // Non-JSON error
          }
          throw new Error(errText);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error(copy.readerInit);
        }

        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let buffer = '';

        const processLine = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) return;

          const jsonStr = trimmed.replace(/^data:\s*/, '');
          if (!jsonStr || jsonStr === '[DONE]') return;

          try {
            const data = JSON.parse(jsonStr) as {
              text?: string;
              error?: string;
              done?: boolean;
            };

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.text) {
              accumulatedText += data.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === modelMessageId
                    ? { ...msg, content: accumulatedText, isStreaming: true }
                    : msg
                )
              );
            }

            if (data.done) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === modelMessageId ? { ...msg, isStreaming: false } : msg
                )
              );
            }
          } catch (parseErr: unknown) {
            if (
              parseErr instanceof Error &&
              parseErr.message &&
              !parseErr.message.includes('JSON')
            ) {
              throw parseErr;
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            processLine(line);
          }
        }

        if (buffer.trim()) {
          processLine(buffer);
        }

        if (!accumulatedText.trim()) {
          throw new Error(copy.emptyResponse);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? {
                  ...msg,
                  content: accumulatedText,
                  isStreaming: false,
                }
              : msg
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        console.error('[Chat Error]:', err);
        const errMsg = err instanceof Error && err.message ? err.message : copy.unexpected;
        setError(errMsg);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? {
                  ...msg,
                  content: `⚠️ ${errMsg}`,
                  isStreaming: false,
                  error: true,
                }
              : msg
          )
        );
      } finally {
        isGeneratingRef.current = false;
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [locale]
  );

  const sendMessage = useCallback(
    async (userInput: string) => {
      const text = userInput.trim();
      if (!text || isGeneratingRef.current) return;
      await dispatchMessage(text, messagesRef.current);
    },
    [dispatchMessage]
  );

  const retryLastMessage = useCallback(async () => {
    if (isGeneratingRef.current) return;

    const current = messagesRef.current;
    const lastMessage = current[current.length - 1];
    if (!lastMessage || !lastMessage.error) return;

    let lastUserIndex = -1;
    for (let i = current.length - 2; i >= 0; i -= 1) {
      if (current[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const textToRetry = current[lastUserIndex].content.trim();
    if (!textToRetry) return;

    const baseMessages = current.slice(0, lastUserIndex);
    await dispatchMessage(textToRetry, baseMessages);
  }, [dispatchMessage]);

  return {
    messages,
    isGenerating,
    error,
    sendMessage,
    retryLastMessage,
    clearChat,
    stopGeneration,
  };
}
