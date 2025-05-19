import React from 'react';
import { Message } from '../../types';
import Avatar from '../Avatar';
import { MessageContent } from './MessageContent';

interface MessageRowProps {
  message: Message;
  isLatest: boolean;
  isLoading: boolean;
}

export const MessageRow: React.FC<MessageRowProps> = ({
  message,
  isLatest,
  isLoading
}) => {
  return (
    <div
      className={`message-row ${message.role === 'user' ? 'message-row-user' : 'message-row-assistant'}`}
    >
      <div className="avatar-container">
        <Avatar type={message.role} />
      </div>
      <div className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
        <MessageContent 
          message={message} 
          isLatest={isLatest}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}; 