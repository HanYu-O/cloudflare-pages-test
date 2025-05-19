import React from 'react';
import Avatar from '../Avatar';

export const ThinkingIndicator: React.FC = () => {
  return (
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
  );
}; 