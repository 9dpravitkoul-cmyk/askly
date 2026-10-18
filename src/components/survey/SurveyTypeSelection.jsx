import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, Cloud } from 'lucide-react';
import Logo from '../common/Logo';

function WordCloudPreview() {
  return <div aria-label="Illustrative word cloud preview" className="flex h-32 items-center justify-center rounded-lg bg-[#F7F8FA]">
    <span className="relative grid h-20 w-24 place-items-center rounded-full bg-white text-accent-strong shadow-sm"><Cloud className="h-9 w-9" /><i className="absolute left-1 top-5 h-2 w-2 rounded-full bg-primary/20" /><i className="absolute right-1 top-7 h-3 w-3 rounded-full bg-accent/30" /><i className="absolute bottom-2 left-8 h-2 w-2 rounded-full bg-primary/30" /></span>
  </div>;
}

function MultipleChoicePreview() {
  return <div aria-label="Illustrative multiple choice preview" className="h-32 space-y-2.5 rounded-lg bg-[#F7F8FA] p-3.5">
    <p className="text-xs font-semibold text-text">What matters most?</p>
    {['Clear goals', 'Open feedback', 'Good teamwork'].map((label, index) => <div key={label} className="flex items-center gap-2"><span className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${index === 0 ? 'border-primary bg-primary' : 'border-slate-300 bg-white'}`}>{index === 0 && <span className="h-1 w-1 rounded-full bg-white" />}</span><span className="text-[11px] text-slate-600">{label}</span></div>)}
  </div>;
}

const choices = [
  { type: 'wordCloud', title: 'Word Cloud', description: 'Collect ideas and short responses from your audience.', label: 'Open-ended', cta: 'Choose Word Cloud', icon: Cloud, Preview: WordCloudPreview, accent: 'orange' },
  { type: 'multipleChoice', title: 'Multiple Choice', description: 'Let participants choose from predefined answers.', label: 'Quick polls', cta: 'Choose Multiple Choice', icon: BarChart3, Preview: MultipleChoicePreview, accent: 'navy' },
];

export default function SurveyTypeSelection() {
  return <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-white px-4 py-3 sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><Logo size="md" /><Link to="/dashboard" className="ui-interactive inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted hover:bg-background hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to workspace</Link></div></header>
    <main className="mx-auto flex max-w-6xl justify-center px-4 py-8 sm:px-6 sm:py-12">
      <section className="w-full rounded-2xl border border-border bg-white p-5 shadow-card sm:p-8 lg:p-10">
        <div className="mx-auto mb-7 max-w-xl text-center sm:mb-9"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-strong">Start a new survey</p><h1 className="mt-2.5 text-2xl font-bold leading-tight tracking-tight text-[#142E59] sm:text-3xl">How would you like to collect responses?</h1><p className="mt-2 text-sm leading-6 text-muted sm:text-base">Choose a format to start building your survey.</p></div>
        <div className="grid items-stretch gap-4 md:grid-cols-2">{choices.map(({ type, title, description, label, cta, icon: Icon, Preview, accent }) => <Link key={type} to={`/surveys/new?type=${type}`} aria-label={`${cta} and open the survey builder`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
          <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-4 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-card sm:p-5">
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${accent === 'orange' ? 'bg-accent' : 'bg-primary'}`} />
            <div className="mb-3 flex items-center justify-between gap-3 pt-1"><span className={`grid h-10 w-10 place-items-center rounded-lg ${accent === 'orange' ? 'bg-orange-50 text-accent-strong' : 'bg-primary-soft text-primary'}`}><Icon className="h-5 w-5" /></span><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">{label}</span></div>
            <Preview />
            <h2 className="mt-4 text-lg font-bold tracking-tight text-[#142E59]">{title}</h2>
            <p className="mt-1 min-h-10 text-sm leading-5 text-muted">{description}</p>
            <span className="mt-4 inline-flex min-h-10 items-center gap-2 self-start text-sm font-bold text-primary">{cta}<ArrowRight className="h-4 w-4 text-accent-strong transition-transform group-hover:translate-x-0.5" /></span>
          </article>
        </Link>)}</div>
      </section>
    </main>
  </div>;
}
