import React from 'react';
import { User, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { ChatMessageContent } from './ChatMessageContent';
import { DobbyIcon } from './DobbyIcon';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex items-start gap-2.5 my-2.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar Redondo */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs select-none ${
          isUser
            ? 'bg-brand-teal text-white border border-brand-tealHover shadow-sm'
            : message.error
            ? 'bg-red-950/80 text-red-400 border border-red-800'
            : 'bg-brand-surface border border-brand-teal/50 text-brand-teal shadow-glow-teal/20 p-1'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : message.error ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <DobbyIcon className="w-full h-full text-brand-teal" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
          isUser
            ? 'bg-brand-teal text-white rounded-tr-sm'
            : message.error
            ? 'bg-red-950/50 border border-red-900/80 text-red-200 rounded-tl-sm'
            : 'bg-brand-surface/90 border border-brand-border text-slate-200 rounded-tl-sm backdrop-blur-sm'
        }`}
      >
        {/* Content */}
        <ChatMessageContent
          content={message.content}
          isStreaming={message.isStreaming}
        />

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-1.5 flex items-center gap-1 ${
            isUser ? 'text-teal-200/80 justify-end' : 'text-slate-500 justify-start'
          }`}
        >
          <span>{timeString}</span>
          {!isUser && !message.error && (
            <span className="text-[9px] text-slate-500">• Dobby</span>
          )}
        </div>
      </div>
    </div>
  );
};
