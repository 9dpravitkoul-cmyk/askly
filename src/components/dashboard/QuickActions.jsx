import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layers, BarChart3, ArrowRight } from 'lucide-react';

export default function QuickActions({ onSelectTemplate, onSelectAnalytics }) {
  const actions = [
    {
      id: 'create',
      title: 'Create New Survey',
      description: 'Start from scratch with custom Multiple Choice or Word Cloud questions.',
      icon: Plus,
      isPrimary: true,
      to: '/surveys/new',
      badge: 'Start here',
    },
    {
      id: 'template',
      title: 'Use Template',
      description: 'Choose pre-built templates for lectures, icebreakers, or team reviews.',
      icon: Layers,
      isPrimary: false,
      onClick: onSelectTemplate,
      iconBg: 'bg-brand-light-blue text-brand-navy',
      badge: 'Pre-made',
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Inspect participant participation rates and historical poll trends.',
      icon: BarChart3,
      isPrimary: false,
      onClick: onSelectAnalytics,
      iconBg: 'bg-brand-light-blue text-brand-navy',
      badge: 'Reports',
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
              className="group bg-brand-navy hover:bg-brand-navy-light text-white rounded-2xl p-5 border border-brand-navy shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-orange border border-white/15 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-orange bg-white/10 px-2 py-0.5 rounded border border-white/10">
                    {act.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {act.title}
                </h3>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-blue-100 group-hover:text-white">
                <span>New Survey Editor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        }

        return (
          <button
            key={act.id}
            onClick={act.onClick}
            type="button"
            className="group text-left bg-white hover:bg-brand-light-gray/50 rounded-2xl p-5 border border-brand-border-gray hover:border-slate-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className={`w-10 h-10 rounded-xl ${act.iconBg} flex items-center justify-center border border-brand-border-gray group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-brand-text-secondary bg-brand-light-gray px-2 py-0.5 rounded border border-brand-border-gray">
                  {act.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-brand-navy mb-1 group-hover:text-brand-navy-light transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-border-gray flex items-center justify-between text-xs font-medium text-brand-navy">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-brand-text-secondary" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
