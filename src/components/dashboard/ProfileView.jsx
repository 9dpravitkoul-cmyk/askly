import React from 'react';
import { User, Mail, ShieldCheck, Calendar, Key } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-brand-border-gray pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Host Profile</h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Manage your presenter profile and presenter credentials.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border-gray p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-brand-border-gray">
          <div className="w-16 h-16 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold text-xl shadow-xs">
            AM
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-navy">Prof. Alex Morgan</h3>
            <p className="text-xs text-brand-text-secondary">Host Presenter • Engineering Faculty</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Presenter Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-brand-navy mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value="Prof. Alex Morgan"
              className="w-full px-3.5 py-2.5 bg-brand-light-gray rounded-xl border border-brand-border-gray text-brand-text-primary"
            />
          </div>
          <div>
            <label className="block font-semibold text-brand-navy mb-1">Email Address</label>
            <input
              type="email"
              readOnly
              value="alex.morgan@university.edu"
              className="w-full px-3.5 py-2.5 bg-brand-light-gray rounded-xl border border-brand-border-gray text-brand-text-primary"
            />
          </div>
        </div>

        <div className="p-3 bg-brand-light-blue/40 rounded-xl border border-brand-border-gray text-xs text-brand-navy flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-orange flex-shrink-0" />
          <span>Firebase Authentication with Google sign-in and custom profile synchronization will be activated in Phase 3.</span>
        </div>
      </div>
    </div>
  );
}
