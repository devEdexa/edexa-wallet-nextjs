'use client';

import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'rounded-full font-medium focus:outline-none transition-all';
  
  const variantStyles = {
    primary: 'bg-blue-700 text-white shadow-lg',
    secondary: 'bg-yellow-500 text-blue-900 hover:bg-yellow-400',
    outline: 'bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-700/10',
  };
  
  const sizeStyles = {
    sm: 'text-sm py-1 px-4',
    md: 'text-base py-2 px-6',
    lg: 'text-lg py-3 px-8',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}