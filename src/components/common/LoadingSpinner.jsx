import React from 'react';
import Logo from './Logo';

export default function LoadingSpinner({ message = 'Loading Askly workspace...' }) {
  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <Logo size="lg" showLink={false} />
        {/* Subtle spinning ring */}
        <div className="absolute -inset-4 border-2 border-brand-navy/10 border-t-brand-navy rounded-full animate-spin pointer-events-none" />
      </div>
      <p className="text-xs font-semibold text-brand-navy tracking-wide uppercase">
        {message}
      </p>
    </div>
  );
}
