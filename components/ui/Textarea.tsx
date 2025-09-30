import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string };

export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea className={`textarea textarea-bordered w-full ${className}`} {...props} />;
}

export default Textarea;
