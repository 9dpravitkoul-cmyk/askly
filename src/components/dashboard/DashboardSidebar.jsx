import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  Home,
  FileQuestion,
  Layers,
  BarChart3,
  User,
  Settings,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'surveys', label: 'My Surveys', icon: FileQuestion },
  { id: 'templates', label: 'Templates', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar({
  currentView = 'surveys',
  onSelectView,
  isOpen = false,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  const handleNavClick = (id) => {
    onSelectView?.(id);
    onClose?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Workspace navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border bg-surface transition-transform duration-200 motion-reduce:transition-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Navigation Links */}
        <div>
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Logo size="md" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-text lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Host navigation" className="space-y-1 p-3">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = currentView === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => handleNavClick(id)}
                  className={`relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-soft font-bold text-primary shadow-2xs'
                      : 'text-muted hover:bg-surface-secondary hover:text-text'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-primary" />
                  )}
                  <Icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Promotional Card & Info */}
        <div className="p-4 border-t border-border">
          <div className="rounded-2xl border border-border bg-surface-secondary p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface border border-border text-accent mb-2.5 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-text leading-snug">
              Turn ideas into insights
            </h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Create engaging polls and get real-time results.
            </p>
            <Link
              to="/surveys/new"
              onClick={onClose}
              className="ui-interactive mt-3.5 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white shadow-xs hover:bg-primary-hover"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Survey</span>
            </Link>
          </div>

          <div className="mt-3 px-1 flex items-center justify-between text-[11px] text-muted">
            <span>Askly SaaS v2.0</span>
            <Link to="/" className="text-primary hover:underline font-medium">
              Public Home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
