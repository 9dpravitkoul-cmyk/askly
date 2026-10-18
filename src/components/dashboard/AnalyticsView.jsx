import React from 'react';
import { BarChart2, Users, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsView({ surveys = [] }) {
  const totalResponses = surveys.reduce((acc, s) => acc + s.responsesCount, 0);
  const activeCount = surveys.filter(s => s.status === 'active').length;
  const completedCount = surveys.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-border-gray pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Engagement Analytics</h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Historical overview of participant feedback and completion trends across all active rooms.
        </p>
      </div>

      {/* Restrained metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-brand-border-gray p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text-secondary">Total Responses Recorded</span>
            <Users className="w-4 h-4 text-brand-navy" />
          </div>
          <span className="text-3xl font-black text-brand-navy font-mono">{totalResponses}</span>
          <span className="block text-[11px] text-emerald-600 font-medium mt-1">Across {surveys.length} surveys</span>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border-gray p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text-secondary">Active Live Rooms</span>
            <TrendingUp className="w-4 h-4 text-brand-orange" />
          </div>
          <span className="text-3xl font-black text-brand-navy font-mono">{activeCount}</span>
          <span className="block text-[11px] text-brand-text-secondary mt-1">Currently ready to receive votes</span>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border-gray p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text-secondary">Completed Sessions</span>
            <CheckCircle className="w-4 h-4 text-brand-navy" />
          </div>
          <span className="text-3xl font-black text-brand-navy font-mono">{completedCount}</span>
          <span className="block text-[11px] text-brand-text-secondary mt-1">Archived survey results</span>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-xs">
        <h3 className="text-base font-bold text-brand-navy mb-4">Survey Response Distribution</h3>
        <div className="space-y-3">
          {surveys.map((s) => {
            const percent = totalResponses > 0 ? Math.round((s.responsesCount / totalResponses) * 100) : 0;
            return (
              <div key={s.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-navy">{s.title}</span>
                  <span className="font-mono text-brand-text-secondary">{s.responsesCount} responses ({percent}%)</span>
                </div>
                <div className="h-2 w-full bg-brand-light-gray rounded-full overflow-hidden border border-brand-border-gray">
                  <div className="h-full bg-brand-navy rounded-full" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
