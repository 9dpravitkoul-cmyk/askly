import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, QrCode, X } from 'lucide-react';
import Logo from './Logo';
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
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="page-shell">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo size="md" />
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <button type="button" onClick={() => scrollToSection('features')} className="hover:text-primary">Features</button>
            <button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:text-primary">How it works</button>
            <Link to="/join" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover">
              <QrCode className="h-4 w-4 text-accent-strong" />
              Join a session
            </Link>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {signedIn && <Link to="/dashboard" className="ui-interactive hidden min-h-10 items-center rounded-lg border border-border px-4 text-sm font-semibold text-primary hover:bg-primary-soft lg:inline-flex">Open workspace</Link>}
            <Link to="/login" className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft">Log in</Link>
            <Link to="/signup" className="ui-interactive inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-strong">Sign up</Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="space-y-1 border-t border-border bg-white px-4 py-4 md:hidden">
          <button type="button" onClick={() => scrollToSection('features')} className="block w-full rounded-lg px-3 py-2.5 text-left font-medium text-text hover:bg-background">Features</button>
          <button type="button" onClick={() => scrollToSection('how-it-works')} className="block w-full rounded-lg px-3 py-2.5 text-left font-medium text-text hover:bg-background">How it works</button>
          <Link to="/join" onClick={close} className="block rounded-lg px-3 py-2.5 font-medium text-primary hover:bg-background">Join a session</Link>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {signedIn && <Link to="/dashboard" onClick={close} className="rounded-lg border border-border py-2.5 text-center text-sm font-semibold text-primary">Open workspace</Link>}
            <Link to="/login" onClick={close} className="rounded-lg border border-border py-2.5 text-center text-sm font-semibold text-primary">Log in</Link>
            <Link to="/signup" onClick={close} className="rounded-lg bg-accent py-2.5 text-center text-sm font-semibold text-white">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
