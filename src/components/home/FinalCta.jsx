import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="py-20 bg-brand-navy text-white relative overflow-hidden">
      {/* Background soft ambient decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-brand-navy-light/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-brand-orange mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Start Engaging Your Audience Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 leading-tight">
          Ready to turn every audience into active participants?
        </h2>

        <p className="text-base sm:text-xl text-blue-100/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Create your first survey in less than two minutes. No complex setups, no forced downloads — just real-time interaction that works.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 group"
          >
            <span>Create Your Free Survey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/join"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-xl border border-white/20 transition-colors inline-flex items-center justify-center"
          >
            Join Live Session
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Completely free to get started</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No participant registration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant QR code generation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
