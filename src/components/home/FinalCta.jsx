import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="bg-primary py-16 text-white sm:py-20">
      <div className="page-shell text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready when the next audience is.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Create a host account, launch a session, and keep the QR on the projector. Participants never need to register.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup" className="ui-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white hover:bg-accent-strong">
            Create your host account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/join" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/10">
            Join a live session
          </Link>
        </div>
      </div>
    </section>
  );
}
