import React, { useEffect } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const styles = {
  success: { Icon: CheckCircle2, color: 'text-success' },
  error: { Icon: TriangleAlert, color: 'text-danger' },
  warning: { Icon: TriangleAlert, color: 'text-warning' },
  info: { Icon: Info, color: 'text-primary' },
};

export default function Toast({ message, title, variant = 'info', onDismiss, duration = 5000, action, className = '' }) {
  useEffect(() => {
    if (!duration || !onDismiss) return undefined;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);
  const { Icon, color } = styles[variant] || styles.info;
  return <div role={variant === 'error' ? 'alert' : 'status'} aria-live={variant === 'error' ? 'assertive' : 'polite'} className={`flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card ${className}`}>
    <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
    <div className="min-w-0 flex-1">{title && <p className="text-sm font-semibold text-text">{title}</p>}<p className="text-sm text-muted">{message}</p>{action && <div className="mt-2">{action}</div>}</div>
    {onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="rounded-lg p-1 text-muted hover:bg-background hover:text-text"><X className="h-4 w-4" /></button>}
  </div>;
}
