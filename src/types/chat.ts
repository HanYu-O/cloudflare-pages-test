export enum ChatMode {
  CHAT = 'chat',
  CODE_REVIEW = 'codereview'
}

export interface ChatModeOption {
  mode: ChatMode;
  label: string;
  icon?: string; // 为将来可能添加的图标预留
} 