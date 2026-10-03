import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types/chat';

const STORAGE_KEY = 'fc_portfolio_chat_history_v2';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'model',
  content:
    'Olá! Dobby é o elfo doméstico e o guia oficial do site de **Fernando Calisto**! 🧦✨\n\nDobby tem a honra de apresentar os projetos do Fernando na **TALOS** e na **DRAKON Code**, suas competências em **Java Spring Boot**, **React** e **IA**, ou ajudar você a entrar em contato direto com ele.\n\nComo Dobby pode ajudar o ilustre visitante hoje?',
  timestamp: Date.now(),
};

export function useChat() {
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
    return [INITIAL_MESSAGE];
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    }
    setIsGenerating(false);
    setError(null);
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  }, []);

  const sendMessage = useCallback(
    async (userInput: string) => {
      const text = userInput.trim();
      if (!text || isGenerating) return;

      setError(null);

      const userMessageId = `user-${Date.now()}`;
      const modelMessageId = `model-${Date.now()}`;

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      const initialModelMessage: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      // Prepare history excluding the welcome banner and error messages
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-msg' && !m.error && m.content.trim() !== '')
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      setMessages((prev) => [...prev, userMessage, initialModelMessage]);
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
          }),
          signal: controller.signal,
        });

        // Handle HTTP error statuses
        if (!response.ok) {
          let errText = 'Não foi possível se comunicar com o assistente.';
          try {
            const errData = await response.json();
            if (errData.error) errText = errData.error;
          } catch {
            // Non-JSON error
          }
          throw new Error(errText);
        }

        // Handle SSE stream
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Falha ao inicializar o leitor de resposta.');
        }

        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;

            const jsonStr = trimmed.replace(/^data:\s*/, '');
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

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
            } catch (parseErr: any) {
              if (parseErr.message && !parseErr.message.includes('JSON')) {
                throw parseErr;
              }
            }
          }
        }

        // Finalize model message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? {
                  ...msg,
                  content: accumulatedText || 'Sem resposta disponível.',
                  isStreaming: false,
                }
              : msg
          )
        );
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Intentional cancellation by user
          return;
        }

        console.error('[Chat Error]:', err);
        const errMsg = err?.message || 'Ocorreu um erro inesperado ao conectar ao Gemini.';
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
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isGenerating]
  );

  return {
    messages,
    isGenerating,
    error,
    sendMessage,
    clearChat,
    stopGeneration,
  };
}
