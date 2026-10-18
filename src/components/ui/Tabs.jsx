import React, { useId, useRef, useState } from 'react';

export default function Tabs({ items = [], value, defaultValue, onChange, label = 'Sections', className = '' }) {
  const generatedId = useId();
  const refs = useRef([]);
  const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value);
  const selectedValue = value ?? internalValue;
  const selectedItem = items.find((item) => item.value === selectedValue) || items[0];
  const select = (item) => {
    if (item.disabled) return;
    if (value === undefined) setInternalValue(item.value);
    onChange?.(item.value);
  };
  const onKeyDown = (event, index) => {
    const enabled = items.map((item, itemIndex) => item.disabled ? -1 : itemIndex).filter((itemIndex) => itemIndex >= 0);
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !enabled.length) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = enabled[0];
    else if (event.key === 'End') next = enabled[enabled.length - 1];
    else {
      const at = enabled.indexOf(index);
      next = enabled[(at + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    }
    refs.current[next]?.focus(); select(items[next]);
  };
  const panelId = `${generatedId}-panel`;
  return <div className={className}>
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
      {items.map((item, index) => <button key={item.value} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`${generatedId}-tab-${index}`} aria-controls={panelId} aria-selected={item.value === selectedItem?.value} tabIndex={item.value === selectedItem?.value ? 0 : -1} disabled={item.disabled} onClick={() => select(item)} onKeyDown={(event) => onKeyDown(event, index)} className={`relative min-h-11 shrink-0 px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-transform ${item.value === selectedItem?.value ? 'text-primary after:scale-x-100 after:bg-accent' : 'text-muted after:scale-x-0 after:bg-transparent hover:text-primary'} disabled:opacity-40`}>{item.label}</button>)}
    </div>
    {selectedItem && <div id={panelId} role="tabpanel" aria-labelledby={`${generatedId}-tab-${items.indexOf(selectedItem)}`} tabIndex={0} className="pt-4">{selectedItem.content}</div>}
  </div>;
}
