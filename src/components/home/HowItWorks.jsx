import React from 'react';

const steps = [
  { step: '01', title: 'Write the questions', body: 'Add multiple-choice options or a word-cloud prompt. Save privately, then launch when you are ready.' },
  { step: '02', title: 'Put the code on screen', body: 'Askly shows a large join code, a production HTTPS QR, and a copyable participant link.' },
  { step: '03', title: 'Watch answers arrive', body: 'Votes land in Firestore. Host charts update live. Close the session when you are done.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-strong">Workflow</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">From blank page to live room.</h2>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step} className="rounded-card border border-border bg-white p-6 shadow-soft">
              <p className="font-mono text-sm font-bold text-accent-strong">{item.step}</p>
              <h3 className="mt-3 text-lg font-bold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
