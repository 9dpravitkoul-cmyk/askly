import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layers, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

export default function QuickActions({ onSelectTemplate, onSelectAnalytics }) {
  const actions = [
    {
      id: 'create',
      title: 'Create New Survey',
      description: 'Start from scratch with interactive Multiple Choice polls or Dynamic Word Clouds.',
      icon: Plus,
      isPrimary: true,
      to: '/surveys/new',
      badge: 'Quick start',
    },
    {
      id: 'template',
      title: 'Use Template',
      description: 'Choose pre-built templates for lectures, icebreakers, workshops, or team all-hands.',
      icon: Layers,
      isPrimary: false,
      onClick: onSelectTemplate,
      iconBg: 'bg-primary-soft text-primary',
      badge: 'Pre-made',
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Inspect live audience response rates, question stats, and participation trends.',
      icon: BarChart3,
      isPrimary: false,
      onClick: onSelectAnalytics,
      iconBg: 'bg-secondary/10 text-secondary',
      badge: 'Insights',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;

        if (act.isPrimary) {
          return (
            <Link
              key={act.id}
              to={act.to}
              className="group bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl p-6 border border-primary/20 shadow-soft hover:shadow-card transition-all flex flex-col justify-between active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{act.badge}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {act.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-white/15 flex items-center justify-between text-xs font-bold text-white">
                <span>Open Survey Builder</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        }

        return (
          <button
            key={act.id}
            onClick={act.onClick}
            type="button"
            className="group text-left bg-surface hover:bg-surface-secondary/50 rounded-2xl p-6 border border-border hover:border-primary/40 shadow-soft hover:shadow-card transition-all flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${act.iconBg} flex items-center justify-center border border-border group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-muted bg-surface-secondary px-2.5 py-0.5 rounded-full border border-border">
                  {act.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-text mb-1.5 group-hover:text-primary transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-border flex items-center justify-between text-xs font-semibold text-text group-hover:text-primary transition-colors">
              <span>Explore Section</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-muted group-hover:text-primary" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
