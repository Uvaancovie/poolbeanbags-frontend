import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'ghost' | 'outline' | 'secondary' };

export function Button({ variant = 'default', className = '', children, ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none';
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-content hover:brightness-95',
    ghost: 'bg-transparent hover:bg-base-200',
    outline: 'border border-neutral bg-transparent',
    secondary: 'bg-secondary text-secondary-content',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
