import React, { useEffect } from 'react';

interface ChatInputProps {
  inputValue: string;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isLoading,
  textareaRef,
  onInputChange,
  onKeyPress,
  onSendMessage
}) => {
  // 监听输入值变化，调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      
      // 如果输入值为空（即发送后），重置高度为初始值
      if (!inputValue) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [inputValue, textareaRef]);

  return (
    <div className="input-container">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        placeholder="Type your message here..."
        disabled={isLoading}
        rows={1}
        style={{ minHeight: '24px', resize: 'none' }}
      />
      <button
        className="send-button"
        onClick={onSendMessage}
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}; 