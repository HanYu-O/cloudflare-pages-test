import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatMode } from '../../types';
import { sendChatMessage, sendCodeReviewMessage } from '../../api';
import { MessageRow } from './MessageRow';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChatInput } from './ChatInput';
import { ModeSwitcher } from './ModeSwitcher';
import { processChatStreamData, processCodeReviewStreamData, sleep } from './utils';
import '../../styles/Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentMode, setCurrentMode] = useState<ChatMode>(ChatMode.CHAT);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      textareaRef.current?.focus();
    }
  }, [isLoading, messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      const response = currentMode === ChatMode.CHAT
        ? await sendChatMessage(userMessage.content)
        : await sendCodeReviewMessage(userMessage.content);
        
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: Date.now(),
      };

      setIsThinking(false);
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        try {
          const processedText = currentMode === ChatMode.CHAT
            ? processChatStreamData(chunk)
            : processCodeReviewStreamData(chunk);
            
          if (processedText) {
            for (const char of processedText) {
              assistantMessage.content += char;
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: assistantMessage.content }
                    : msg
                )
              );
              await sleep(30);
            }
          }
        } catch (err) {
          const error = err as Error;
          console.error('Failed to parse chunk:', error);
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error('Request failed:', error);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleModeChange = (mode: ChatMode) => {
    setCurrentMode(mode);
    setMessages([]);
  };

  const getModeTitle = () => {
    switch (currentMode) {
      case ChatMode.CHAT:
        return '聊天模式';
      case ChatMode.CODE_REVIEW:
        return '代码审查';
      default:
        return '聊天';
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-title-bar">
        <div className="title-left">
          <ModeSwitcher
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />
          <span className="mode-title">{getModeTitle()}</span>
        </div>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <MessageRow
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
            isLoading={isLoading}
          />
        ))}
        {isThinking && <ThinkingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        inputValue={inputValue}
        isLoading={isLoading}
        textareaRef={textareaRef}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat; 