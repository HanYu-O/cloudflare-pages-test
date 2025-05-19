import React, { useState, useRef, useEffect } from 'react';
import { ChatMode, ChatModeOption } from '../../types/chat';
import './ModeSwitcher.css';

interface ModeSwitcherProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const modeOptions: ChatModeOption[] = [
  { mode: ChatMode.CHAT, label: '聊天模式', icon: '☰' },
  { mode: ChatMode.CODE_REVIEW, label: '代码审查', icon: '☰' },
];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onModeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCurrentModeLabel = () => {
    return modeOptions.find(option => option.mode === currentMode)?.label || '选择模式';
  };

  return (
    <div className="mode-switcher" ref={menuRef}>
      <button
        className="mode-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={getCurrentModeLabel()}
      >
        <span className="menu-icon">☰</span>
      </button>
      
      {isOpen && (
        <div className="mode-switcher-menu">
          {modeOptions.map((option) => (
            <button
              key={option.mode}
              className={`mode-option ${currentMode === option.mode ? 'active' : ''}`}
              onClick={() => {
                onModeChange(option.mode);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 