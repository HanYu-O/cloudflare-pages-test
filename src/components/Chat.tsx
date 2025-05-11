import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import Avatar from './Avatar';
import '../styles/Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // 在消息加载完成后自动聚焦输入框
  useEffect(() => {
    if (!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      textareaRef.current?.focus();
    }
  }, [isLoading, messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // 自动调整文本框高度
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const processStreamData = (text: string): string => {
    try {
      const lines = text.split('\n');
      let result = '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              result += data.text;
            }
          } catch (err) {
            console.error('Error parsing line:', err);
          }
        }
      }
      return result;
    } catch (err) {
      console.error('Error processing stream data:', err);
      return '';
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Chat($message: String!) {
              chat(message: $message) {
                text
              }
            }
          `,
          variables: {
            message: userMessage.content
          }
        })
      });

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
          const data = JSON.parse(chunk);
          if (data.data?.chat?.text) {
            const processedText = processStreamData(data.data.chat.text);
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
                await sleep(100);
              }
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

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row ${message.role === 'user' ? 'message-row-user' : 'message-row-assistant'}`}
          >
            <div className="avatar-container">
              <Avatar type={message.role} />
            </div>
            <div className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              <div className="message-content">
                {message.content}
                {message.role === 'assistant' && isLoading && message.id === messages[messages.length - 1]?.id && (
                  <span className="cursor"></span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="message-row message-row-assistant">
            <div className="avatar-container">
              <Avatar type="assistant" />
            </div>
            <div className="thinking">
              <div className="thinking-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={isLoading}
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat; 