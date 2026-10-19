import React from 'react';
import { BarChart3, Cloud, QrCode, Radio } from 'lucide-react';

const features = [
  { icon: Radio, title: 'Live polls', description: 'Open a session and collect answers while you present. Status stays honest: live or ended.' },
  { icon: Cloud, title: 'Word clouds', description: 'Short responses cluster by frequency so popular language stands out without unsafe HTML.' },
  { icon: QrCode, title: 'QR joining', description: 'Share an 8-character code or a scannable link. Guests vote without creating an account.' },
  { icon: BarChart3, title: 'Real-time insights', description: 'Host charts update from actual Firestore votes. Empty rooms stay empty until someone answers.' },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y border-border bg-white py-16 sm:py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-strong">What you can run</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Built for the moment the room goes quiet.</h2>
          <p className="mt-3 text-base text-muted">Askly is a live polling room, not a survey dump. Create, share, collect, and show results in one pass.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-card border border-border bg-background p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary shadow-soft">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
