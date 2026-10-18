import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone } from 'lucide-react';
import SamplePollPreview from './SamplePollPreview';

export default function Hero() {
  return <section className="relative isolate overflow-hidden bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-[4.5rem]">
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-8 -z-10 h-48 w-48 rounded-full border-[28px] border-orange-100/80 sm:right-[42%] sm:top-12 sm:h-24 sm:w-24 sm:border-[14px]" />
    <div className="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-strong"><span className="h-1.5 w-7 rounded-full bg-accent" />Interactive polling, made simple</div>
        <h1 className="mt-4 text-[2.65rem] font-bold leading-[1.07] tracking-[-0.04em] text-[#142E59] sm:text-5xl lg:text-[3.4rem]">Make every<br className="hidden lg:block" /> voice count<span className="text-accent-strong">.</span></h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg lg:mx-0">Bring your audience into the conversation. Collect ideas, run live polls, and see opinions take shape in real time.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
          <Link to="/surveys/new" className="ui-interactive group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover hover:shadow-soft">Create a Survey<span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-primary transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-3.5 w-3.5" /></span></Link>
          <Link to="/join" className="ui-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 text-sm font-semibold text-primary hover:border-primary/30 hover:bg-white"><Smartphone className="h-4 w-4 text-accent-strong" />Join a Session</Link>
        </div>
        <p className="mt-5 text-xs text-muted">No participant accounts required. Just share a code.</p>
      </div>
      <div className="mx-auto w-full max-w-[610px] lg:max-w-none"><SamplePollPreview /></div>
    </div>
  </section>;
}
