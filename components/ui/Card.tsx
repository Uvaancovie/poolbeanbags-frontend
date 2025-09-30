import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card bg-base-100 shadow-sm ${className}`}>{children}</div>;
}

export default Card;
