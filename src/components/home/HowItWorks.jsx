import React from 'react';
import { PlusCircle, QrCode, TrendingUp, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'Create Your Survey',
    description: 'Add Multiple Choice questions or Word Cloud prompts in seconds using our intuitive survey builder. Reorder, duplicate, and save drafts.',
    highlight: 'Flexible question types & instant drafting',
  },
  {
    step: '02',
    icon: QrCode,
    title: 'Share Session Code or QR',
    description: 'Launch your session and project the auto-generated 8-character PIN and scannable QR code on your presentation slide or projector.',
    highlight: 'Zero participant apps or account creation',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Collect Live Responses',
    description: 'Watch incoming audience answers synchronize live on your host screen with automated percentages, animated charts, and dynamic clouds.',
    highlight: 'Follow responses as they arrive',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-24 bg-background transition-colors duration-200">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-3">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            How Askly Works
          </h2>
          <p className="mt-3 text-base text-muted leading-relaxed">
            No friction, no steep learning curve. From question creation to live audience insights in under two minutes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-card border border-border bg-surface p-7 shadow-soft hover:shadow-card hover:border-primary/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary font-bold shadow-2xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-border">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-2 text-xs font-medium text-text">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
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
