'use client';

import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}