import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  interactive = false,
  selected = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-3xl p-6 transition-all duration-300
        border border-stone-100
        ${interactive ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
        ${selected ? 'ring-2 ring-primary ring-offset-2 shadow-xl' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};