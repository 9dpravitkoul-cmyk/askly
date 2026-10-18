import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeBanner({ totalSurveys = 0, activeSurveys = 0 }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-brand-border-gray p-6 sm:p-8 shadow-xs">
      {/* Decorative Network Pattern on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-network-pattern opacity-60 pointer-events-none -z-0" />
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-light-blue/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light-blue border border-brand-border-gray text-xs font-semibold text-brand-navy">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Workspace Active</span>
            <span className="text-brand-text-secondary">•</span>
            <span className="text-brand-text-secondary font-normal">{activeSurveys} active polls</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Create. Engage. Get Insights.
          </h1>

          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed font-normal">
            Build interactive surveys and polls to engage your audience in real time. Collect free-text word clouds, multiple choice responses, and instant statistics.
          </p>
        </div>

        {/* Prominent Navy Create Button */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <Link
            to="/surveys/new"
            className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 text-brand-orange group-hover:rotate-90 transition-transform duration-200" />
            <span>Create New Survey</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
