import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

export function Input({ className = '', ...props }: InputProps) {
  return <input className={`input input-bordered w-full ${className}`} {...props} />;
}

export default Input;
