import React from 'react';
import { BarChart2, FileQuestion, Radio } from 'lucide-react';

export default function AnalyticsView({ surveys = [], sessions = [] }) {
  const published = surveys.filter((survey) => survey.status === 'published').length;
  const live = sessions.filter((session) => session.status === 'active').length;
  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-primary">Overview</h2>
        <p className="mt-1 text-sm text-muted">Counts from your saved surveys and sessions. Open a results page to inspect votes.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm text-muted"><span>Surveys</span><BarChart2 className="h-4 w-4 text-primary" /></div>
          <strong className="mt-2 block text-3xl text-primary">{surveys.length}</strong>
          <p className="mt-1 text-xs text-muted">{published} published · {surveys.length - published} drafts</p>
        </div>
        <div className="rounded-card border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm text-muted"><span>Questions</span><FileQuestion className="h-4 w-4 text-accent-strong" /></div>
          <strong className="mt-2 block text-3xl text-primary">{surveys.reduce((count, survey) => count + (survey.questionCount || 0), 0)}</strong>
        </div>
        <div className="rounded-card border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm text-muted"><span>Live rooms</span><Radio className="h-4 w-4 text-live" /></div>
          <strong className="mt-2 block text-3xl text-primary">{live}</strong>
          <p className="mt-1 text-xs text-muted">{sessions.length} sessions total</p>
        </div>
      </div>
    </section>
  );
}
