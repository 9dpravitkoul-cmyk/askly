import React from 'react';
import { BarChart3, Cloud, QrCode, Radio, ArrowUpRight, Zap } from 'lucide-react';

const features = [
  {
    icon: Radio,
    title: 'Live Interactive Polls',
    badge: 'Instant Tally',
    description: 'Launch multiple-choice questions live. Watch option distributions, vote counts, and percentages recalculate instantly.',
    accentColor: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Cloud,
    title: 'Dynamic Word Clouds',
    badge: 'Live Scaling',
    description: 'Collect free-text responses from your audience. Words automatically group by frequency and scale dynamically.',
    accentColor: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: QrCode,
    title: 'Frictionless QR Joining',
    badge: 'No App Needed',
    description: 'Participants simply scan the high-resolution QR code on their phone or enter the 8-character PIN. No accounts required.',
    accentColor: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Zap,
    title: 'Clear Audience Insights',
    badge: 'Sub-Second Sync',
    description: 'Follow audience responses as they arrive, manage your session, and review the results when you finish.',
    accentColor: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y border-border bg-surface py-16 sm:py-24 transition-colors duration-200">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-3">
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Designed for Modern Presentations & Classes
          </h2>
          <p className="mt-3 text-base text-muted leading-relaxed">
            Askly gives speakers, educators, and event organizers lightweight, reliable tools to keep every audience engaged from start to finish.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, badge, description, accentColor, bg }) => (
            <article
              key={title}
              className="group flex flex-col justify-between rounded-card border border-border bg-surface p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${bg} ${accentColor} shadow-2xs group-hover:scale-105 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-muted bg-surface-secondary px-2.5 py-0.5 rounded-md border border-border">
                    {badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
