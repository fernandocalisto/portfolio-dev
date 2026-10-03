import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slideUp ${
        type === 'success'
          ? 'bg-brand-card/95 border-brand-teal/80 text-slate-100 shadow-[0_0_20px_rgba(24,91,99,0.3)]'
          : 'bg-brand-card/95 border-brand-crimson/80 text-slate-100 shadow-[0_0_20px_rgba(192,38,28,0.3)]'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-brand-crimson flex-shrink-0" />
      )}
      <p className="text-sm font-sans pr-2">{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
