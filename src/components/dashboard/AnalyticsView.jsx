import React from 'react';
import { BarChart2, FileQuestion, Radio, Users } from 'lucide-react';

export default function AnalyticsView({ surveys = [], sessions = [] }) {
  const published = surveys.filter((survey) => survey.status === 'published').length;
  const live = sessions.filter((session) => session.status === 'active').length;
  const totalQuestions = surveys.reduce((count, survey) => count + (survey.questionCount || 0), 0);

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-text">Workspace Analytics</h2>
        <p className="mt-1 text-xs text-muted">
          Aggregated statistics from your surveys and live engagement sessions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Total Surveys</span>
            <BarChart2 className="h-4 w-4 text-primary" />
          </div>
          <strong className="mt-2 block text-3xl font-extrabold text-text tabular-nums">{surveys.length}</strong>
          <p className="mt-1 text-xs text-muted">{published} published · {surveys.length - published} drafts</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Survey Questions</span>
            <FileQuestion className="h-4 w-4 text-secondary" />
          </div>
          <strong className="mt-2 block text-3xl font-extrabold text-text tabular-nums">{totalQuestions}</strong>
          <p className="mt-1 text-xs text-muted">Across all multiple choice & word clouds</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Live Control Rooms</span>
            <Radio className="h-4 w-4 text-live" />
          </div>
          <strong className="mt-2 block text-3xl font-extrabold text-text tabular-nums">{live}</strong>
          <p className="mt-1 text-xs text-muted">{sessions.length} total sessions created</p>
        </div>
      </div>
    </section>
  );
}
