import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

const styles = {
  success: { Icon: CheckCircle2, color: 'text-success', bg: 'bg-emerald-500/10' },
  error: { Icon: AlertCircle, color: 'text-danger', bg: 'bg-red-500/10' },
  warning: { Icon: AlertTriangle, color: 'text-warning', bg: 'bg-amber-500/10' },
  info: { Icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
};

export default function Toast({
  message,
  title,
  variant = 'info',
  onDismiss,
  duration = 5000,
  action,
  className = '',
}) {
  useEffect(() => {
    if (!duration || !onDismiss) return undefined;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  const { Icon, color, bg } = styles[variant] || styles.info;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={`flex w-full items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card ${className}`}
    >
      <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-bold text-text">{title}</p>}
        <p className="text-xs leading-5 text-muted mt-0.5">{message}</p>
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="rounded-lg p-1 text-muted hover:bg-surface-secondary hover:text-text transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
