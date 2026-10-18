import React from 'react';

export default function Card({ as: Element = 'div', interactive = false, className = '', children, ...props }) {
  return <Element className={`rounded-card border border-border bg-surface shadow-soft ${interactive ? 'ui-interactive hover:-translate-y-0.5 hover:shadow-card' : ''} ${className}`} {...props}>{children}</Element>;
}
