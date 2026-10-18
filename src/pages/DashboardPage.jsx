import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { LayoutDashboard, Plus, ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col">
      <header className="bg-white border-b border-brand-border-gray px-6 py-4 flex items-center justify-between">
        <Logo size="md" />
        <Link
          to="/"
          className="text-xs text-brand-navy font-semibold flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>
      <div className="flex-grow flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl border border-brand-border-gray shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-light-blue text-brand-navy flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy mb-2">Host Dashboard Preview</h2>
          <p className="text-sm text-brand-text-secondary mb-6">
            Phase 1 is complete! The Host Dashboard layout (sidebar, quick action cards, survey tabs, and workspace) is scheduled for implementation in Phase 2.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-xl hover:bg-brand-navy-light transition-colors"
          >
            Explore Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
