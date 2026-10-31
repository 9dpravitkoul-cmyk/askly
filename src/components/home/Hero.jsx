import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, CheckCircle2 } from 'lucide-react';
import SamplePollPreview from './SamplePollPreview';
import { useAuth } from '../../contexts/AuthContext';

export default function Hero() {
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isAnonymous);

  return (
    <section className="relative isolate overflow-hidden px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
      {/* Subtle background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-40 dark:opacity-20"
        />
      </div>

      <div className="page-shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="text-center lg:text-left">
            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-text sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
              Make Every Audience Interaction <span className="text-primary">Count.</span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
              Create live polls and interactive word clouds. Bring every voice into the conversation with simple, engaging audience activities.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row lg:justify-start">
              <Link
                to={signedIn ? '/surveys/new' : '/signup'}
                className="ui-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover"
              >
                {signedIn ? 'Create a Survey' : 'Start Hosting Free'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/join"
                className="ui-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-text hover:border-primary/40 hover:bg-surface-secondary shadow-xs"
              >
                <QrCode className="h-4 w-4 text-accent" />
                Join a Session
              </Link>
            </div>

            {/* Value propositions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted lg:justify-start">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Zero audience registration
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Instant QR code joining
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Clear, live response updates
              </span>
            </div>
          </div>

          {/* Interactive Poll Preview */}
          <div id="preview" className="mx-auto w-full max-w-[620px] lg:max-w-none scroll-mt-24">
            <SamplePollPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
