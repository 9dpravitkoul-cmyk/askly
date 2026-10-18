import React from 'react';

const variants = {
  neutral: 'bg-slate-100 text-slate-700',
  primary: 'bg-blue-50 text-primary',
  accent: 'bg-orange-50 text-amber-800',
  success: 'bg-emerald-50 text-success',
  warning: 'bg-amber-50 text-warning',
  danger: 'bg-red-50 text-danger',
};

export default function Badge({ variant = 'neutral', className = '', children, ...props }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant] || variants.neutral} ${className}`} {...props}>{children}</span>;
}
