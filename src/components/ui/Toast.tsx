import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const { t } = useLocale();

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`fixed top-20 right-6 z-[100000] max-w-md flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md animate-slideUp ${
        type === 'success'
          ? 'bg-brand-card/95 border-brand-tealLight/65 text-brand-ivory shadow-[0_12px_32px_rgba(24,91,99,0.35)]'
          : 'bg-brand-card/95 border-brand-crimson/80 text-brand-ivory shadow-[0_12px_32px_rgba(209,67,56,0.35)]'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-brand-tealLight flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-[#F87171] flex-shrink-0" />
      )}
      <p className="text-sm font-sans leading-snug pr-2">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-md hover:bg-brand-hairline/70 text-brand-muted hover:text-brand-ivory transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
        aria-label={t.toast.closeAria}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
