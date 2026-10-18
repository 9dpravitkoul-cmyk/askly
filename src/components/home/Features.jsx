import React from 'react';
import { Cloud, BarChart3, QrCode, Zap, ArrowUpRight } from 'lucide-react';

export default function Features() {
  const features = [
    {
      id: 'word-cloud',
      icon: Cloud,
      title: 'Word Cloud',
      description: 'Visualize audience responses as a live word cloud. Watch popular thoughts grow dynamically as ideas flood in.',
      badge: 'Dynamic Text',
      accentColor: 'text-brand-navy',
      bgColor: 'bg-brand-light-blue',
    },
    {
      id: 'multiple-choice',
      icon: BarChart3,
      title: 'Multiple Choice',
      description: 'Collect votes and display results instantly with beautifully animated percentage distributions and bar graphs.',
      badge: 'Instant Tally',
      accentColor: 'text-brand-orange',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'easy-joining',
      icon: QrCode,
      title: 'Easy Joining',
      description: 'Let participants join through a simple numeric session code or scannable QR code. No apps or sign-ups required.',
      badge: 'Zero Friction',
      accentColor: 'text-brand-navy',
      bgColor: 'bg-brand-light-blue',
    },
    {
      id: 'live-insights',
      icon: Zap,
      title: 'Live Insights',
      description: 'Watch results update as people respond. Powered by real-time Firestore synchronization for smooth host presentations.',
      badge: 'Sub-second Sync',
      accentColor: 'text-brand-orange',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-light-gray px-3 py-1 rounded-full border border-brand-border-gray">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3 tracking-tight">
            Designed for Modern Presentations & Classes
          </h2>
          <p className="text-base sm:text-lg text-brand-text-secondary mt-3">
            Askly gives speakers, educators, and event organizers lightweight, reliable tools to keep every audience engaged from start to finish.
          </p>
        </div>

        {/* Feature Cards Grid (4 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-white rounded-2xl border border-brand-border-gray p-6 hover:shadow-lg hover:border-brand-navy/30 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center border border-brand-border-gray group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.accentColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-brand-text-secondary bg-brand-light-gray px-2.5 py-1 rounded-md border border-brand-border-gray">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-navy-light transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border-gray flex items-center text-xs font-semibold text-brand-navy gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
