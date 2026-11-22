import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  User,
} from 'lucide-react';
import { parseDobbyMessage } from '../../../shared/dobbyActions';
import { PROJECTS } from '../../../shared/portfolioData';
import type { DobbyAction, LeadDraft } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';
import type { ChatMessage } from '../../types/chat';
import { ChatMessageContent } from './ChatMessageContent';
import { DobbyIcon } from './DobbyIcon';

export interface ChatMessageItemProps {
  message: ChatMessage;
  onExecuteAction?: (action: DobbyAction) => void;
  onNotify?: (message: string, type: 'success' | 'error') => void;
  onRetry?: () => void;
  canRetry?: boolean;
}

type LeadSubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

const LeadConfirmationCard: React.FC<{
  draft: LeadDraft;
  onNotify?: (message: string, type: 'success' | 'error') => void;
}> = ({ draft, onNotify }) => {
  const { t } = useLocale();
  const [status, setStatus] = useState<LeadSubmitStatus>('idle');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const handleConfirmSend = async () => {
    if (status === 'sending' || status === 'sent') return;

    setStatus('sending');
    setErrorDetail(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          subject: draft.subject,
          message: draft.message,
          source: 'dobby_chat',
          website: '',
        }),
      });

      if (!response.ok) {
        let serverError = t.chat.leadErrorLabel;
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) serverError = data.error;
        } catch {
          // Ignore non-JSON body
        }
        throw new Error(serverError);
      }

      setStatus('sent');
      onNotify?.(t.chat.leadSentLabel, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message ? err.message : t.chat.leadErrorLabel;
      setStatus('error');
      setErrorDetail(msg);
      onNotify?.(msg, 'error');
    }
  };

  return (
    <div className="mt-2.5 rounded-xl border border-brand-gold/40 bg-brand-obsidian/90 p-3 text-xs space-y-2.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-brand-gold font-medium">
        <Mail className="w-3.5 h-3.5 shrink-0" />
        <span>{t.chat.leadCardTitle}</span>
      </div>

      <dl className="space-y-1.5 text-[11px] border-t border-brand-hairline pt-2">
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <dt className="text-brand-muted font-mono shrink-0 sm:w-16">{t.chat.leadNameLabel}:</dt>
          <dd className="text-brand-ivory break-words">{draft.name}</dd>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <dt className="text-brand-muted font-mono shrink-0 sm:w-16">{t.chat.leadEmailLabel}:</dt>
          <dd className="text-brand-ivory break-all">{draft.email}</dd>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <dt className="text-brand-muted font-mono shrink-0 sm:w-16">
            {t.chat.leadSubjectLabel}:
          </dt>
          <dd className="text-brand-tealLight font-medium">
            {t.contact.subjects[draft.subject]}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 pt-0.5">
          <dt className="text-brand-muted font-mono">{t.chat.leadMessageLabel}:</dt>
          <dd className="text-brand-ivory/90 bg-brand-surface/80 border border-brand-hairline rounded-lg p-2 whitespace-pre-wrap break-words leading-relaxed">
            {draft.message}
          </dd>
        </div>
      </dl>

      {status === 'sent' ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 px-2.5 py-2 text-emerald-300 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{t.chat.leadSentLabel}</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {status === 'error' && (
            <p className="text-[11px] text-red-300 bg-brand-crimson/15 border border-brand-crimson/40 rounded-lg px-2.5 py-1.5">
              {errorDetail || t.chat.leadErrorLabel}
            </p>
          )}
          <button
            type="button"
            disabled={status === 'sending'}
            onClick={handleConfirmSend}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-brand-copper hover:bg-brand-copper/90 disabled:opacity-60 text-white font-medium px-3 py-2 transition-colors active:scale-[0.99] cursor-pointer disabled:cursor-wait"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.chat.leadSendingButton}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{t.chat.leadConfirmButton}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onExecuteAction,
  onNotify,
  onRetry,
  canRetry = true,
}) => {
  const { t } = useLocale();
  const isUser = message.role === 'user';
  const [copiedReply, setCopiedReply] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const parsed = useMemo(() => {
    if (isUser || message.error) {
      return { visibleText: message.content, actions: [] as DobbyAction[] };
    }
    return parseDobbyMessage(message.content);
  }, [isUser, message.content, message.error]);

  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const navActions = parsed.actions.filter(
    (action): action is Extract<DobbyAction, { type: 'open_project' | 'scroll' }> =>
      action.type === 'open_project' || action.type === 'scroll'
  );

  const leadActions = parsed.actions.filter(
    (action): action is Extract<DobbyAction, { type: 'lead_draft' }> =>
      action.type === 'lead_draft'
  );

  const handleCopyReply = () => {
    if (!parsed.visibleText || !navigator.clipboard?.writeText) return;
    void navigator.clipboard
      .writeText(parsed.visibleText)
      .then(() => {
        setCopiedReply(true);
        if (copyTimerRef.current !== null) {
          window.clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = window.setTimeout(() => setCopiedReply(false), 2000);
      })
      .catch(() => {
        // Ignore clipboard errors
      });
  };

  return (
    <div
      className={`flex items-start gap-2.5 my-2.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs select-none ${
          isUser
            ? 'bg-brand-teal text-white border border-brand-tealLight/50 shadow-sm'
            : message.error
            ? 'bg-red-950/80 text-red-300 border border-brand-crimson/70'
            : 'bg-brand-surface border border-brand-tealLight/50 text-brand-tealLight shadow-glow-teal/20 p-1'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : message.error ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <DobbyIcon className="w-full h-full text-brand-tealLight" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
          isUser
            ? 'bg-brand-teal text-brand-ivory rounded-tr-sm border border-brand-tealLight/20'
            : message.error
            ? 'bg-red-950/50 border border-brand-crimson/70 text-red-200 rounded-tl-sm'
            : 'bg-brand-surface/95 border border-brand-hairline text-brand-ivory/95 rounded-tl-sm backdrop-blur-sm'
        }`}
      >
        {/* Main text content */}
        <ChatMessageContent
          content={parsed.visibleText}
          isStreaming={message.isStreaming}
        />

        {/* Interactive navigation / project actions */}
        {!isUser && !message.error && navActions.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-brand-hairline/80 flex flex-wrap gap-1.5">
            {navActions.map((action, idx) => {
              if (action.type === 'open_project') {
                const project = PROJECTS.find((p) => p.id === action.projectId);
                const label = t.chat.openProjectAction(
                  project ? project.shortName : action.projectId
                );
                return (
                  <button
                    key={`open-${action.projectId}-${idx}`}
                    type="button"
                    onClick={() => onExecuteAction?.(action)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-tealLight/40 hover:border-brand-tealLight px-2.5 py-1.5 text-[11px] font-medium text-brand-ivory transition-colors active:scale-95"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: project?.badgeTextColor || '#38B2AC' }}
                    />
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-brand-tealLight shrink-0" />
                  </button>
                );
              }

              const sectionLabel = t.nav.links[action.sectionId];
              return (
                <button
                  key={`scroll-${action.sectionId}-${idx}`}
                  type="button"
                  onClick={() => onExecuteAction?.(action)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-hairline hover:border-brand-gold/70 px-2.5 py-1.5 text-[11px] font-medium text-brand-ivory transition-colors active:scale-95"
                >
                  <span>{t.chat.scrollAction(sectionLabel)}</span>
                  <ArrowDownRight className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {/* Lead Confirmation Cards (require explicit human click) */}
        {!isUser && !message.error && leadActions.length > 0 && (
          <div className="space-y-2">
            {leadActions.map((action, idx) => (
              <LeadConfirmationCard
                key={`lead-${action.draft.email}-${idx}`}
                draft={action.draft}
                onNotify={onNotify}
              />
            ))}
          </div>
        )}

        {/* Retry button on error messages */}
        {!isUser && message.error && onRetry && (
          <div className="mt-2 pt-2 border-t border-brand-crimson/40">
            <button
              type="button"
              disabled={!canRetry}
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-crimson/25 hover:bg-brand-crimson/40 disabled:opacity-50 border border-brand-crimson/60 px-2.5 py-1.5 text-[11px] font-medium text-red-100 transition-colors active:scale-95 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.chat.retry}</span>
            </button>
          </div>
        )}

        {/* Footer row: timestamp + copy action on assistant replies */}
        <div
          className={`text-[10px] mt-1.5 flex items-center gap-2 ${
            isUser
              ? 'text-teal-100/80 justify-end'
              : 'text-brand-muted justify-between'
          }`}
        >
          <div className="flex items-center gap-1 font-mono">
            <span>{timeString}</span>
            {!isUser && !message.error && (
              <span className="text-[9px] text-brand-muted/80">• Dobby</span>
            )}
          </div>

          {!isUser && !message.error && !message.isStreaming && parsed.visibleText.length > 0 && (
            <button
              type="button"
              onClick={handleCopyReply}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-brand-muted hover:text-brand-ivory hover:bg-brand-card transition-colors"
              aria-label={t.chat.copyReply}
              title={t.chat.copyReply}
            >
              {copiedReply ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{t.chat.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{t.chat.copyReply}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
