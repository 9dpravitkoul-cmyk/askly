import React from 'react';
import { BarChart2, FileQuestion } from 'lucide-react';

export default function AnalyticsView({ surveys = [] }) {
  const published = surveys.filter((survey) => survey.status === 'published').length;
  const drafts = surveys.length - published;
  return <section className="space-y-6">
    <div className="border-b border-border pb-4"><h2 className="text-xl font-bold tracking-tight text-primary">Analytics</h2><p className="mt-1 text-sm text-muted">A clear overview of your survey library. Open a session’s results page to review audience responses.</p></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-card border border-border bg-white p-5 shadow-soft"><div className="flex items-center justify-between text-sm text-muted"><span>Surveys</span><BarChart2 className="h-4 w-4 text-primary" /></div><strong className="mt-2 block text-3xl text-primary">{surveys.length}</strong></div><div className="rounded-card border border-border bg-white p-5 shadow-soft"><div className="flex items-center justify-between text-sm text-muted"><span>Questions created</span><FileQuestion className="h-4 w-4 text-accent-strong" /></div><strong className="mt-2 block text-3xl text-primary">{surveys.reduce((count, survey) => count + (survey.questionCount || 0), 0)}</strong></div></div>
    <div className="rounded-card border border-border bg-white p-5 shadow-soft"><h3 className="font-bold text-primary">Status summary</h3><p className="mt-2 text-sm text-muted">{drafts} drafts · {published} published</p></div>
  </section>;
}
