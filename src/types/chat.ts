export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatPart {
  text: string;
}

export interface ChatHistoryItem {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatHistoryItem[];
}

export interface ChatStreamChunk {
  text?: string;
  error?: string;
  done?: boolean;
}
