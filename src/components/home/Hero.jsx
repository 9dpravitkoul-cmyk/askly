import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone } from 'lucide-react';
import SamplePollPreview from './SamplePollPreview';
import { useAuth } from '../../contexts/AuthContext';

export default function Hero() {
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isAnonymous);

  return (
    <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="page-shell grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-strong">Live audience polling</p>
          <h1 className="mt-4 text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-primary sm:text-5xl lg:text-[3.35rem]">
            Ask the room.<br className="hidden sm:block" /> See the answer live.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg lg:mx-0">
            Create a poll, share a QR code, and watch multiple-choice votes and word clouds update as people respond. No apps. No participant accounts.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to={signedIn ? '/surveys/new' : '/signup'}
              className="ui-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-strong"
            >
              {signedIn ? 'Create a survey' : 'Start hosting free'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/join"
              className="ui-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-primary hover:border-primary/30"
            >
              <Smartphone className="h-4 w-4 text-accent-strong" />
              Join with a code
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted">Hosts sign in once. Audiences scan and vote immediately.</p>
        </div>
        <div id="preview" className="mx-auto w-full max-w-[640px] lg:max-w-none scroll-mt-24">
          <SamplePollPreview />
        </div>
      </div>
    </section>
  );
}
