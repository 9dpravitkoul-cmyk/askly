import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import SamplePollPreview from './SamplePollPreview';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-network-pattern pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-brand-border-gray">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-light-blue/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-light-blue border border-brand-border-gray text-xs sm:text-sm font-semibold text-brand-navy shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span>Smart Polling, Real Insights</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.12]">
              Turn Every Voice Into <span className="text-brand-orange">Insight.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-brand-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Create interactive polls, collect audience opinions in real time, and turn responses into meaningful insights — all in one simple platform.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-brand-navy hover:bg-brand-navy-light rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
              >
                <span>Create a Survey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/join"
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-brand-navy bg-white hover:bg-brand-light-blue border border-brand-border-gray rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-brand-orange" />
                <span>Join a Session</span>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-brand-text-secondary">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero participant sign-up required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>Live word cloud & poll charts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-navy flex-shrink-0" />
                <span>Firebase-powered real-time sync</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Interactive Poll Preview */}
          <div className="lg:col-span-5 relative">
            {/* Subtle decorative card backdrop */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 rounded-3xl blur-md -z-10" />
            <SamplePollPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
