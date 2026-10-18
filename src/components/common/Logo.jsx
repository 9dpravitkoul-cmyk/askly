import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', className = '', showLink = true }) {
  // Dimension presets tailored to 1024x558 (~1.83:1) aspect ratio
  const sizeClasses = {
    sm: 'h-8 max-w-[120px]',
    md: 'h-10 max-w-[150px]',
    lg: 'h-14 max-w-[210px]',
    xl: 'h-20 max-w-[300px]'
  };

  const imageElement = (
    <img
      src="/askly-logo.png"
      alt="Askly — Smart Polling, Real Insights"
      className={`${sizeClasses[size] || sizeClasses.md} object-contain transition-transform duration-200 hover:opacity-95 ${className}`}
      loading="eager"
    />
  );

  if (!showLink) {
    return imageElement;
  }

  return (
    <Link to="/" className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-brand-navy rounded-lg p-0.5" aria-label="Askly Home">
      {imageElement}
    </Link>
  );
}
