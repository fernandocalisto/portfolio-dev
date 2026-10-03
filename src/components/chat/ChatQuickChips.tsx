import React from 'react';
import { Sparkles } from 'lucide-react';

interface ChatQuickChipsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  { label: '🧦 Quem é você?', prompt: 'Quem é você?' },
  { label: '💼 TALOS & Soluções B2B', prompt: 'Me conte sobre os projetos e automações desenvolvidos na TALOS.' },
  { label: '🛠️ Stack & Arquitetura', prompt: 'Quais são as principais tecnologias e stacks do Fernando?' },
  { label: '🚀 DRAKON Code & Liderança', prompt: 'Como foi a atuação do Fernando como CEO da DRAKON Code?' },
  { label: '📫 Como contratar ou contatar?', prompt: 'Como posso entrar em contato ou contratar o Fernando?' },
];

export const ChatQuickChips: React.FC<ChatQuickChipsProps> = ({ onSelect, disabled = false }) => {
  return (
    <div className="py-2 px-1">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
        <span>Perguntas sugeridas:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((item, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            className="text-xs px-3 sm:px-2.5 py-2 sm:py-1.5 rounded-full bg-brand-surface border border-brand-border/80 text-slate-300 hover:text-white hover:border-brand-teal/80 hover:bg-brand-card transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
