import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { sanitizeSafeUrl } from '../../../shared/security';
import { useLocale } from '../../context/LocaleContext';

interface ChatMessageContentProps {
  content: string;
  isStreaming?: boolean;
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({
  content,
  isStreaming = false,
}) => {
  // If empty and currently streaming, render typing indicator dots
  if (!content && isStreaming) {
    return (
      <div className="flex items-center space-x-1.5 py-1">
        <span className="w-2 h-2 rounded-full bg-brand-tealLight animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-brand-tealLight animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-brand-tealLight animate-bounce" />
      </div>
    );
  }

  // Split into code blocks vs text blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm leading-relaxed space-y-2 select-text break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
          const lang = match ? match[1] || 'code' : 'code';
          const code = match ? match[2] : part.slice(3, -3);

          return <CodeBlock key={index} code={code.trim()} language={lang} />;
        }

        return <TextBlock key={index} text={part} />;
      })}

      {isStreaming && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-brand-tealLight align-middle animate-pulse" />
      )}
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    if (!navigator.clipboard?.writeText) return;
    void navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Ignore clipboard permission errors
      });
  };

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-brand-hairline bg-brand-obsidian/95 text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-brand-surface border-b border-brand-hairline text-brand-muted">
        <span className="font-mono text-[11px] uppercase tracking-wider text-brand-tealLight">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-brand-ivory transition-colors py-0.5 px-1.5 rounded"
          title={t.chat.copyReply}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400">{t.chat.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">{t.chat.copyReply}</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-brand-ivory/90 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const TextBlock: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={i} className="h-1.5" />;
        }

        // Unordered list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="text-brand-tealLight mt-1 font-bold text-xs">•</span>
              <div className="flex-1">{renderFormattedInline(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Numbered list item
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="text-brand-gold font-mono text-xs mt-0.5">
                {numberedMatch[1]}.
              </span>
              <div className="flex-1">{renderFormattedInline(numberedMatch[2])}</div>
            </div>
          );
        }

        // Regular paragraph line
        return (
          <p key={i} className="my-0.5">
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </>
  );
};

function renderFormattedInline(str: string): React.ReactNode[] {
  // Regex to match inline code (`...`), bold (**...**), and markdown links ([...](...))
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = str.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="font-mono text-xs bg-brand-obsidian px-1.5 py-0.5 rounded text-brand-tealLight border border-brand-hairline mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold text: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Markdown Link: [label](url) — strictly sanitized against javascript:/data: XSS
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const safeHref = sanitizeSafeUrl(linkMatch[2]);

      if (!safeHref) {
        return <span key={index}>{label}</span>;
      }

      return (
        <a
          key={index}
          href={safeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-tealLight hover:text-brand-ivory underline decoration-brand-tealLight/50 hover:decoration-brand-tealLight transition-colors font-medium inline-flex items-center gap-0.5"
        >
          {label}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
