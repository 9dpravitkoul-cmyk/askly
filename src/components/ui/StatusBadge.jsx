import React from 'react';

const styles = {
  live: 'bg-emerald-50 text-success',
  closed: 'bg-slate-100 text-slate-600',
  draft: 'bg-slate-100 text-slate-700',
  published: 'bg-primary-soft text-primary',
};

export default function StatusBadge({ status, children, className = '' }) {
  const key = status === 'active' ? 'live' : status;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles[key] || styles.draft} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-live' : 'bg-current opacity-60'}`} aria-hidden="true" />
      {children || (status === 'active' ? 'Live' : status === 'closed' ? 'Ended' : status)}
    </span>
  );
}
