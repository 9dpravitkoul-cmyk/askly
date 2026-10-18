import React from 'react';

const variants = {
  primary: 'bg-primary text-white shadow-sm hover:bg-primary-hover hover:shadow-soft',
  secondary: 'border border-border bg-surface text-primary hover:bg-background',
  ghost: 'text-muted hover:bg-background hover:text-primary',
  danger: 'bg-danger text-white hover:bg-red-800',
};
const sizes = { sm: 'min-h-9 px-3 text-xs', md: 'min-h-11 px-4 text-sm', lg: 'min-h-12 px-5 text-sm' };

export default function Button({ variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', children, ...props }) {
  return <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={`ui-interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`} {...props}>
    {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />}
    {children}
  </button>;
}
