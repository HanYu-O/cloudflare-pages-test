import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Message } from '../../types';

interface MessageContentProps {
  message: Message;
  isLatest: boolean;
  isLoading: boolean;
}

export const MessageContent: React.FC<MessageContentProps> = ({ 
  message, 
  isLatest, 
  isLoading 
}) => {
  if (isLatest && isLoading && message.role === 'assistant') {
    return (
      <div className="message-content">
        <span>{message.content}</span>
        <span className="cursor"></span>
      </div>
    );
  }
  
  return (
    <div className="message-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
}; 