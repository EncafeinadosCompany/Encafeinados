import React from 'react';

interface TextProps {
  variant: 'h1' | 'h2' | 'h3' | 'p' | 'small';
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ variant, children, className = '' }: TextProps) => {
  switch (variant) {
    case 'h1':
      return <h1 className={`text-4xl md:text-5xl font-bold ${className}`}>{children}</h1>;
    case 'h2':
      return <h2 className={`text-3xl md:text-4xl font-semibold ${className}`}>{children}</h2>;
    case 'h3':
      return <h3 className={`text-2xl md:text-3xl font-medium ${className}`}>{children}</h3>;
    case 'p':
      return <p className={`text-base md:text-lg ${className}`}>{children}</p>;
    case 'small':
      return <p className={`text-sm ${className}`}>{children}</p>;
    default:
      return <p className={`text-base ${className}`}>{children}</p>;
  }
};
