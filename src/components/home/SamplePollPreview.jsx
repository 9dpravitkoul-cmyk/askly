import React, { useState } from 'react';
import { BarChart3, Cloud } from 'lucide-react';

const options = [
  { id: 'ideas', label: 'Product ideas', width: 78 },
  { id: 'stories', label: 'Customer stories', width: 56 },
  { id: 'culture', label: 'Team culture', width: 34 },
];

export default function SamplePollPreview() {
  const [selected, setSelected] = useState('ideas');

  return (
    <div className="rounded-2xl border border-white/10 bg-primary p-4 text-white shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">
        <span>Live product demo</span>
        <span>Illustrative · not connected</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-xl bg-white text-left text-text shadow-sm">
          <header className="flex min-h-12 items-center justify-between gap-2 border-b border-border px-3.5">
            <span className="flex items-center gap-2 text-xs font-bold text-primary"><BarChart3 className="h-4 w-4 text-accent-strong" />Vote</span>
            <span className="rounded-md bg-orange-50 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-900">Sample</span>
          </header>
          <div className="p-3.5">
            <p className="text-[13px] font-semibold leading-5">What should we explore next?</p>
            <fieldset className="mt-3 space-y-2">
              <legend className="sr-only">Sample multiple choice</legend>
              {options.map((option) => (
                <label key={option.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[12px] ${selected === option.id ? 'border-primary bg-primary-soft' : 'border-border'}`}>
                  <input type="radio" name="sample-poll" className="accent-[var(--color-primary)]" checked={selected === option.id} onChange={() => setSelected(option.id)} />
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="mt-4 space-y-2">
              {options.map((option) => (
                <div key={`bar-${option.id}`}>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${selected === option.id ? 'bg-accent' : 'bg-primary/50'}`} style={{ width: `${option.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="min-w-0 overflow-hidden rounded-xl bg-white text-left text-text shadow-sm">
          <header className="flex min-h-12 items-center justify-between gap-2 border-b border-border px-3.5">
            <span className="flex items-center gap-2 text-xs font-bold text-primary"><Cloud className="h-4 w-4 text-accent-strong" />Word cloud</span>
            <span className="rounded-md bg-orange-50 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-900">Sample</span>
          </header>
          <div className="relative mx-3.5 my-3 h-[168px] overflow-hidden rounded-lg bg-background" aria-hidden="true">
            <span className="absolute left-[8%] top-[14%] text-[11px] font-medium text-muted">Curious</span>
            <span className="absolute left-[46%] top-[10%] text-[12px] font-semibold text-accent-strong">Ideas</span>
            <span className="absolute left-[16%] top-[38%] text-lg font-bold tracking-tight text-primary">Together</span>
            <span className="absolute left-[64%] top-[36%] text-[11px] font-medium text-muted">Listen</span>
            <span className="absolute left-[12%] top-[66%] text-[12px] font-semibold text-primary/80">Inspire</span>
            <span className="absolute left-[48%] top-[62%] text-xl font-bold tracking-tight text-primary">Voice</span>
            <span className="absolute left-[72%] top-[76%] text-[10px] font-medium text-accent-strong">Share</span>
          </div>
        </section>
      </div>
    </div>
  );
}
