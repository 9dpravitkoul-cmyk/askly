import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function Logo({ size = 'md', className = '', showLink = true }) {
  const sizeClasses = {
    sm: 'gap-1.5 text-xl',
    md: 'gap-2 text-2xl',
    lg: 'gap-2.5 text-3xl',
    xl: 'gap-3 text-4xl',
  };

  const wordmark = (
    <span className={`inline-flex items-center font-extrabold leading-none tracking-[-0.06em] ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <MessageCircle aria-hidden="true" className="h-[0.88em] w-[0.88em] shrink-0 text-primary" strokeWidth={2.5} />
      <span className="text-text">ask<span className="text-primary">ly</span></span>
    </span>
  );

  if (!showLink) return wordmark;

  return (
    <Link
      to="/"
      className="inline-flex items-center rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Askly home"
    >
      {wordmark}
    </Link>
  );
}
