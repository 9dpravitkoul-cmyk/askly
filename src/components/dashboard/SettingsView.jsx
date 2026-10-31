import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Moon, Sun, Monitor, Lock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsView() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-text">Workspace Settings</h2>
        <p className="mt-1 text-xs text-muted">
          Manage your interface appearance and review session security rules.
        </p>
      </div>

      {/* Theme Preference Card */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text">Appearance & Theme</h3>
          <p className="text-xs text-muted mt-0.5">
            Choose how Askly looks on your screen or match your system settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
              theme === 'light'
                ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/20'
                : 'border-border bg-surface-secondary/40 text-text hover:border-border hover:bg-surface-secondary'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-amber-500 shadow-2xs border border-border">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Light</p>
              <p className="text-[10px] text-muted">Clean bright contrast</p>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
              theme === 'dark'
                ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/20'
                : 'border-border bg-surface-secondary/40 text-text hover:border-border hover:bg-surface-secondary'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-indigo-400 shadow-2xs border border-slate-700">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Dark</p>
              <p className="text-[10px] text-muted">Deep navy & slate</p>
            </div>
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
              theme === 'system'
                ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/20'
                : 'border-border bg-surface-secondary/40 text-text hover:border-border hover:bg-surface-secondary'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-secondary shadow-2xs border border-border">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">System Default</p>
              <p className="text-[10px] text-muted">Match OS preference</p>
            </div>
          </button>
        </div>
      </section>

      {/* Security Architecture & Data Policy */}
      <section className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-text text-sm">Security & Architectural Rules</h3>
            <p className="text-xs text-muted">
              Built on production-grade Firestore security rules.
            </p>
          </div>
        </div>

        <div className="grid gap-4 text-xs text-muted leading-relaxed sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface-secondary/30 p-3.5">
            <h4 className="font-bold text-text mb-1">Frictionless Joining</h4>
            <p>
              Audience members join instantly without providing personal data or creating accounts. Firebase Anonymous Authentication generates a unique token to enforce single-vote integrity per question.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-secondary/30 p-3.5">
            <h4 className="font-bold text-text mb-1">Private Session Ownership</h4>
            <p>
              Only you, as the authenticated survey creator, can start live sessions, pause responses, and read private vote aggregates.
            </p>
          </div>
        </div>

        {/* Security / Password Action */}
        <div className="pt-2 flex items-center justify-between border-t border-border">
          <span className="text-xs text-muted flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>Need to update your host sign-in password?</span>
          </span>
          <Link
            to="/forgot-password"
            className="inline-flex rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary/40 hover:underline transition-all"
          >
            Reset Password
          </Link>
        </div>
      </section>
    </div>
  );
}
