import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

interface ChatQuickChipsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export const ChatQuickChips: React.FC<ChatQuickChipsProps> = ({
  onSelect,
  disabled = false,
}) => {
  const { t } = useLocale();

  return (
    <div className="py-2 px-1">
      <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-2 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
        <span>{t.chat.suggestionsHeading}:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {t.chat.quickPrompts.map((item, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            className="text-xs px-3 sm:px-2.5 py-2 sm:py-1.5 rounded-full bg-brand-card border border-brand-hairline text-brand-ivory/90 hover:text-white hover:border-brand-tealLight/70 hover:bg-brand-cardHover transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
