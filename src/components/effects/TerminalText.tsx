import React, { useState, useEffect } from 'react';

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  blinkCursor?: boolean;
}

const TerminalText: React.FC<TerminalTextProps> = ({
  text,
  speed = 50,
  className = '',
  onComplete,
  blinkCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={`font-mono ${className} ${blinkCursor && !isComplete ? 'terminal-text' : ''}`}>
      {displayedText}
    </span>
  );
};

export default TerminalText;