import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
  className?: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, highlight, className = '' }) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-100 text-yellow-800 font-semibold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightText;