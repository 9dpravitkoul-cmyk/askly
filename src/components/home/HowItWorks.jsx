import React from 'react';
import { PlusCircle, Share2, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: PlusCircle,
      title: 'Create your survey',
      description: 'Add Multiple Choice questions or Word Cloud prompts in seconds using our intuitive survey builder.',
      highlight: 'Flexible question types & instant drafting',
    },
    {
      step: '02',
      icon: Share2,
      title: 'Share session code or QR',
      description: 'Display the auto-generated session code or high-res QR code on your presentation slide or projector.',
      highlight: 'Zero participant apps or account creation',
    },
    {
      step: '03',
      icon: TrendingUp,
      title: 'Collect responses & explore live results',
      description: 'Watch incoming audience answers synchronize live on your host screen with automated percentages and clouds.',
      highlight: 'Sub-second real-time Firestore sync',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-brand-light-gray border-y border-brand-border-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-brand-border-gray">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3 tracking-tight">
            How Askly Works
          </h2>
          <p className="text-base sm:text-lg text-brand-text-secondary mt-3">
            No friction, no steep learning curve. From question creation to live audience insights in under two minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl border border-brand-border-gray p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-light-blue text-brand-navy flex items-center justify-center font-bold text-lg border border-brand-border-gray">
                    <Icon className="w-6 h-6 text-brand-navy" />
                  </div>
                  <span className="text-2xl font-black text-brand-border-gray font-mono">
                    {item.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-text-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border-gray flex items-center gap-2 text-xs font-medium text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
