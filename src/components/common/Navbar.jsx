import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, QrCode, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isAnonymous);
  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const close = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md transition-colors duration-200">
      <div className="page-shell">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5"
            >
              How It Works
            </button>
            <Link
              to="/join"
              className="inline-flex items-center gap-1.5 text-text hover:text-primary transition-colors font-medium"
            >
              <QrCode className="h-4 w-4 text-accent" />
              Join a Session
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {signedIn ? (
              <Link
                to="/dashboard"
                className="ui-interactive inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-text hover:bg-surface-secondary hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="ui-interactive inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Bar: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-xl p-2 text-muted hover:bg-surface-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text hover:bg-surface-secondary"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text hover:bg-surface-secondary"
            >
              How It Works
            </button>
            <Link
              to="/join"
              onClick={close}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-surface-secondary"
            >
              <span className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-accent" />
                Join a Session
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                PIN / QR
              </span>
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {signedIn ? (
              <Link
                to="/dashboard"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                Open Host Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={close}
                  className="rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-text hover:bg-surface-secondary"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={close}
                  className="rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white shadow-sm"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
