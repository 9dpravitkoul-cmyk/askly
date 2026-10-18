import React, { useEffect, useId, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, title, description, children, footer, className = '', closeOnBackdrop = true, labelledBy, describedBy }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusables = dialog?.querySelectorAll(FOCUSABLE);
    (focusables?.[0] || dialog)?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose?.(); }
      if (event.key === 'Tab' && dialog) {
        const candidates = [...dialog.querySelectorAll(FOCUSABLE)].filter((item) => item.offsetParent !== null);
        if (!candidates.length) { event.preventDefault(); dialog.focus(); return; }
        const first = candidates[0]; const last = candidates[candidates.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (closeOnBackdrop && event.target === event.currentTarget) onClose?.(); }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy || titleId} aria-describedby={describedBy || (description ? descriptionId : undefined)} tabIndex={-1} className={`max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface shadow-2xl sm:max-w-xl sm:rounded-card ${className}`}>
      {(title || description) && <header className="border-b border-border px-5 py-4 sm:px-6"><h2 id={titleId} className="text-lg font-bold tracking-tight text-primary">{title}</h2>{description && <p id={descriptionId} className="mt-1 text-sm text-muted">{description}</p>}</header>}
      <div className="p-5 sm:p-6">{children}</div>
      {footer && <footer className="border-t border-border bg-background/70 px-5 py-4 sm:px-6">{footer}</footer>}
    </section>
  </div>;
}
