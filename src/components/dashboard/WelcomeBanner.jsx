import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';

export default function WelcomeBanner({ displayName = '' }) {
  const firstName = displayName.trim().split(/\s+/)[0];
  return (
    <section className="flex flex-col gap-5 rounded-card border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div>
        <p className="text-sm font-medium text-muted">{firstName ? `Welcome back, ${firstName}` : 'Your workspace'}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">Host workspace</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Create a survey, launch a live room, and follow real responses as they come in.</p>
      </div>
      <Link to="/surveys/new" className="ui-interactive inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-strong">
        <Plus className="h-4 w-4" />Create survey<ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
