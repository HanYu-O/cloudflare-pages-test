import React from 'react';

interface AvatarProps {
  type: 'user' | 'assistant';
}

const Avatar: React.FC<AvatarProps> = ({ type }) => {
  if (type === 'user') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d55ff" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19" stroke="url(#userGradient)" strokeWidth="2" fill="rgba(45, 85, 255, 0.1)" />
        <circle cx="20" cy="16" r="5" fill="url(#userGradient)" />
        <path
          d="M20 35C15.5 35 11.5 33 9 30C9.5 27 16.5 25 20 25C23.5 25 30.5 27 31 30C28.5 33 24.5 35 20 35Z"
          fill="url(#userGradient)"
        />
      </svg>
    );
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="assistantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#2d55ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="19" stroke="url(#assistantGradient)" strokeWidth="2" fill="rgba(0, 255, 136, 0.1)" />
      <path
        d="M20 10C14.5 10 10 14.5 10 20C10 25.5 14.5 30 20 30C25.5 30 30 25.5 30 20C30 14.5 25.5 10 20 10ZM20 12C21.7 12 23.2 12.5 24.5 13.4L13.4 24.5C12.5 23.2 12 21.7 12 20C12 15.6 15.6 12 20 12ZM20 28C18.3 28 16.8 27.5 15.5 26.6L26.6 15.5C27.5 16.8 28 18.3 28 20C28 24.4 24.4 28 20 28Z"
        fill="url(#assistantGradient)"
        filter="url(#glow)"
      />
    </svg>
  );
};

export default Avatar; 