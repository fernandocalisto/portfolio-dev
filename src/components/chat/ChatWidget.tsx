import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Square,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatQuickChips } from './ChatQuickChips';
import { DobbyIcon } from './DobbyIcon';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showChips, setShowChips] = useState(true);

  const {
    messages,
    isGenerating,
    sendMessage,
    clearChat,
    stopGeneration,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Focus input field when widget opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    sendMessage(inputValue);
    setInputValue('');
  };

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

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
        {/* Subtle Pill on initial state when closed - visible on tablet/desktop, keeping mobile clean as 'a bolinha' */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-teal/60 text-slate-200 hover:text-white text-xs backdrop-blur-md shadow-2xl cursor-pointer hover:border-brand-teal transition-all group active:scale-95 touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse shrink-0" />
            <span className="font-medium">Pergunte ao Dobby 🧦</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Fechar chat com Dobby' : 'Abrir chat com Dobby'}
          aria-expanded={isOpen}
          className={`relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-brand-teal/80 touch-manipulation shrink-0 ${
            isOpen
              ? 'bg-brand-surface border border-brand-border text-slate-300 hover:text-white hover:bg-brand-card rotate-90'
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
              {/* Online pulse dot */}
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-brand-dark"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Window (Mobile First & Responsiveness) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dobby - Guia Oficial do Portfólio de Fernando Calisto"
          className="fixed inset-x-3 bottom-[4.75rem] sm:bottom-24 sm:inset-x-auto sm:right-6 w-auto sm:w-[420px] h-[calc(100dvh-6.5rem)] sm:h-[580px] max-h-[620px] z-[99998] flex flex-col bg-brand-dark/98 backdrop-blur-2xl border border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{
            position: 'fixed',
            bottom: 'max(76px, calc(70px + env(safe-area-inset-bottom, 0px)))',
            zIndex: 99998,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-surface/90 border-b border-brand-border select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-brand-surface border border-brand-teal/70 flex items-center justify-center p-1 text-brand-teal shadow-glow-teal/30">
                  <DobbyIcon className="w-full h-full text-brand-teal" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-brand-dark"></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Dobby
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
                    Elfo Guia
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online • Guia oficial do visitante
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset Conversation */}
              <button
                type="button"
                onClick={clearChat}
                title="Reiniciar conversa"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-brand-card transition-colors"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close / Minimize */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Fechar chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-brand-card transition-colors"
                aria-label="Fechar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            {messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}

            {/* Quick Suggestion Chips (visible when few messages or when toggled) */}
            {messages.length <= 2 && showChips && (
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
          <div className="p-3 bg-brand-surface/80 border-t border-brand-border">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pergunte ao Dobby sobre o Fernando, projetos, TALOS..."
                disabled={isGenerating}
                maxLength={500}
                className="flex-1 bg-brand-darkElevated border border-brand-border rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all disabled:opacity-60"
              />

              {isGenerating ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  title="Interromper geração"
                  className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors flex items-center justify-center shadow-sm"
                  aria-label="Interromper geração"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  title="Enviar mensagem"
                  className="p-2.5 rounded-xl bg-brand-teal hover:bg-brand-tealHover disabled:opacity-40 disabled:hover:bg-brand-teal text-white transition-colors flex items-center justify-center shadow-sm disabled:cursor-not-allowed"
                  aria-label="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono px-1">
              <span>Dobby • Guia Oficial</span>
              {messages.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowChips((prev) => !prev)}
                  className="text-brand-teal hover:underline"
                >
                  {showChips ? 'Ocultar sugestões' : 'Sugestões'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
