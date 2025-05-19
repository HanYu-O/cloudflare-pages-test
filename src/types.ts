export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatResponse {
  text?: string;
  error?: string;
}

export enum ChatMode {
  CHAT = 'chat',
  CODE_REVIEW = 'codereview'
}

export interface ChatModeOption {
  mode: ChatMode;
  label: string;
  icon?: string;
} 