import React from 'react';

export default function Textarea({ label, id, hint, error, maxLength, value, className = '', rows = 4, ...props }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div className="w-full">
    {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">{label}</label>}
    <textarea id={id} rows={rows} value={value} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`ui-field min-h-28 resize-y ${error ? 'border-danger focus:border-danger' : ''} ${className}`} {...props} />
    <div className="mt-1 flex min-h-4 items-start justify-between gap-3 text-xs">
      <span id={hint ? `${id}-hint` : undefined} className={error ? 'text-danger' : 'text-muted'}>{error || hint || ''}</span>
      {Number.isInteger(maxLength) && <span className="shrink-0 text-muted">{String(value ?? '').length}/{maxLength}</span>}
    </div>
    {error && <span id={`${id}-error`} className="sr-only">{error}</span>}
  </div>;
}
