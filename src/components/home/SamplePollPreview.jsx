import React from 'react';
import { BarChart3, Cloud, Sparkles } from 'lucide-react';

const options = [
  { label: 'Product ideas', width: '78%' },
  { label: 'Customer stories', width: '56%' },
  { label: 'Team culture', width: '34%' },
];

function PollSample() {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-white/70 bg-white text-left shadow-sm">
    <header className="flex min-h-12 items-center justify-between gap-2 border-b border-border px-3.5">
      <span className="flex items-center gap-2 text-xs font-bold text-primary"><BarChart3 className="h-4 w-4 text-accent-strong" />Multiple Choice</span>
      <span className="rounded-md bg-orange-50 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-900">Sample</span>
    </header>
    <div className="p-3.5">
      <p className="text-[13px] font-semibold leading-5 text-text">What should we explore next?</p>
      <div className="mt-4 space-y-3">{options.map((option, index) => <div key={option.label}>
        <div className="mb-1 flex items-center gap-2"><span className={`grid h-4 w-4 place-items-center rounded-full border ${index === 0 ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'}`}>{index === 0 && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span><span className="truncate text-[11px] text-slate-700">{option.label}</span></div>
        <div className="ml-6 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${index === 0 ? 'bg-accent' : 'bg-primary/55'}`} style={{ width: option.width }} /></div>
      </div>)}</div>
    </div>
  </section>;
}

function WordCloudSample() {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-white/70 bg-white text-left shadow-sm">
    <header className="flex min-h-12 items-center justify-between gap-2 border-b border-border px-3.5">
      <span className="flex items-center gap-2 text-xs font-bold text-primary"><Cloud className="h-4 w-4 text-accent-strong" />Word Cloud</span>
      <span className="rounded-md bg-orange-50 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-900">Sample</span>
    </header>
    <div className="relative mx-3.5 my-3 h-[148px] overflow-hidden rounded-lg bg-[#F7F8FA]" aria-label="Illustrative word cloud with sample words">
      <span className="absolute left-[8%] top-[13%] text-[11px] font-medium text-slate-600">Curious</span>
      <span className="absolute left-[47%] top-[9%] text-[12px] font-semibold text-accent-strong">Ideas</span>
      <span className="absolute left-[21%] top-[34%] text-lg font-bold tracking-tight text-primary">Together</span>
      <span className="absolute left-[66%] top-[34%] text-[11px] font-medium text-slate-600">Listen</span>
      <span className="absolute left-[13%] top-[65%] text-[12px] font-semibold text-primary/80">Inspire</span>
      <span className="absolute left-[52%] top-[60%] text-xl font-bold tracking-tight text-primary">Voice</span>
      <span className="absolute left-[73%] top-[76%] text-[10px] font-medium text-accent-strong">Share</span>
    </div>
  </section>;
}

export default function SamplePollPreview() {
  return <div className="relative rounded-2xl bg-[#142E59] p-3.5 shadow-card sm:p-4">
    <div className="mb-3 flex items-center justify-between gap-2 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100"><span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-accent" />Askly preview</span><span>Illustrative samples · not live</span></div>
    <div className="grid gap-3 sm:grid-cols-2"><PollSample /><WordCloudSample /></div>
    <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-blue-100"><span>Multiple choice + open-ended</span><span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /></div>
  </div>;
}
