import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#635BDB] via-[#534AC7] to-[#433BA8] py-16 text-white sm:py-24">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-[#42C6D8]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="page-shell text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-[#42C6D8]" />
          <span>Start Engaging Your Audience Today</span>
        </div>

        <h2 className="text-3xl font-black tracking-tight sm:text-5xl max-w-3xl mx-auto leading-tight">
          Ready to turn every audience into active participants?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg leading-relaxed font-normal">
          Create your first session in minutes. No complex setup or audience downloads—just an easy way to bring everyone into the conversation.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            to="/signup"
            className="ui-interactive inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-[#635BDB] shadow-lg hover:bg-slate-50 transition-all"
          >
            Create Your Free Survey
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/join"
            className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-white/25 px-7 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Join Live Session
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#42C6D8]" />
            <span>Completely free to start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#42C6D8]" />
            <span>No participant registration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#42C6D8]" />
            <span>Instant QR code generation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
