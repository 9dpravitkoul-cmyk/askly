import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Radio, Users, FileQuestion, Sparkles } from 'lucide-react';

export default function WelcomeBanner({
  displayName = '',
  totalSurveys = 0,
  activeSessions = 0,
  totalParticipants = 0,
}) {
  const firstName = displayName.trim().split(/\s+/)[0];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <section className="relative overflow-hidden rounded-card border border-border bg-surface p-6 sm:p-8 shadow-soft transition-colors duration-200">
        {/* Subtle decorative gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-semibold text-text">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Host Workspace</span>
              {activeSessions > 0 && (
                <>
                  <span className="text-muted">·</span>
                  <span className="text-emerald-500 font-bold">{activeSessions} live room active</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
              {firstName ? `Welcome back, ${firstName}` : 'Create. Engage. Get Insights.'}
            </h1>

            <p className="text-sm text-muted leading-relaxed max-w-xl font-normal">
              Build interactive polls, word clouds, and surveys to engage your audience in real time. Collect responses with sub-second synchronization.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/surveys/new"
              className="ui-interactive inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Session</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Restrained Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sessions */}
        <div className="rounded-card border border-border bg-surface p-5 shadow-soft transition-all hover:border-primary/30">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Total Sessions</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <FileQuestion className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-text font-mono">
            {totalSurveys}
          </p>
          <p className="mt-1 text-[11px] text-muted">Surveys in your workspace</p>
        </div>

        {/* Total Participants */}
        <div className="rounded-card border border-border bg-surface p-5 shadow-soft transition-all hover:border-primary/30">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Total Participants</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-text font-mono">
            {totalParticipants}
          </p>
          <p className="mt-1 text-[11px] text-muted">Audience respondents</p>
        </div>

        {/* Active Sessions */}
        <div className="rounded-card border border-border bg-surface p-5 shadow-soft transition-all hover:border-primary/30">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Active Sessions</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-text font-mono">
            {activeSessions}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {activeSessions > 0 ? 'Accepting live responses' : 'No rooms open'}
          </p>
        </div>
      </div>
    </div>
  );
}
