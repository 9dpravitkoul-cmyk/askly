import React from 'react';

export default function Skeleton({ className = '', circle = false, ...props }) {
  return <span aria-hidden="true" className={`block animate-pulse bg-slate-200/80 ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`} {...props} />;
}

export function SkeletonGroup({ label = 'Loading content', className = '', children }) {
  return <div role="status" aria-label={label} aria-busy="true" className={className}>{children}<span className="sr-only">{label}</span></div>;
}
