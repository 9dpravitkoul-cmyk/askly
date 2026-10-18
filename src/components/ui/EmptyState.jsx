import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return <section className={`flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-6 py-10 text-center ${className}`}>
    {Icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Icon aria-hidden="true" className="h-6 w-6" /></div>}
    <h3 className="text-base font-semibold tracking-tight text-text">{title}</h3>
    {description && <p className="mt-1.5 max-w-md text-sm leading-6 text-muted">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </section>;
}
