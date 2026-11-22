import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import type { DobbyAction } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';
import { useChat } from '../../hooks/useChat';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatQuickChips } from './ChatQuickChips';
import { DobbyIcon } from './DobbyIcon';

const MAX_INPUT_LENGTH = 500;
const COUNTER_WARNING_THRESHOLD = 400;

export interface ChatWidgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  pendingPrompt?: { text: string; nonce: number } | null;
  onExecuteAction?: (action: DobbyAction) => void;
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen: controlledIsOpen,
  onOpenChange,
  pendingPrompt = null,
  onExecuteAction,
  onNotify,
}) => {
  const { locale, t } = useLocale();
  const [internalOpen, setInternalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [manualShowChips, setManualShowChips] = useState(false);
  const [chipsDismissed, setChipsDismissed] = useState(false);

  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const {
    messages,
    isGenerating,
    sendMessage,
    retryLastMessage,
    clearChat,
    stopGeneration,
  } = useChat(locale);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastProcessedNonceRef = useRef<number | null>(null);

  const areChipsVisible =
    (messages.length <= 2 && !chipsDismissed) || manualShowChips;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-scroll when conversation advances or chips are manually toggled
  useEffect(() => {
    if (isOpen && (messages.length > 1 || manualShowChips)) {
      scrollToBottom();
    }
  }, [messages, isOpen, manualShowChips, scrollToBottom]);

  // Focus textarea when widget opens
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Auto-expand textarea height up to 120px
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [inputValue, isOpen]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  // Trigger automatic prompt when pendingPrompt nonce changes
  useEffect(() => {
    if (!pendingPrompt) return;
    const promptText = pendingPrompt.text.trim();
    if (!promptText) return;
    if (lastProcessedNonceRef.current === pendingPrompt.nonce) return;

    lastProcessedNonceRef.current = pendingPrompt.nonce;
    setOpen(true);
    setManualShowChips(false);

    if (isGenerating) {
      stopGeneration();
    }
    void sendMessage(promptText);
  }, [pendingPrompt, isGenerating, setOpen, stopGeneration, sendMessage]);

  const submitCurrentInput = useCallback(() => {
    if (!inputValue.trim() || isGenerating) return;
    setManualShowChips(false);
    void sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, isGenerating, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCurrentInput();
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitCurrentInput();
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setManualShowChips(false);
    void sendMessage(prompt);
  };

  const handleResetChat = () => {
    clearChat();
    setManualShowChips(false);
    setChipsDismissed(false);
  };

  const handleToggleChips = () => {
    if (areChipsVisible) {
      setManualShowChips(false);
      setChipsDismissed(true);
    } else {
      setManualShowChips(true);
      setChipsDismissed(false);
    }
  };

  const handleExecuteAction = useCallback(
    (action: DobbyAction) => {
      if (
        typeof window !== 'undefined' &&
        window.innerWidth < 640 &&
        action.type !== 'lead_draft'
      ) {
        setOpen(false);
      }
      onExecuteAction?.(action);
    },
    [onExecuteAction, setOpen]
  );

  const showCharCounter = inputValue.length >= COUNTER_WARNING_THRESHOLD;

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] flex items-center gap-2 sm:gap-3 pointer-events-auto select-none"
        style={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          right: 'max(16px, env(safe-area-inset-right, 16px))',
          zIndex: 99999,
        }}
      >
        {!isOpen && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-tealLight/50 text-brand-ivory hover:text-white text-xs backdrop-blur-md shadow-2xl cursor-pointer hover:border-brand-tealLight transition-all group active:scale-95 touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse shrink-0" />
            <span className="font-medium">{t.chat.fabPill}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          aria-label={isOpen ? t.chat.closeAria : t.chat.openAria}
          aria-expanded={isOpen}
          className={`relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-brand-tealLight/80 touch-manipulation shrink-0 ${
            isOpen
              ? 'bg-brand-surface border border-brand-hairline text-brand-muted hover:text-brand-ivory hover:bg-brand-card rotate-90'
              : 'bg-gradient-to-tr from-brand-teal to-brand-tealHover text-white shadow-glow-teal hover:scale-105'
          }`}
          style={{
            width: '56px',
            height: '56px',
            minWidth: '56px',
            minHeight: '56px',
            borderRadius: '9999px',
          }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <DobbyIcon className="w-7 h-7 text-white" />
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-brand-obsidian" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.chat.dialogAria}
          className="fixed inset-x-3 bottom-[4.75rem] sm:bottom-24 sm:inset-x-auto sm:right-6 w-auto sm:w-[420px] h-[calc(100dvh-6.5rem)] sm:h-[580px] max-h-[620px] z-[99998] flex flex-col bg-brand-obsidian/98 backdrop-blur-2xl border border-brand-hairline rounded-2xl shadow-2xl overflow-hidden animate-chatEnter"
          style={{
            position: 'fixed',
            bottom: 'max(76px, calc(70px + env(safe-area-inset-bottom, 0px)))',
            zIndex: 99998,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-surface/95 border-b border-brand-hairline select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-brand-card border border-brand-tealLight/60 flex items-center justify-center p-1 text-brand-tealLight shadow-glow-teal/30">
                  <DobbyIcon className="w-full h-full text-brand-tealLight" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-brand-obsidian" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-ivory flex items-center gap-1.5">
                  Dobby
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-teal/25 text-brand-tealLight border border-brand-tealLight/30">
                    {t.chat.roleBadge}
                  </span>
                </h3>
                <p className="text-[11px] text-brand-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {t.chat.statusOnline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title={t.chat.resetTitle}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-ivory hover:bg-brand-card transition-colors"
                aria-label={t.chat.resetTitle}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                title={t.chat.minimizeTitle}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-ivory hover:bg-brand-card transition-colors"
                aria-label={t.chat.minimizeTitle}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 chat-scrollbar">
            {messages.map((msg, index) => {
              const isLatestError = index === messages.length - 1 && Boolean(msg.error);
              return (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onExecuteAction={handleExecuteAction}
                  onNotify={onNotify}
                  onRetry={isLatestError ? retryLastMessage : undefined}
                  canRetry={!isGenerating}
                />
              );
            })}

            {areChipsVisible && (
              <div className="mt-2">
                <ChatQuickChips
                  onSelect={handleSelectPrompt}
                  disabled={isGenerating}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Footer */}
          <div className="p-3 bg-brand-surface/90 border-t border-brand-hairline">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={t.chat.placeholder}
                  disabled={isGenerating}
                  maxLength={MAX_INPUT_LENGTH}
                  aria-label={t.chat.placeholder}
                  className="w-full resize-none bg-brand-obsidian/90 border border-brand-hairline rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-brand-ivory placeholder-brand-muted/70 focus:outline-none focus:border-brand-tealLight focus:ring-1 focus:ring-brand-tealLight transition-all disabled:opacity-60 leading-relaxed max-h-[120px] chat-scrollbar"
                />
              </div>

              {isGenerating ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  title={t.chat.stopAria}
                  className="p-2.5 rounded-xl bg-brand-crimson/85 hover:bg-brand-crimson text-white transition-colors flex items-center justify-center shadow-sm shrink-0"
                  aria-label={t.chat.stopAria}
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  title={t.chat.sendAria}
                  className="p-2.5 rounded-xl bg-brand-teal hover:bg-brand-tealHover disabled:opacity-40 disabled:hover:bg-brand-teal text-white transition-colors flex items-center justify-center shadow-sm disabled:cursor-not-allowed shrink-0"
                  aria-label={t.chat.sendAria}
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between gap-2 mt-2 text-[10px] text-brand-muted font-mono px-1">
              <span className="truncate">{t.chat.footerLabel}</span>
              <div className="flex items-center gap-2.5 shrink-0">
                {showCharCounter && (
                  <span
                    className={
                      inputValue.length >= 485
                        ? 'text-brand-crimson font-semibold'
                        : 'text-brand-gold'
                    }
                  >
                    {inputValue.length}/{MAX_INPUT_LENGTH}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleToggleChips}
                  className="text-brand-tealLight hover:underline cursor-pointer"
                >
                  {areChipsVisible ? t.chat.hideSuggestions : t.chat.showSuggestions}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
