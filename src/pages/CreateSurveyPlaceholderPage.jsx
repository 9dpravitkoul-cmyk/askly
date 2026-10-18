import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { PlusCircle, ArrowLeft, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateSurveyPlaceholderPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-brand-border-gray px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-light-blue rounded-xl border border-brand-border-gray transition-colors"
          >
            Cancel
          </Link>
          <button
            disabled
            className="px-4 py-2 bg-slate-300 text-slate-500 text-xs font-semibold rounded-xl cursor-not-allowed"
          >
            Save Draft (Phase 4)
          </button>
        </div>
      </header>

      {/* Placeholder Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-6 sm:p-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl border border-brand-border-gray shadow-sm p-8 sm:p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-light-blue text-brand-navy flex items-center justify-center mx-auto mb-4 border border-brand-border-gray shadow-2xs">
            <PlusCircle className="w-7 h-7 text-brand-orange" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 4: Survey Creation & Firestore Persistence</span>
          </div>

          <h1 className="text-2xl font-bold text-brand-navy mb-2">
            {isEdit ? `Edit Survey: ${id}` : 'Create New Survey'}
          </h1>

          <p className="text-sm text-brand-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
            The dedicated survey creation page will feature an intuitive editor for Word Cloud and Multiple Choice questions, option reordering, and Firestore auto-save.
          </p>

          <div className="bg-brand-light-gray/70 rounded-xl p-5 border border-brand-border-gray text-left text-xs space-y-3 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multiple Choice: Add, edit, remove, and reorder options</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Word Cloud: Free-text questions with length limits</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real Firestore persistence and ownership security</span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Host Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
